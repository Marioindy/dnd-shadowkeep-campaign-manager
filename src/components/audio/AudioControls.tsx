'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Zap } from 'lucide-react';
import { audioManager } from '@/lib/audioManager';
import { AudioSettings } from '@/types';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

/**
 * AudioControls - Component for managing audio settings
 * Provides volume sliders, mute toggle, and audio enable/disable
 */
export default function AudioControls() {
  const [settings, setSettings] = useState<AudioSettings>({
    masterVolume: 0.7,
    sfxVolume: 0.8,
    ambientVolume: 0.5,
    enabled: true,
    combatMusicEnabled: true,
  });

  // Load settings from AudioManager on mount
  useEffect(() => {
    const loadedSettings = audioManager.getSettings();
    setSettings(loadedSettings);
  }, []);

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    audioManager.setMasterVolume(volume);
    setSettings({ ...settings, masterVolume: volume });
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    audioManager.setSfxVolume(volume);
    setSettings({ ...settings, sfxVolume: volume });
  };

  const handleAmbientVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    audioManager.setAmbientVolume(volume);
    setSettings({ ...settings, ambientVolume: volume });
  };

  const toggleEnabled = () => {
    const newEnabled = !settings.enabled;
    audioManager.setEnabled(newEnabled);
    setSettings({ ...settings, enabled: newEnabled });
  };

  const testSoundEffect = () => {
    audioManager.playSoundEffect('dice_roll');
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-purple-400" />
          Audio Controls
        </h3>
        <Button
          onClick={toggleEnabled}
          variant={settings.enabled ? 'primary' : 'secondary'}
          className="flex items-center gap-2"
        >
          {settings.enabled ? (
            <>
              <Volume2 className="w-4 h-4" />
              Enabled
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              Disabled
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Master Volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-zinc-400" />
              Master Volume
            </label>
            <span className="text-sm text-zinc-400">
              {Math.round(settings.masterVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.masterVolume}
            onChange={handleMasterVolumeChange}
            disabled={!settings.enabled}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-purple-500
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:hover:bg-purple-400
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-purple-500
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:hover:bg-purple-400"
          />
        </div>

        {/* Sound Effects Volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Sound Effects
            </label>
            <span className="text-sm text-zinc-400">
              {Math.round(settings.sfxVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.sfxVolume}
            onChange={handleSfxVolumeChange}
            disabled={!settings.enabled}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-yellow-500
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:hover:bg-yellow-400
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-yellow-500
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:hover:bg-yellow-400"
          />
        </div>

        {/* Ambient Music Volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Music className="w-4 h-4 text-blue-400" />
              Ambient Music
            </label>
            <span className="text-sm text-zinc-400">
              {Math.round(settings.ambientVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.ambientVolume}
            onChange={handleAmbientVolumeChange}
            disabled={!settings.enabled}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-blue-500
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:hover:bg-blue-400
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-blue-500
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:hover:bg-blue-400"
          />
        </div>

        {/* Test Sound Button */}
        <div className="pt-4 border-t border-zinc-700">
          <Button
            onClick={testSoundEffect}
            disabled={!settings.enabled}
            variant="secondary"
            className="w-full"
          >
            <Zap className="w-4 h-4 mr-2" />
            Test Sound Effect
          </Button>
        </div>
      </div>
    </Card>
  );
}
