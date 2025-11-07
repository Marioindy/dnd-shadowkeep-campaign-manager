'use client';

import { useState } from 'react';

interface InitiativeEntry {
  id: string;
  name: string;
  initiative: number;
  type: 'player' | 'enemy';
}

export default function InitiativeTracker() {
  const [entries, setEntries] = useState<InitiativeEntry[]>([
    { id: '1', name: 'Thaldrin', initiative: 18, type: 'player' },
    { id: '2', name: 'Lyra', initiative: 15, type: 'player' },
    { id: '3', name: 'Goblin 1', initiative: 12, type: 'enemy' },
    { id: '4', name: 'Goblin 2', initiative: 8, type: 'enemy' },
  ]);
  const [currentTurn, setCurrentTurn] = useState(0);

  const sortedEntries = [...entries].sort((a, b) => b.initiative - a.initiative);

  const nextTurn = () => {
    setCurrentTurn((prev) => (prev + 1) % sortedEntries.length);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Initiative Tracker</h2>
        <button
          onClick={nextTurn}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
        >
          Next Turn
        </button>
      </div>

      <div className="space-y-2 mb-6">
        {sortedEntries.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-4 rounded-lg transition-all ${
              index === currentTurn
                ? 'bg-purple-600 border-2 border-purple-400'
                : 'bg-gray-800 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  entry.type === 'player' ? 'bg-blue-500' : 'bg-red-500'
                }`}
              >
                {entry.initiative}
              </span>
              <span className="text-white font-medium">{entry.name}</span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                entry.type === 'player'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {entry.type}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors text-sm">
        + Add Combatant
      </button>
    </div>
  );
}
