"use client";

import { useAuth } from "@/lib/hooks/use-auth";

interface AuthProviderProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export function AuthProvider({ children, fallback }: AuthProviderProps) {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return fallback;
  }

  return children;
}
