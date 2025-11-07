/**
 * Convex client configuration
 *
 * This file provides utilities and configuration for Convex integration.
 *
 * To use Convex in your components:
 *
 * @example
 * ```tsx
 * import { useQuery, useMutation } from 'convex/react';
 * import { api } from '../../../convex/_generated/api';
 *
 * // In a component:
 * const characters = useQuery(api.characters.list);
 * const createCharacter = useMutation(api.characters.create);
 *
 * // Using the mutation:
 * await createCharacter({
 *   userId,
 *   campaignId,
 *   name: 'Aragorn',
 *   race: 'Human',
 *   class: 'Ranger',
 *   level: 1,
 *   stats: { ... }
 * });
 * ```
 *
 * Setup instructions:
 * 1. Run: npx convex dev
 * 2. Set NEXT_PUBLIC_CONVEX_URL in .env.local
 * 3. The ConvexProvider is already configured in app/layout.tsx
 */

export const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

/**
 * Check if Convex is properly configured
 */
export function isConvexConfigured(): boolean {
  return !!CONVEX_URL && CONVEX_URL.length > 0;
}
