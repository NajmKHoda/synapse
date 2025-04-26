'use client';

import parseCSV from '@/lib/csv';
import { useActionState } from 'react'

export default function UploadPage() {
    const [json, formAction] = useActionState<any[], FormData>(submitFile, [])

    async function submitFile(_: any, formData: FormData) {
        const json = await parseCSV(formData.get('file') as File);
        return json;
    }

    return (
        <>
            <form action={formAction}>
                <h1 className='text-center'>Upload File</h1>
                <input type='file' accept='.csv' name='file' />
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}