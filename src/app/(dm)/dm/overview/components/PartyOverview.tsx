'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useCharactersByCampaign } from '@/hooks/useCharacters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

/**
 * Renders a party overview panel showing each character's name, level/class, status, and HP bar.
 *
 * The component fetches real-time character data from Convex and renders one card per party member.
 * Each card includes a colored status dot based on HP, a "View" button, numeric HP (current/max),
 * and a progress bar whose width and color reflect the HP ratio.
 *
 * @returns A React element containing the party overview UI.
 */
export default function PartyOverview() {
  const { user } = useAuth();
  const { characters, isLoading } = useCharactersByCampaign(user?.campaignId);

  const getStatusColor = (hp: number, maxHp: number) => {
    const ratio = hp / maxHp;
    if (ratio > 0.5) return 'bg-green-500';
    if (ratio > 0.25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-4">Party Overview</h2>

      <div className="space-y-3">
        {characters && characters.length > 0 ? (
          characters.map((character) => (
            <div
              key={character._id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(character.stats.hp, character.stats.maxHp)}`} />
                  <div>
                    <h3 className="font-semibold text-white">{character.name}</h3>
                    <p className="text-sm text-gray-400">
                      Level {character.level} {character.class}
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                  View
                </button>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">HP</span>
                  <span className="text-gray-300">
                    {character.stats.hp} / {character.stats.maxHp}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      character.stats.hp / character.stats.maxHp > 0.5
                        ? 'bg-green-500'
                        : character.stats.hp / character.stats.maxHp > 0.25
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(character.stats.hp / character.stats.maxHp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            No characters in campaign yet
          </div>
        )}
      </div>
    </div>
  );
}
