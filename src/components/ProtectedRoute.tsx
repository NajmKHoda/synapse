"use client";
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStatus } from '@/components/useAuthStatus';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuthStatus();
  const shouldRedirect = !loading && !isLoggedIn;
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/login');
    }
  }, [shouldRedirect, router]);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>; // or a nice spinner if you have one
  }

  // Since justLoggedIn is not available, we can't use this feature
  // If you need this functionality, update useAuthStatus hook to provide justLoggedIn
  if (shouldRedirect) return null;

  return children;
}
