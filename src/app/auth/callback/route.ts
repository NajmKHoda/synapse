import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
    
    // Get the user data
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if teacher record exists
      const { data: teacherData } = await supabase
        .from('Teacher')
        .select('id')
        .eq('id', user.id)
        .single();
      
      // If no teacher record exists, create one
      if (!teacherData) {
        // Get user's name from their profile if available
        const name = user.user_metadata?.full_name || 
                    `${user.user_metadata?.given_name || ''} ${user.user_metadata?.family_name || ''}`.trim() || 
                    user.email?.split('@')[0] || 
                    'New Teacher';
        
        await supabase
          .from('Teacher')
          .insert([{ id: user.id, name: name }]);
      }
    }
  }
  
  // Redirect to the dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
