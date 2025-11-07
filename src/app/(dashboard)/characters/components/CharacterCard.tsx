'use client';

import Link from 'next/link';

interface CharacterCardProps {
  character: {
    id: string;
    name: string;
    race: string;
    class: string;
    level: number;
    stats: {
      hp: number;
      maxHp: number;
      ac: number;
      speed: number;
    };
  };
}

/**
 * Render a clickable character card linking to the character detail page.
 *
 * Renders the character's name, level, race, class, a circular level badge, a health bar whose width and color reflect current HP, and blocks for Armor Class and Speed.
 *
 * @param character - The character data to render (must include `id`, `name`, `race`, `class`, `level`, and `stats` with `hp`, `maxHp`, `ac`, and `speed`)
 * @returns A styled link card showing the character's details, current health visualization, and basic stats
 */
export default function CharacterCard({ character }: CharacterCardProps) {
  const hpPercentage = (character.stats.hp / character.stats.maxHp) * 100;

  return (
    <Link
      href={`/characters/${character.id}`}
      className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{character.name}</h3>
          <p className="text-gray-400">
            Level {character.level} {character.race} {character.class}
          </p>
        </div>
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border-2 border-purple-500">
          <span className="text-purple-400 font-bold">{character.level}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Health</span>
            <span className="text-gray-300">
              {character.stats.hp} / {character.stats.maxHp}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                hpPercentage > 50
                  ? 'bg-green-500'
                  : hpPercentage > 25
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-gray-800 rounded p-2">
            <p className="text-xs text-gray-400">Armor Class</p>
            <p className="text-lg font-bold text-white">{character.stats.ac}</p>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <p className="text-xs text-gray-400">Speed</p>
            <p className="text-lg font-bold text-white">{character.stats.speed} ft</p>
          </div>
        </div>
      </div>
    </Link>
  );
}