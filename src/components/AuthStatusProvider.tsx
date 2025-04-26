"use client";

import React from 'react';
import { useAuthStatus } from '@/components/useAuthStatus';

type AuthStatusProviderProps = {
  children: (authStatus: ReturnType<typeof useAuthStatus>) => React.ReactNode;
};

export default function AuthStatusProvider({ children }: AuthStatusProviderProps) {
  const authStatus = useAuthStatus();
  return <>{children(authStatus)}</>;
}
