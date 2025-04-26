import { createBrowserClient } from '@supabase/ssr'

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