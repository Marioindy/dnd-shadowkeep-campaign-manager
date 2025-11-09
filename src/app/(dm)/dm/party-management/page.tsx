'use client';

import { useState } from 'react';
import DMHeader from '../components/DMHeader';
import PlayerList from './components/PlayerList';
import CharacterDetails from './components/CharacterDetails';

/**
 * Renders the Party Management page layout with a header, a player list, and character details.
 *
 * Manages the selected player state and coordinates communication between PlayerList and CharacterDetails.
 * The layout uses a responsive grid: a single-column layout on small screens and a three-column grid on large screens
 * where the player list occupies the first column and character details span the remaining two columns.
 *
 * @returns The component's JSX element representing the Party Management page.
 */
export default function PartyManagementPage() {
  const [selectedPlayer, setSelectedPlayer] = useState('1');

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayer(playerId);
  };
  return (
    <div className="min-h-screen bg-gray-950">
      <DMHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Party Management</h1>
          <p className="text-gray-400">Manage players and their characters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PlayerList
              selectedPlayer={selectedPlayer}
              onSelectPlayer={handleSelectPlayer}
            />
          </div>
          <div className="lg:col-span-2">
            <CharacterDetails selectedPlayer={selectedPlayer} />
          </div>
        </div>
      </main>
    </div>
  );
}