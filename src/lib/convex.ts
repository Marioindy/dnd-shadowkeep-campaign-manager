/**
 * Convex client configuration
 *
 * This file sets up the Convex client for real-time data synchronization.
 * To use Convex in your components:
 *
 * 1. Install Convex: npm install convex
 * 2. Initialize Convex: npx convex dev
 * 3. Set up environment variables in .env.local
 * 4. Wrap your app with ConvexProvider in app/layout.tsx
 *
 * Example usage:
 * import { useQuery, useMutation } from 'convex/react';
 * import { api } from '../../../convex/_generated/api';
 *
 * const data = useQuery(api.characters.list);
 * const createCharacter = useMutation(api.characters.create);
 */

export const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

// Add Convex provider setup here once initialized
