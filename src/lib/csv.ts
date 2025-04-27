import Papa from 'papaparse';
import z from 'zod';
import { supabase } from './supabase';

export default async function parseCSV(file: File, classId: string) {
    const result = await new Promise<Papa.ParseResult<unknown>>((resolve, reject) => {
        (Papa as any).parse(file, {
            skipFirstNLines: 1,
            skipEmptyLines: true,
            complete: (r: any) => resolve(r),
            error: (e: any) => reject(e)
        })
    });

    // Get existing students
    const { data: existingStudents, error: existingStudentsError } = await supabase.from('Student')
        .select('id, email')
        .eq('class_id', classId);
    if (existingStudentsError) {
        console.log('Failed to fetch existing students:', existingStudentsError);
        return false;
    }

    let students: Student[] = [];
    try {
        let csv = CSVSchema.parse(result.data);
        let maxScores = csv[0].slice(2) as number[];
        let rows: StudentRow[] = csv.slice(1);
        students = rows.map(r => ({
            id: existingStudents.find(e => e.email === r[1])?.id || null,
            name: r[0],
            email: r[1],
            scores: r.slice(2).map((score, i) => {
                return Math.min(1, (score as number) / maxScores[i]);
            })
        }));
    } catch (e) {
        throw new Error(`CSV validation failed: ${(e as any).message}`)
    }

    // Create assignment associated with CSV
    const { data: assignment, error: assignmentError } = await supabase.from('Assignment')
        .insert([{ name: file.name, class_id: classId }])
        .select().single();
    if (assignmentError) {
        console.log('Failed to create assignment:', assignmentError);
        return false;
    }

    // Create students that don't exist yet
    const { data: studentIds, error: studentIdsError } = await supabase.from('Student')
        .insert(students.filter(s => s.id === null).map(s => ({
            name: s.name,
            email: s.email,
            class_id: classId
        })))
        .select('email, id');
    if (studentIdsError) {
        console.log('Failed to create students:', studentIdsError);
        return false;
    }

    // Put IDs in new students
    const studentIdMap = Object.fromEntries(studentIds.map(s => [s.email, s.id]));
    students.forEach(s => s.id ??= studentIdMap[s.email]);
    
    // Create scores associated with students and assignment
    const { error: scoreError } = await supabase.from('Score')
        .insert(students.map(s => ({
            student_id: s.id,
            assignment_id: assignment.id,
            data: s.scores
        })));
    if (scoreError) {
        console.log('Failed to create scores:', scoreError);
        return false;
    }

    return true;
}

const CSVSchema = z
    .tuple([
        z.tuple([z.literal(''), z.literal('')])
        .rest(z.preprocess(x => Number(x), z.number())),
    ])
    .rest(
        z.tuple([z.string(), z.string()])
        .rest(z.preprocess(x => Number(x), z.number()))
    ).refine(rows => {
        if (rows.length === 0) return true;
        const len = rows[0].length;
        return rows.every(r => r.length === len);
    }, { message: 'All rows must have the same number of columns' });

type CSVSchema = z.infer<typeof CSVSchema>;
type StudentRow = CSVSchema[1];

interface Student {
    id: string | null;
    name: string;
    email: string;
    scores: number[];
}