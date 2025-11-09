/**
 * Convex client configuration
 *
 * This file sets up the Convex client for real-time data synchronization.
 *
 * Usage in components:
 * import { useQuery, useMutation } from 'convex/react';
 * import { api } from '../../../convex/_generated/api';
 *
 * const data = useQuery(api.characters.list);
 * const createCharacter = useMutation(api.characters.create);
 */

'use client';

import { ReactNode } from 'react';
import { ConvexProvider as BaseConvexProvider, ConvexReactClient } from 'convex/react';

/**
 * Validate and get Convex URL
 */
function getConvexUrl(): string {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!url) {
    throw new Error(
      'NEXT_PUBLIC_CONVEX_URL is not set. ' +
      'Please add it to your .env.local file. ' +
      'Run `npx convex dev` to get your deployment URL.'
    );
  }

  return url;
}

/**
 * Create Convex client instance
 */
export const convex = new ConvexReactClient(getConvexUrl());

/**
 * Convex Provider wrapper for the application
 * Wrap your app with this provider to enable real-time data synchronization
 */
export function ConvexProvider({ children }: { children: ReactNode }) {
  return (
    <BaseConvexProvider client={convex}>
      {children}
    </BaseConvexProvider>
  );
}

/**
 * Export the Convex URL for other uses
 */
export const CONVEX_URL = getConvexUrl();
