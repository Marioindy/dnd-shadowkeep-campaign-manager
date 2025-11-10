'use client';

import { useState, useEffect } from 'react';
import { InitiativeEntry } from '@/types';
import { audioManager } from '@/lib/audioManager';

/**
 * Displays an interactive initiative tracker UI for a list of combatants.
 *
 * The component manages an internal list of combatants with initiative values, highlights the currently active combatant, and advances the turn order when the "Next Turn" button is clicked (wraps to the start after the last combatant). Users can add new combatants through an inline form.
 * Includes audio feedback for turn changes and combat events.
 *
 * @returns The rendered Initiative Tracker UI as a React element
 */
export default function InitiativeTracker() {
  const [entries, setEntries] = useState<InitiativeEntry[]>([
    { id: '1', name: 'Thaldrin', initiative: 18, type: 'player' },
    { id: '2', name: 'Lyra', initiative: 15, type: 'player' },
    { id: '3', name: 'Goblin 1', initiative: 12, type: 'enemy' },
    { id: '4', name: 'Goblin 2', initiative: 8, type: 'enemy' },
  ]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isAddingCombatant, setIsAddingCombatant] = useState(false);
  const [combatStarted, setCombatStarted] = useState(false);
  const [newCombatant, setNewCombatant] = useState({
    name: '',
    initiative: '',
    type: 'player' as 'player' | 'enemy',
  });

  const sortedEntries = [...entries].sort((a, b) => b.initiative - a.initiative);

  // Play combat start sound on first mount
  useEffect(() => {
    if (!combatStarted && sortedEntries.length > 0) {
      audioManager.playSoundEffect('initiative_start');
      setCombatStarted(true);
    }
  }, [combatStarted, sortedEntries.length]);

  const nextTurn = () => {
    setCurrentTurn((prev) => {
      const nextTurnIndex = (prev + 1) % sortedEntries.length;

      // Play turn change sound
      audioManager.playSoundEffect('initiative_next_turn');

      // If wrapping back to first turn, play combat start sound
      if (nextTurnIndex === 0) {
        setTimeout(() => {
          audioManager.playSoundEffect('initiative_start', { volume: 0.7 });
        }, 300);
      }

      return nextTurnIndex;
    });
  };

  const handleAddCombatant = () => {
    if (newCombatant.name.trim() && newCombatant.initiative) {
      const initiative = parseInt(newCombatant.initiative, 10);
      if (!isNaN(initiative)) {
        const newEntry: InitiativeEntry = {
          id: Date.now().toString(),
          name: newCombatant.name.trim(),
          initiative,
          type: newCombatant.type,
        };
        setEntries([...entries, newEntry]);
        setNewCombatant({ name: '', initiative: '', type: 'player' });
        setIsAddingCombatant(false);

        // Play sound when adding combatant
        audioManager.playSoundEffect('combatant_added');
      }
    }
  };

  const handleCancelAdd = () => {
    setNewCombatant({ name: '', initiative: '', type: 'player' });
    setIsAddingCombatant(false);
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
                  entry.type === 'player' ? 'bg-blue-500' : entry.type === 'npc' ? 'bg-green-500' : 'bg-red-500'
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
                  : entry.type === 'npc'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {entry.type}
            </span>
          </div>
        ))}
      </div>

      {!isAddingCombatant ? (
        <button
          onClick={() => setIsAddingCombatant(true)}
          className="w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors text-sm"
        >
          + Add Combatant
        </button>
      ) : (
        <div className="bg-gray-800 rounded-lg p-4 border-2 border-purple-500">
          <h3 className="text-white font-medium mb-3">Add New Combatant</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="combatant-name" className="block text-sm text-gray-400 mb-1">
                Name
              </label>
              <input
                id="combatant-name"
                type="text"
                value={newCombatant.name}
                onChange={(e) => setNewCombatant({ ...newCombatant, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter combatant name"
              />
            </div>
            <div>
              <label htmlFor="combatant-initiative" className="block text-sm text-gray-400 mb-1">
                Initiative
              </label>
              <input
                id="combatant-initiative"
                type="number"
                value={newCombatant.initiative}
                onChange={(e) => setNewCombatant({ ...newCombatant, initiative: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter initiative value"
              />
            </div>
            <div>
              <label htmlFor="combatant-type" className="block text-sm text-gray-400 mb-1">
                Type
              </label>
              <select
                id="combatant-type"
                value={newCombatant.type}
                onChange={(e) => setNewCombatant({ ...newCombatant, type: e.target.value as 'player' | 'enemy' })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="player">Player</option>
                <option value="enemy">Enemy</option>
              </select>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleAddCombatant}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
              <button
                onClick={handleCancelAdd}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}