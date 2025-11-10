'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import SessionExportButton from '../../campaign/components/SessionExportButton';
import { DiceRoll } from '@/types';

/**
 * Displays recent dice roll history from the database
 * Shows roll details including dice type, results, modifiers, and success/failure
 * Includes export functionality for session logs
 */
export default function RollHistory() {
  // In production, get user ID from auth context
  const rolls = useQuery(api.diceRolls.getRecentDiceRolls, { limit: 20 });

  if (!rolls) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Roll History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (rolls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Roll History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">No rolls yet. Start rolling!</p>
        </CardContent>
      </Card>
    );
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }

    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }

    // Less than 1 day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }

    // Otherwise show date
    return date.toLocaleDateString();
  };

  const getRollTypeColor = (roll: DiceRoll) => {
    if (roll.success === true) return 'text-green-400';
    if (roll.success === false) return 'text-red-400';
    return 'text-purple-400';
  };

  const getRollTypeBadge = (rollType: string) => {
    if (rollType === 'normal') return null;

    return (
      <span
        className={`text-xs px-2 py-0.5 rounded ${
          rollType === 'advantage'
            ? 'bg-green-900/30 text-green-400'
            : 'bg-red-900/30 text-red-400'
        }`}
      >
        {rollType === 'advantage' ? 'ADV' : 'DIS'}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Roll History</CardTitle>
          <SessionExportButton sessionName="Current Session" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {rolls.map((roll: DiceRoll) => (
            <div
              key={roll._id}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">
                    {roll.diceCount}
                    {roll.diceType}
                  </span>
                  {getRollTypeBadge(roll.rollType)}
                  {roll.modifier !== 0 && (
                    <span className="text-gray-400 text-sm">
                      {roll.modifier >= 0 ? '+' : ''}
                      {roll.modifier}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(roll.timestamp)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-400">Results:</span>
                <span className="text-sm text-white">
                  {roll.results.join(' + ')}
                  {roll.modifier !== 0 && ` ${roll.modifier >= 0 ? '+' : ''}${roll.modifier}`}
                </span>
                <span className="text-sm text-gray-400">=</span>
                <span className={`text-lg font-bold ${getRollTypeColor(roll)}`}>
                  {roll.total}
                </span>
              </div>

              {roll.purpose && (
                <div className="text-sm text-gray-400 mb-1">
                  <span className="font-medium">Purpose:</span> {roll.purpose}
                </div>
              )}

              {roll.targetDC !== undefined && (
                <div className="text-sm">
                  <span className="text-gray-400">vs DC {roll.targetDC}:</span>{' '}
                  <span
                    className={`font-medium ${
                      roll.success ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {roll.success ? 'SUCCESS' : 'FAILURE'}
                  </span>
                </div>
              )}

              {roll.characterName && (
                <div className="text-xs text-gray-500 mt-2">
                  Rolled by: {roll.characterName}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
