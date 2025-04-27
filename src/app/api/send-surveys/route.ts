// app/api/send-surveys/route.ts  or  pages/api/send-surveys.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend }       from 'resend'

// Initialize Supabase & Resend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY!)

// Handler
export async function POST(request: Request) {
  try {
    const { classId } = await request.json()
    if (!classId) {
      return NextResponse.json({ error: 'Missing classId' }, { status: 400 })
    }

    // Fetch students still missing a description
    const { data: allStudents, error } = await supabase
      .from('Student')
      .select('id, email, description')
      .eq('class_id', classId)
      .or('description.is.null,description.eq.""')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const students = allStudents || []
    if (students.length === 0) {
      return NextResponse.json({ count: 0 })
    }

    // Compute your app’s base URL from the incoming request
    const origin = new URL(request.url).origin

    // Send each email and mark “emailed”
    await Promise.all(
      students.map(async (student) => {
        if (!student.email) return
        console.log(`Sending email to ${student.email}`)
        const surveyLink = `${origin}/personality/student/${student.id}/form`

        await resend.emails.send({
          from:    'no-reply@ahmadwajid.com',    // your verified domain
          to:      student.email,
          subject: '🧠 Your Synapse Personality Assessment',
          html: `
            <p>Help us pair you up! Answer four quick questions and write one line about yourself:</p>
            <a href="${surveyLink}">Start the assessment →</a>
          `,
        })

        await supabase
          .from('Student')
          .update({ emailed: true })
          .eq('id', student.id)
      })
    )

    return NextResponse.json({ count: students.length })

  } catch (err) {
    console.error('Error sending surveys:', err)
    return NextResponse.json(
      { error: 'Failed to send assessments' },
      { status: 500 }
    )
  }
}
