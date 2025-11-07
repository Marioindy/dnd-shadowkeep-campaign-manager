'use client';

import Link from 'next/link';

/**
 * Renders a card-style panel that lists player characters and provides navigation to create a new character or view a character's details.
 *
 * The list is currently populated with a hard-coded set of characters; each item shows name, level/race/class, an HP fraction, and a progress bar reflecting current HP. Each character and the "New Character" button link to their respective routes.
 *
 * @returns A React element containing the character overview UI.
 */
export default function CharacterOverview() {
  const characters = [
    { id: 1, name: 'Thaldrin Ironforge', race: 'Dwarf', class: 'Fighter', level: 5, hp: 42, maxHp: 52 },
    { id: 2, name: 'Lyra Moonshadow', race: 'Elf', class: 'Wizard', level: 5, hp: 28, maxHp: 30 },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Your Characters</h2>
        <Link
          href="/characters/new"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
        >
          + New Character
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characters.map((char) => (
          <Link
            key={char.id}
            href={`/characters/${char.id}`}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-purple-500"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white text-lg">{char.name}</h3>
                <p className="text-sm text-gray-400">
                  Level {char.level} {char.race} {char.class}
                </p>
              </div>
              <span className="px-2 py-1 bg-purple-600 text-xs rounded-full">
                Lv {char.level}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">HP</span>
                  <span className="text-gray-300">
                    {char.hp} / {char.maxHp || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${(() => {
                        const ratio = char.maxHp ? char.hp / char.maxHp : 0;
                        const clampedRatio = Math.max(0, Math.min(1, ratio));
                        return clampedRatio * 100;
                      })()}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}