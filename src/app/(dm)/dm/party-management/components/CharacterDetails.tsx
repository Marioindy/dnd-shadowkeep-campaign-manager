'use client';

/**
 * Render a detailed profile card for a D&D-style character.
 *
 * The component displays the character's name, level, race, and class; a grid of ability scores
 * with D&D-style modifiers; summary cards for health, armor class, and speed; and an inventory list.
 *
 * @returns A JSX element rendering the full character details view (header, stats grid, summaries, and inventory).
 */
export default function CharacterDetails() {
  // Mock character data - matches normalized Convex schema
  // In real implementation, inventory would be fetched separately using:
  // const inventory = useQuery(api.inventory.getByCharacter, { characterId: character._id });
  const character = {
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
  };

  // Mock inventory data - would come from separate inventory table
  const inventory = [
    { name: 'Longsword +1', quantity: 1 },
    { name: 'Health Potion', quantity: 5 },
    { name: 'Gold Pieces', quantity: 237 },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{character.name}</h2>
          <p className="text-gray-400">
            Level {character.level} {character.race} {character.class}
          </p>
        </div>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
          Edit Character
        </button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {Object.entries(character.stats)
          .filter(([key]) => !['hp', 'maxHp', 'ac', 'speed'].includes(key))
          .map(([key, value]) => {
            const modifier = Math.floor((value - 10) / 2);
            return (
              <div key={key} className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400 uppercase mb-1">
                  {key.slice(0, 3)}
                </p>
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-purple-400">
                  {modifier >= 0 ? `+${modifier}` : modifier}
                </p>
              </div>
            );
          })}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Health</p>
          <p className="text-2xl font-bold text-white">
            {character.stats.hp}/{character.stats.maxHp}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Armor Class</p>
          <p className="text-2xl font-bold text-white">{character.stats.ac}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Speed</p>
          <p className="text-2xl font-bold text-white">{character.stats.speed}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Inventory</h3>
        <div className="space-y-2">
          {inventory.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
            >
              <span className="text-white">{item.name}</span>
              <span className="text-gray-400 text-sm">x{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}