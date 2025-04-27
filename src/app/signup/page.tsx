"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, getSupabase, signInWithGoogle, getSession } from '@/lib/supabase';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check for existing session or OAuth return errors on mount
  useEffect(() => {
    const checkSessionAndErrors = async () => {
      // Check for session
      const { data: { session } } = await getSession();
      if (session) {
        router.push('/dashboard');
        return;
      }

      // Check URL for OAuth error parameters
      const url = new URL(window.location.href);
      const errorCode = url.searchParams.get('error_code');
      const errorDescription = url.searchParams.get('error_description');
      
      if (errorCode && errorDescription) {
        // Format OAuth error for display
        if (errorCode === 'unexpected_failure') {
          setError('Google authentication failed. Please try again or use email signup instead.');
        } else {
          setError(`Authentication error (${errorCode}): ${errorDescription}`);
        }
        
        // Clean up URL
        url.searchParams.delete('error');
        url.searchParams.delete('error_code');
        url.searchParams.delete('error_description');
        window.history.replaceState({}, document.title, url.toString());
      }
    };

    checkSessionAndErrors();
  }, [router]);

  const createTeacherProfile = async (userId: string, userName: string) => {
    try {
      const { error: insertError } = await supabase
        .from('Teacher')
        .insert([{ id: userId, name: userName }]);
        
      if (insertError) {
        throw new Error(`Failed to save profile: ${insertError.message}`);
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Sign up user with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(`Failed to create account: ${signUpError.message}`);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setError('Failed to retrieve user after signup.');
      setLoading(false);
      return;
    }

    // 2. Insert user profile into Teacher table using the shared function
    const { success, error: profileError } = await createTeacherProfile(userId, name);
    if (!success) {
      setError(profileError || 'Failed to create teacher profile');
      setLoading(false);
      return;
    }

    // 3. Redirect to dashboard
    setLoading(false);
    router.push('/dashboard');
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');

    try {
      // Add a small delay before redirect to reduce race conditions
      const { error: oauthError } = await signInWithGoogle();

      if (oauthError) {
        if (oauthError.message.includes('server_error') || oauthError.message.includes('unexpected_failure')) {
          throw new Error('Google authentication service is temporarily unavailable. Please try again later or use email signup.');
        }
        throw oauthError;
      }
      
      // Check for session immediately after successful OAuth (though redirect will happen)
      const { data: { session } } = await getSession();
      if (session?.user) {
        // Create teacher profile if session exists
        const userName = session.user.user_metadata?.full_name || 'Google User';
        const { success, error: profileError } = await createTeacherProfile(session.user.id, userName);
        
        if (!success) {
          throw new Error(profileError || 'Failed to create teacher profile');
        }
        
        // Redirect to dashboard after successful profile creation
        router.push('/dashboard');
      }
      // User will be redirected away, so no need to handle success case further
    } catch (err) {
      const authError = err as any;
      setError(authError.message || 'Google sign-up failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError('')}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailSignUp}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--secondary)] hover:bg-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
{/* 
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
              </svg>
              {loading ? 'Redirecting...' : 'Sign up with Google'}
            </button>
          </div>
        </div> */}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[var(--secondary)] hover:text-[var(--primary)]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}