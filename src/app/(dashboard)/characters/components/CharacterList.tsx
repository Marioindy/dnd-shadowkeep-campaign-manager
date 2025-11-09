'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import CharacterCard from './CharacterCard';
import type { Id } from '../../../../../convex/_generated/dataModel';

/**
 * Displays a responsive grid of character cards with a right-aligned "Create New Character" action.
 *
 * Fetches characters from Convex backend in real-time for the current user.
 * Shows loading state while fetching and empty state when no characters exist.
 *
 * @returns The component's JSX representing the character list and create action.
 */
export default function CharacterList() {
  const [userId, setUserId] = useState<Id<'users'> | null>(null);

  // Get user ID from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user._id);
    }
  }, []);

  // Fetch characters for the current user with real-time updates
  const characters = useQuery(
    api.characters.byUser,
    userId ? { userId } : 'skip'
  );

  // Show loading state
  if (characters === undefined) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-gray-400">Loading characters...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          href="/characters/new"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
        >
          + Create New Character
        </Link>
      </div>

      {!characters || characters.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 px-6 text-center"
          role="region"
          aria-label="Empty character list"
        >
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-bold text-gray-200">
              No characters yet
            </h2>
            <p className="text-gray-400">
              Start your adventure by creating your first character. Build your
              hero with custom stats, abilities, and backstory.
            </p>
            <Link
              href="/characters/new"
              className="inline-block mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Create Your First Character
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </div>
  );
}