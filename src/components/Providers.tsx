'use client';

import { ReactNode } from 'react';
import { ConvexProvider } from '@/lib/convex';

/**
 * Client-side providers wrapper
 * This component wraps all client-side providers (Convex, etc.)
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider>
      {children}
    </ConvexProvider>
  );
}
