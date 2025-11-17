'use client';

import { ReactNode } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

if (!convexUrl) {
  throw new Error('NEXT_PUBLIC_CONVEX_URL must be set in environment variables');
}

const convex = new ConvexReactClient(convexUrl);

/**
 * Provides Convex client to the application
 * Wraps children with ConvexProvider for real-time data synchronization
 */
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
