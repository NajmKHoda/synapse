// app/api/send-surveys/route.ts  or  pages/api/send-surveys.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend }       from 'resend'

// Initialize Supabase & Resend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const students = allStudents || []
    if (students.length === 0) {
      return NextResponse.json({ count: 0 })
    }

    // Compute your app’s base URL from the incoming request
    const origin = new URL(request.url).origin
    console.log(`Origin: ${origin}`)
    // Track email success/failures
    let successCount = 0
    let failureCount = 0

    // Send each email and mark "emailed"
    await Promise.all(
      students.map(async (student) => {
        if (!student.email) return
        const surveyLink = `${origin}/personality/student/${student.id}/form`

        console.log(`Attempting to send email to ${student.email}...`)
        
        try { 

          const emailResponse = await resend.emails.send({
            from: 'no-reply@ahmadwajid.com',  // Proper format with name
            to: `${student.email}`,
            subject: '🧠 Your Synapse Personality Assessment',
             html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Synapse Personality Assessment</h2>
                <p>Help us pair you up! Answer four quick questions and write one line about yourself:</p>
                <p style="margin: 25px 0;">
                  <a href="${surveyLink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Start the assessment →
                  </a>
                </p>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p>${surveyLink}</p>
                <p>Thank you!</p>
              </div>
            `,
          })
          
          console.log(`✅ Email sent successfully to ${student.email}`, emailResponse.data)
          
          // Only mark as emailed if successful
          await supabase
            .from('Student')
            .update({ emailed: true })
            .eq('id', student.id)
          
          successCount++
        } catch (emailError) {
          console.error(`❌ Failed to send email to ${student.email}:`, emailError)
          // Log more details about the error
          if (emailError instanceof Error) {
            console.error(`Error message: ${emailError.message}`)
            console.error(`Error stack: ${emailError.stack}`)
          }
          failureCount++
        }
      })
    )

    console.log(`Email sending complete. Success: ${successCount}, Failed: ${failureCount}`)

    return NextResponse.json({ 
      total: students.length,
      sent: successCount,
      failed: failureCount
    })

  } catch (err) {
    console.error('Error sending surveys:', err)
    return NextResponse.json(
      { error: 'Failed to send assessments' },
      { status: 500 }
    )
  }
}
