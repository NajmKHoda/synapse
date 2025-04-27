'use server';

import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const GEMINI_KEY = process.env.GEMINI_KEY!

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function group(classId: string, groupSize: number) {

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
    const students = await generateStudentVectors(classId, assignment.id);
    const num_groups = Math.round(students.length / groupSize);

    const groups: StudentVectors[][] = [];

    let studentsLeft = [...students];
    for (let i = 0; i < num_groups; i++) {
        let idRandom = Math.floor(Math.random() * studentsLeft.length);
        let last = studentsLeft[idRandom];

        // Push to group, remove from studentsLeft
        groups.push([last]);
        studentsLeft.splice(idRandom, 1);

        while (groups[i].length < groupSize && studentsLeft.length > 0) {
            const minDiff = Number.MAX_VALUE;
            for (const student of studentsLeft) {
                const diff = studentDiff(last, student, 0.5);
                if (diff < minDiff) {
                    groups[i].push(student);
                    last = student;
                    studentsLeft.splice(studentsLeft.indexOf(student), 1);
                    break;
                }
            }
        }
    }

    const idGroups = groups.map(group => group.map(student => student.id));

    const { data: groupRecords, error: groupError } = await supabase.from('GroupRecord')
        .insert(groups.map(() => ({ assignment_id: assignment.id })))
        .select('id');
    
    if (!groupRecords) {
        throw new Error(`Error creating group record: ${groupError?.message || 'Unknown error'}`);
    }

    const groupIds = groupRecords.map(record => record.id);

    const { error: joinError } = await supabase.from('StudentGroupJoin')
        .insert(groups.flatMap((group, i) => 
            group.map(student => ({
                student_id: student.id,
                group_id: groupIds[i]
            }))
        ));

    if (joinError) {
        throw new Error(`Error joining students to groups: ${joinError?.message || 'Unknown error'}`);
    }
}


async function generateStudentVectors(classId: string, assignmentId: string) {
    const personas = await generatePersonaVectors(classId);
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

    return studentVectors;}

async function generatePersonaVectors(classId: string) {
    const { data: students, error } = await supabase.from('Student')
        .select('id, description')
        .eq('class_id', classId);
    
    if (!students) {
        throw new Error(`Error fetching student: ${error?.message || 'Unknown error'}`);
    }

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-exp-03-07',
        contents: students.map((student) => student.description),
    });

    if (!response.embeddings) {
        throw new Error(`Error generating embeddings`);
    }

    return Object.fromEntries(
        response.embeddings.map((e, i) => [students[i].id, e.values!])
    ) as Record<string, number[]>;
}

async function fetchScoreVectors(classId: string, assignmentId: string) {
    // Get all scores associated with the assignment
    const { data: scores, error: scoreError } = await supabase.from('Scores')
        .select('student_id, data')
        .eq('assignment_id', assignmentId);

    if (!scores) {
        throw new Error(`Error fetching scores: ${scoreError?.message || 'Unknown error'}`);
    }

    return Object.fromEntries(
        scores.map(s => [s.student_id as string, s.data as number[]])
    );
}

function studentDiff(a: StudentVectors, b: StudentVectors, alpha: number) {
    const scoreDiff = meanAbsDiff(a.scores, b.scores);
    const personaDiff = cosineSimilarity(a.personaEmbedding, b.personaEmbedding);
    return alpha * scoreDiff + personaDiff * (1 - alpha);
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


interface StudentVectors {
    id: string;
    scores: number[];
    personaEmbedding: number[];
}