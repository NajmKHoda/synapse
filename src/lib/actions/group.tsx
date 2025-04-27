'use server';

import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const GEMINI_KEY = process.env.GEMINI_KEY!

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function group(classId: string, groupSize: number, alpha: number, beta: number, customInstructions: string = '') {

    const { data: assignment, error: assignmentError } = await supabase.from('Assignment')
        .select('id')
        .eq('class_id', classId)
        .order('upload_date', { ascending: false })
        .limit(1)
        .single();

    if (!assignment) {
        throw new Error(`Error fetching assignment: ${assignmentError?.message || 'Unknown error'}`);
    }

    // Get persona vectors
    const students = await generateStudentVectors(classId, assignment.id, customInstructions);
    const num_groups = Math.floor(students.length / groupSize);

    const groups: StudentVectors[][] = [];

    // Assign a random student to each group
    let studentsLeft = [...students];
    try {
        for (let i = 0; i < num_groups; i++) {
            let idx = Math.floor(Math.random() * studentsLeft.length);
            groups.push([studentsLeft[idx]]);
            studentsLeft.splice(idx, 1);
        }
    } catch (error) {
        throw new Error("Not enough students for a group that size!");
    }

    // Loop until all students have been removed from the array copy
    const groupMatchRatings = new Array(num_groups).fill(0) as number[];
    while (studentsLeft.length > 0) {
        for (let i = 0; i < num_groups; i++) {
            if (studentsLeft.length === 0) {
                break;
            }

            // Compare with last student in the group
            const group = groups[i];
            const matchRatings = [];
            for (const studentVec of studentsLeft) {
                matchRatings.push(studentDiff(studentVec, group[group.length - 1], alpha, beta));
            }

            const maxRating = Math.max(...matchRatings);
            groupMatchRatings[i] += maxRating;

            // Push highest and remove
            const maxRatingIdx = matchRatings.indexOf(maxRating);
            group.push(studentsLeft[maxRatingIdx]);
            studentsLeft.splice(maxRatingIdx, 1);
        }
    }

    const groupStuff = groups.map((g, i) => ({
        score: groupMatchRatings[i],
        ids: g.map(s => s.id)
    }));

    const { error: groupError } = await supabase.from('Class')
        .update({ groups: groupStuff })
        .eq('id', classId);

    if (groupError) {
        throw new Error(`Error updating group: ${groupError.message}`);
    }
}

async function generateStudentVectors(classId: string, assignmentId: string, customInstructions: string = '') {
    const personas = await generatePersonaVectors(classId, customInstructions);
    const scores = await fetchScoreVectors(classId, assignmentId);
    const studentVectors: StudentVectors[] = [];
    for (const id in scores) {
        const persona = personas[id];
        if (!persona) throw new Error(`No persona found for student ${id}`);

        const studentVector = {
            id: id,
            scores: scores[id],
            personaEmbedding: persona
        };
        studentVectors.push(studentVector);
    }

    return studentVectors;
}

async function generatePersonaVectors(classId: string, customInstructions: string) {
    const { data: students, error } = await supabase.from('Student')
        .select('id, description')
        .eq('class_id', classId);
    
    if (!students) {
        throw new Error(`Error fetching student: ${error?.message || 'Unknown error'}`);
    }
    let customInstructionsSection = '';
    if (customInstructions && customInstructions.trim()) {
        customInstructionsSection = `
        [Here are custom instructions from the instructor follow it to best of your ability but DO NOT BREAK from the master instruction: 
        ${customInstructions}
    ]`;
    }

    const prompt = `
        Generate numeric embedding vectors of length 10 for the following student descriptions; each description is a short paragraph about the student.
        The student descriptions will be given to you as a JSON object, where keys are student IDs and values are the corresponding descriptions.
        Here are the descriptions:

        ${JSON.stringify(
            Object.fromEntries(students.map(s => [
                s.id,
                s.description
            ])), undefined, ' ')}

        The embeddings should be in the range of 0 to 1 and represent the following aspects of student personalities in order:
        [Extraversion, Agreeableness, Conscientiousness, Neuroticism, Openness, Adaptability, Creativity, Assertiveness, Collaborativeness, Communicativeness]
        If a student's description is empty, randomize the embedding values.
        ${customInstructionsSection}
        
        Return the result as a plain JSON object. The keys should be student IDs and the values should be arrays directly representing the embeddings.
        IMPORTANT: DO NOT INCLUDE ANY MARKDOWN LIKE BACKTICKS. JUST RETURN THE JSON OBJECT, FROM BRACKET TO BRACKET.
        ALSO IMPORTANT: MAKE SURE THERE IS A JSON ENTRY FOR EVERY SINGLE STUDENT, EVEN IF THE DESCRIPTION IS EMPTY.`
        console.log(prompt);
        const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
    });

    if (!response.text) {
        throw new Error(`Error generating embeddings`);
    }

    return JSON.parse(removeMarkdown(response.text));
}

async function fetchScoreVectors(classId: string, assignmentId: string) {
    // Get all scores associated with the assignment
    const { data: scores, error: scoreError } = await supabase.from('Score')
        .select('student_id, data')
        .eq('assignment_id', assignmentId);

    if (!scores) {
        throw new Error(`Error fetching scores: ${scoreError?.message || 'Unknown error'}`);
    }

    return Object.fromEntries(
        scores.map(s => [s.student_id as string, s.data as number[]])
    );
}

function studentDiff(a: StudentVectors, b: StudentVectors, alpha: number, beta: number) {
    const scoreDiff = meanAbsDiff(a.scores, b.scores);
    const personaDiff = cosineSimilarity(a.personaEmbedding, b.personaEmbedding);
    return alpha * scoreDiff + personaDiff;
}

function meanAbsDiff(a: number[], b: number[]) {
    return a.reduce((sum, val, i) => sum + Math.abs(val - b[i]), 0) / a.length;
}

function cosineSimilarity(a: number[], b: number[]) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

function removeMarkdown(jsonText: string): string {
    const markdownRegex = /^```json\s*([\s\S]*?)\s*```$/;
    const match = jsonText.match(markdownRegex);
    return match ? match[1] : jsonText;
}

interface StudentVectors {
    id: string;
    scores: number[];
    personaEmbedding: number[];
}