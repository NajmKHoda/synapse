import { createBrowserClient } from '@supabase/ssr'
import { Provider, SupabaseClient } from '@supabase/supabase-js'

// Create a singleton instance to avoid multiple instances
let supabaseClient: SupabaseClient | null = null;

export function getSupabase() {
  if (supabaseClient) return supabaseClient;

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabaseClient
}

// For direct import in client components
export const supabase = getSupabase();

// Authentication functions
export const signUpWithEmail = async (email: string, password: string) => {
  const client = getSupabase()
  return client.auth.signUp({
    email,
    password,
  })
}

export const signInWithEmail = async (email: string, password: string) => {
  const client = getSupabase()
  return client.auth.signInWithPassword({
    email,
    password,
  })
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  });
  
  return { data, error };
};

// Add a new function to create teacher record
export const createTeacherRecord = async (userId: string, name: string) => {
  const { data, error } = await supabase
    .from('Teacher')
    .insert([{ id: userId, name: name }])
    .select();
  
  return { data, error };
};

// Function to check if a teacher record exists
export const checkTeacherExists = async (userId: string) => {
  const { data, error } = await supabase
    .from('Teacher')
    .select('id')
    .eq('id', userId)
    .single();
  
  return { exists: !!data, error };
};

export const signOut = async () => {
  const client = getSupabase()
  return client.auth.signOut()
}

export const getCurrentUser = async () => {
  const client = getSupabase()
  return client.auth.getUser()
}

export const getSession = async () => {
  const client = getSupabase()
  return client.auth.getSession()
}