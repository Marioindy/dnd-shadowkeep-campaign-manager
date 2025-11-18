'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

/**
 * Displays dice rolling statistics for the current user
 * Shows total rolls, averages, critical hits/fails, and roll distribution
 */
export default function DiceStats() {
  // In production, get user ID from auth context
  // For now, using a dummy ID - this needs to be updated
  const stats = useQuery(api.diceRolls.getDiceRollStats, {
    userId: 'user_dummy' as any,
  });

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (stats.totalRolls === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">
            No statistics yet. Start rolling to see your stats!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Total Rolls</p>
            <p className="text-2xl font-bold text-white">{stats.totalRolls}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Total Dice</p>
            <p className="text-2xl font-bold text-white">{stats.totalDice}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Average Roll</p>
            <p className="text-2xl font-bold text-purple-400">
              {stats.averageRoll.toFixed(1)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Highest Roll</p>
            <p className="text-2xl font-bold text-green-400">
              {stats.highestRoll}
            </p>
          </div>
        </div>

        {/* Critical Hits/Fails */}
        {(stats.criticalHits > 0 || stats.criticalFails > 0) && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              D20 Criticals
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
                <p className="text-xs text-green-400 mb-1">Natural 20s</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.criticalHits}
                </p>
              </div>
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                <p className="text-xs text-red-400 mb-1">Natural 1s</p>
                <p className="text-2xl font-bold text-red-400">
                  {stats.criticalFails}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rolls by Dice Type */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Rolls by Dice Type
          </h4>
          <div className="space-y-2">
            {Object.entries(stats.rollsByType)
              .sort((a, b) => (b[1] as number) - (a[1] as number))
              .map(([diceType, count]) => {
                const percentage = ((count as number) / stats.totalRolls) * 100;
                return (
                  <div key={diceType} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-white font-medium">{diceType}</span>
                      <span className="text-gray-400">
                        {count as number} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
