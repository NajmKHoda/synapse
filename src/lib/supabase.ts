import { createBrowserClient } from '@supabase/ssr'
import { Provider } from '@supabase/supabase-js'

// Create a singleton instance to avoid multiple instances
let supabaseClient: ReturnType<typeof createBrowserClient>

export const getSupabase = () => {
  if (supabaseClient) return supabaseClient

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabaseClient
}

// For direct import in client components
export const supabase = typeof window !== 'undefined' ? getSupabase() : undefined

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
  const supabase = getSupabase();
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
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