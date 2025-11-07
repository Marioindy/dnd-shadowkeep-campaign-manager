'use client';

interface PlayerListProps {
  selectedPlayer: string;
  onSelectPlayer: (playerId: string) => void;
}

/**
 * Renders a selectable list of players with usernames, character names, and online indicators.
 *
 * A controlled component that displays each player as a button and emits selection changes via the onSelectPlayer callback.
 *
 * @param selectedPlayer - The currently selected player ID
 * @param onSelectPlayer - Callback function invoked when a player is selected
 * @returns The component's root JSX element containing the player list and add-player control.
 */
export default function PlayerList({ selectedPlayer, onSelectPlayer }: PlayerListProps) {

  const players = [
    { id: '1', username: 'player1', characterName: 'Thaldrin Ironforge', online: true },
    { id: '2', username: 'player2', characterName: 'Lyra Moonshadow', online: true },
    { id: '3', username: 'player3', characterName: 'Garrick Stone', online: false },
    { id: '4', username: 'player4', characterName: 'Elara Dawn', online: true },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Players</h2>

      <div className="space-y-2">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => onSelectPlayer(player.id)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              selectedPlayer === player.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-sm">{player.username}</p>
              <div className={`w-2 h-2 rounded-full ${player.online ? 'bg-green-500' : 'bg-gray-500'}`} />
            </div>
            <p className="text-xs opacity-75">{player.characterName}</p>
          </button>
        ))}
      </div>

      <button className="mt-4 w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-red-500 hover:text-red-400 transition-colors text-sm">
        + Add Player
      </button>
    </div>
  );
}