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

    let rows: CSVRow[];
    try {
        rows = CSVSchema.parse(result.data);
    } catch (e) {
        throw new Error(`CSV validation failed: ${(e as any).message}`)
    }
    
    // Create assignment associated with CSV
    const { data: assignments, error: assignmentError } = await supabase.from('Assignment')
        .insert([{ name: file.name, class_id: classId, max_points: [], }])
        .select();

    if (assignmentError) {
        console.log('Failed to create assignment:', assignmentError);
        return false;
    }
    const assignmentId = assignments[0].id;

    // Create students associated with class from CSV
    const { data: students, error: studentError } = await supabase.from('Student')
        .insert(rows.map(r => ({
            name: r[0],
            email: r[1],
            class_id: classId
        })))
        .select('name, id');
    
    if (studentError) {
        console.log('Failed to create students:', studentError);
        return false;
    }
    const studentIds = Object.fromEntries(students.map(s => [s.name, s.id]));
    
    // Create scores associated with students and assignment
    const { error: scoreError } = await supabase.from('Score')
        .insert(rows.map(r => ({
            student_id: studentIds[r[0]],
            assignment_id: assignmentId,
            data: r.slice(2)
        })));
    
    if (scoreError) {
        console.log('Failed to create scores:', scoreError);
        return false;
    }

    return true
}

const CSVSchema = z
    .array(
        z.tuple([z.string(), z.string()])
        .rest(z.preprocess(x => Number(x), z.number()))
    ).refine(rows => {
        if (rows.length === 0) return true;
        const len = rows[0].length;
        return rows.every(r => r.length === len);
    }, { message: 'All rows must have the same number of columns' });

type CSVRow = z.infer<typeof CSVSchema>[number];