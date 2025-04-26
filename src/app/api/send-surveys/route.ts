import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { classId } = await request.json();
    
    if (!classId) {
      return NextResponse.json({ error: 'Missing classId' }, { status: 400 });
    }

    // Fetch all students for the class with their description field
    const { data: allStudents, error } = await supabase
      .from('Student')
      .select('id, email, description')
      .eq('class_id', classId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Filter students who need assessments (empty or null description)
    const students = allStudents.filter(student => 
      !student.description || student.description.trim() === ''
    );

    if (students.length === 0) {
      return NextResponse.json({ count: 0 });
    }

    // 2) Send all of them an email via Resend
    const emailPromises = students.map(async (student) => {
      if (!student.email) return null;
      
      const assessmentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/personality/student/${student.id}/form`;
      
resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'cwajid.ahmad@gmail.com',
  subject: 'Hello World',
  html: '<p>erfertertsending your <strong>first email</strong>!</p>'
});

      return resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [student.email],
        subject: '🧠 Your Personality Assessment',
        html: `
          <p>Please complete this quick personality assessment to help with your team pairing:</p>
          <a href="${assessmentUrl}">
            Start the assessment →
          </a>
        `,
      });
    });

    await Promise.all(emailPromises.filter(Boolean));

    return NextResponse.json({ count: students.length });
  } catch (error) {
    console.error('Error sending surveys:', error);
    return NextResponse.json(
      { error: 'Failed to send assessments' },
      { status: 500 }
    );
  }
}
