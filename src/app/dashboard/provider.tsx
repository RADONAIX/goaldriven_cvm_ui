'use client';

// 👈 Important! This makes the file a Client Component
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: any) {
  return <SessionProvider refetchInterval={0}>{children}</SessionProvider>;
}
