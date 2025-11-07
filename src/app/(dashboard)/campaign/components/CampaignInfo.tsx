'use client';

/**
 * Render a styled campaign overview card that displays a static campaign's metadata and player badges.
 *
 * Renders the campaign title and description, a grid with Dungeon Master, sessions played, current level,
 * and active players count, and a wrapped list of party member badges. The component uses an internal
 * hardcoded `campaign` object as its data source.
 *
 * @returns A JSX element containing the campaign overview card
 */
export default function CampaignInfo() {
  const campaign = {
    name: 'The Shadowkeep Chronicles',
    description: 'A dark fantasy campaign set in the ruins of an ancient fortress',
    dm: 'GameMaster',
    players: ['Thaldrin', 'Lyra', 'Garrick', 'Elara'],
    sessionsPlayed: 12,
    currentLevel: 5,
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-4">{campaign.name}</h2>
      <p className="text-gray-400 mb-6">{campaign.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Dungeon Master</p>
          <p className="text-white font-semibold">{campaign.dm}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Sessions Played</p>
          <p className="text-white font-semibold">{campaign.sessionsPlayed}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Current Level</p>
          <p className="text-white font-semibold">{campaign.currentLevel}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Active Players</p>
          <p className="text-white font-semibold">{campaign.players.length}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">Party Members:</p>
        <div className="flex flex-wrap gap-2">
          {campaign.players.map((player) => (
            <span
              key={player}
              className="px-3 py-1 bg-purple-600 rounded-full text-sm"
            >
              {player}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}