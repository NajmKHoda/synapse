'use server';

import Papa from 'papaparse';
import Student from '@/lib/dtos/Student';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

export default async function parseCSV(file: File) {
    const serialFile = await file.text();

    const result = await new Promise<Papa.ParseResult<CSVRow>>((resolve, reject) => {
        (Papa as any).parse(serialFile as string, {
            skipFirstNLines: 1,
            skipEmptyLines: true,
            complete: (r: any) => resolve(r),
            error: (e: any) => reject(e)
        })
    });

    /*
    const batch = writeBatch(db);
    const colRef = collection(db, "students");

    result.data.forEach(row => {
        const docRef = doc(colRef);
        const [name, email, ...scores] = row;
        batch.set(docRef, { name, email, scores });
    })

    await batch.commit();
    */

    return result.data;
}

type CSVRow = [name: string, email: string, ...scores: string[]]