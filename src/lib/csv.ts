'use server';

import Papa from 'papaparse';
import z from 'zod';

export default async function parseCSV(file: File) {
    const serialFile = await file.text();

    const result = await new Promise<Papa.ParseResult<unknown>>((resolve, reject) => {
        (Papa as any).parse(serialFile as string, {
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
    
    /*
    const batch = writeBatch(db);
    const colRef = collection(db, "students");

    rows.forEach(row => {
        const docRef = doc(colRef);
        const [name, email, ...scores] = row;
        batch.set(docRef, { name, email, scores });
    })

    await batch.commit();
    */

    return result.data;
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