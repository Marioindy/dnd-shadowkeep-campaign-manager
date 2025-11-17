'use client';

import Link from 'next/link';
import CharacterCard from './CharacterCard';
import { useAuth } from '@/contexts/AuthContext';
import { useCharactersByUser } from '@/hooks/useCharacters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

/**
 * Displays a responsive grid of character cards with a right-aligned "Create New Character" action.
 *
 * Renders a top-aligned link to create a new character and a responsive grid (1/2/3 columns) of characters
 * fetched in real-time from Convex.
 *
 * @returns The component's JSX representing the character list and create action.
 */
export default function CharacterList() {
  const { user } = useAuth();
  const { characters, isLoading } = useCharactersByUser(user?._id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" />
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
            <CharacterCard key={character._id} character={character} />
          ))}
        </div>
      )}
    </div>
  );
}