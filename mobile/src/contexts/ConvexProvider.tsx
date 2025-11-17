/**
 * Convex Provider
 * Wraps the app with Convex client for real-time data sync
 */

import React, { ReactNode } from 'react';
import { ConvexProvider as BaseConvexProvider } from 'convex/react';
import { convexClient } from '../services/convex';

interface ConvexProviderProps {
  children: ReactNode;
}

export function ConvexProvider({ children }: ConvexProviderProps) {
  return (
    <BaseConvexProvider client={convexClient}>
      {children}
    </BaseConvexProvider>
  );
}
