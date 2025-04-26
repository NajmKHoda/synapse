"use client";

import { useState, useEffect } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthStatus {
  isLoggedIn: boolean;
  loading: boolean;
  user: User | null;
}

export function useAuthStatus(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>({
    isLoggedIn: false,
    loading: true,
    user: null
  });

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Check for existing session on mount
    async function checkInitialSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        console.log("Initial session found");
        setStatus({
          isLoggedIn: true,
          loading: false,
          user: data.session.user
        });
      } else {
        console.log("No initial session found");
        setStatus({
          isLoggedIn: false,
          loading: false,
          user: null
        });
      }
    }
    
    checkInitialSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      const user = session?.user;
      console.log("Auth state changed:", event, user ? "User logged in" : "User logged out");
      if (user) {
        setStatus({
          isLoggedIn: true,
          loading: false,
          user
        });
      } else {
        setStatus({
          isLoggedIn: false,
          loading: false,
          user: null
        });
      }
    });

    // Clean up subscription
    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  return status;
}
