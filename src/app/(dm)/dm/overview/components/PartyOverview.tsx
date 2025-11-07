'use client';

/**
 * Renders a party overview panel showing each character's name, level/class, status, and HP bar.
 *
 * The component uses static internal data to render one card per party member. Each card includes a colored status dot, a "View" button, numeric HP (current/max), and a progress bar whose width and color reflect the HP ratio.
 *
 * @returns A React element containing the party overview UI.
 */
export default function PartyOverview() {
  const party = [
    { id: '1', name: 'Thaldrin Ironforge', class: 'Fighter', level: 5, hp: 42, maxHp: 52, status: 'healthy' },
    { id: '2', name: 'Lyra Moonshadow', class: 'Wizard', level: 5, hp: 28, maxHp: 30, status: 'healthy' },
    { id: '3', name: 'Garrick Stone', class: 'Rogue', level: 5, hp: 18, maxHp: 38, status: 'injured' },
    { id: '4', name: 'Elara Dawn', class: 'Cleric', level: 5, hp: 35, maxHp: 42, status: 'healthy' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'injured':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-4">Party Overview</h2>

      <div className="space-y-3">
        {party.map((character) => (
          <div
            key={character.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(character.status)}`} />
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
                  {character.hp} / {character.maxHp}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    character.hp / character.maxHp > 0.5
                      ? 'bg-green-500'
                      : character.hp / character.maxHp > 0.25
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}