'use client';

import React, { useState } from 'react';
import { Music, Play, Square, Swords } from 'lucide-react';
import { audioManager } from '@/lib/audioManager';
import { AmbientTrack } from '@/types';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

/**
 * AmbientMusicSelector - DM control panel for ambient music and combat music
 */
export default function AmbientMusicSelector() {
  const [currentTrack, setCurrentTrack] = useState<AmbientTrack | null>(null);
  const [combatMusicEnabled, setCombatMusicEnabled] = useState(false);

  const ambientTracks: { track: AmbientTrack; label: string; icon: string }[] = [
    { track: 'tavern', label: 'Tavern', icon: '🍺' },
    { track: 'town', label: 'Town', icon: '🏘️' },
    { track: 'peaceful', label: 'Peaceful', icon: '☮️' },
    { track: 'forest', label: 'Forest', icon: '🌲' },
    { track: 'dungeon', label: 'Dungeon', icon: '🏰' },
    { track: 'cave', label: 'Cave', icon: '⛰️' },
    { track: 'mystical', label: 'Mystical', icon: '✨' },
    { track: 'combat', label: 'Combat', icon: '⚔️' },
    { track: 'boss_battle', label: 'Boss Battle', icon: '🐉' },
  ];

  const playTrack = async (track: AmbientTrack) => {
    await audioManager.playAmbientTrack(track, { fadeIn: 2000, loop: true });
    setCurrentTrack(track);
  };

  const stopMusic = async () => {
    await audioManager.fadeOutAmbient(2000);
    setCurrentTrack(null);
  };

  const toggleCombatMusic = async () => {
    const newState = !combatMusicEnabled;
    await audioManager.toggleCombatMusic(newState);
    setCombatMusicEnabled(newState);

    if (newState) {
      setCurrentTrack('combat');
    } else {
      setCurrentTrack(null);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Music className="w-5 h-5 text-blue-400" />
          Ambient Music
        </h3>
        {currentTrack && (
          <Button
            onClick={stopMusic}
            variant="danger"
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop
          </Button>
        )}
      </div>

      {/* Combat Music Toggle */}
      <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Swords className="w-5 h-5 text-red-400" />
            <div>
              <p className="font-semibold text-white">Combat Music</p>
              <p className="text-sm text-zinc-400">Quick toggle for battle scenes</p>
            </div>
          </div>
          <Button
            onClick={toggleCombatMusic}
            variant={combatMusicEnabled ? 'danger' : 'secondary'}
            className="flex items-center gap-2"
          >
            {combatMusicEnabled ? (
              <>
                <Square className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Ambient Track Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ambientTracks.map(({ track, label, icon }) => (
          <button
            key={track}
            onClick={() => playTrack(track)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              flex flex-col items-center gap-2 text-center
              hover:scale-105 active:scale-95
              ${
                currentTrack === track
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-400 shadow-lg shadow-blue-500/50'
                  : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
              }
            `}
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-medium text-white">{label}</span>
            {currentTrack === track && (
              <div className="flex items-center gap-1 text-xs text-blue-200">
                <Play className="w-3 h-3 fill-current" />
                Playing
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Current Track Display */}
      {currentTrack && (
        <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-sm text-zinc-300">
                Now Playing: <span className="font-semibold text-white">
                  {ambientTracks.find(t => t.track === currentTrack)?.label}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
