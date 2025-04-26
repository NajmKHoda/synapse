"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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
    // Make sure auth is initialized
    if (!auth) {
      console.error("Firebase auth is not initialized");
      setStatus({
        isLoggedIn: false,
        loading: false,
        user: null
      });
      return;
    }

    console.log("Setting up auth state listener");
    
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        console.log("Auth state changed:", user ? "User logged in" : "User logged out");
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
      },
      (error) => {
        console.error("Auth state change error:", error);
        setStatus({
          isLoggedIn: false,
          loading: false,
          user: null
        });
      }
    );

    // Clean up subscription
    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  return status;
}
