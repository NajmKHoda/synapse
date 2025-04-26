"use client";

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [session, setSession] = useState<null | object>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: object | null } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2️⃣ Subscribe to auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: object | null) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 3️⃣ Redirect once we know there’s no session
  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
    }
  }, [loading, session, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // while redirecting, don’t flash the protected UI
  if (!session) {
    return null;
  }

  return <>{children}</>;
}