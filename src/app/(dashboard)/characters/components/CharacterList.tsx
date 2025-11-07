'use client';

import Link from 'next/link';
import CharacterCard from './CharacterCard';

/**
 * Displays a responsive grid of character cards with a right-aligned "Create New Character" action.
 *
 * Renders a top-aligned link to create a new character and a responsive grid (1/2/3 columns) of sample characters.
 *
 * @returns The component's JSX representing the character list and create action.
 */
export default function CharacterList() {
  const characters = [
    {
      id: '1',
      name: 'Thaldrin Ironforge',
      race: 'Dwarf',
      class: 'Fighter',
      level: 5,
      stats: {
        strength: 18,
        dexterity: 12,
        constitution: 16,
        intelligence: 10,
        wisdom: 13,
        charisma: 8,
        hp: 42,
        maxHp: 52,
        ac: 18,
        speed: 25,
      },
    },
    {
      id: '2',
      name: 'Lyra Moonshadow',
      race: 'Elf',
      class: 'Wizard',
      level: 5,
      stats: {
        strength: 8,
        dexterity: 14,
        constitution: 12,
        intelligence: 18,
        wisdom: 15,
        charisma: 11,
        hp: 28,
        maxHp: 30,
        ac: 13,
        speed: 30,
      },
    },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
}