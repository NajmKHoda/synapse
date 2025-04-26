import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      // Exchange the code for a session and capture the result
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        return NextResponse.redirect(new URL('/error?message=auth-exchange-error', request.url));
      }
      
      // Get the user data with explicit await
      const userResponse = await supabase.auth.getUser();
      const { data: { user }, error: userError } = userResponse;
      
      if (userError) {
        console.error('Error getting user:', userError);
        return NextResponse.redirect(new URL('/error?message=auth-error', request.url));
      }
      
      if (!user) {
        console.error('No user found after authentication');
        return NextResponse.redirect(new URL('/error?message=no-user-found', request.url));
      }
      
      console.log(`User authenticated: ${user.id}`);
      
      // Check if teacher record exists
      const { data: teacherData, error: teacherError } = await supabase
        .from('Teacher')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (teacherError && teacherError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is expected if teacher doesn't exist
        console.error('Error checking teacher record:', teacherError);
      }
      
      // If no teacher record exists, create one
      if (!teacherData) {
        console.log(`Creating new teacher record for user: ${user.id}`);
        
        // Get user's name from their profile if available
        const name = user.user_metadata?.full_name || 
                    `${user.user_metadata?.given_name || ''} ${user.user_metadata?.family_name || ''}`.trim() || 
                    user.email?.split('@')[0] || 
                    'New Teacher';
        
        const { error: insertError } = await supabase
          .from('Teacher')
          .insert([{ id: user.id, name: name }]);
          
        if (insertError) {
          console.error('Error creating teacher record:', insertError);
        } else {
          console.log(`Successfully created teacher record for: ${name}`);
        }
      } else {
        console.log(`Teacher record already exists for user: ${user.id}`);
      }
    } catch (error) {
      console.error('Unexpected error in auth callback:', error);
      return NextResponse.redirect(new URL('/error?message=unexpected-error', request.url));
    }
  } else {
    console.error('No code parameter found in callback URL');
    return NextResponse.redirect(new URL('/error?message=no-auth-code', request.url));
  }
  
  // Redirect to the dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
