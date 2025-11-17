/**
 * Convex Client Configuration for React Native
 * Provides real-time database synchronization
 */

import { ConvexReactClient } from 'convex/react';
import { CONVEX_URL } from '../config/constants';

/**
 * Initialize the Convex client for React Native
 * This client provides real-time synchronization with the backend
 */
export const convexClient = new ConvexReactClient(CONVEX_URL, {
  // Configure for React Native environment
  unsavedChangesWarning: false,
});

/**
 * Type-safe wrapper for Convex queries
 * Usage: const data = await queryConvex('sessions:getSession', { sessionId: '...' });
 */
export async function queryConvex<T>(
  queryName: string,
  args?: Record<string, any>
): Promise<T> {
  return convexClient.query(queryName as any, args);
}

/**
 * Type-safe wrapper for Convex mutations
 * Usage: await mutateConvex('sessions:createSession', { name: '...', ... });
 */
export async function mutateConvex<T>(
  mutationName: string,
  args?: Record<string, any>
): Promise<T> {
  return convexClient.mutation(mutationName as any, args);
}
