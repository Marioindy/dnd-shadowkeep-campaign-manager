'use client';

import { useRef } from 'react';
import { ParticleEffects, MarkerAnimations } from '@/utils/mapAnimations';
import { Wand2, Zap, Heart, Swords } from 'lucide-react';

interface MapEffectsDemoProps {
  mapContainerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Demo component for triggering particle effects and animations on the map.
 *
 * Provides buttons to test various animation effects:
 * - Spell cast effects
 * - Ability burst effects
 * - Damage effects
 * - Heal effects
 * - Radial pulse (AOE) effects
 *
 * @param mapContainerRef - Reference to the map container element for particle rendering
 * @returns A JSX element with effect trigger buttons
 */
export default function MapEffectsDemo({ mapContainerRef }: MapEffectsDemoProps) {
  const handleSpellCast = () => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      ParticleEffects.spellCast(mapContainerRef.current, centerX, centerY);
      ParticleEffects.radialPulse(mapContainerRef.current, centerX, centerY, 100, '#8b5cf6');
    }
  };

  const handleAbility = () => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      ParticleEffects.abilityBurst(mapContainerRef.current, centerX, centerY);
    }
  };

  const handleDamage = () => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      ParticleEffects.damageEffect(mapContainerRef.current, centerX, centerY);
    }
  };

  const handleHeal = () => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      ParticleEffects.healEffect(mapContainerRef.current, centerX, centerY);
      ParticleEffects.radialPulse(mapContainerRef.current, centerX, centerY, 80, '#22c55e');
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <h3 className="text-sm font-semibold text-white mb-3">Effect Animations</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleSpellCast}
          className="flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          <span>Spell</span>
        </button>
        <button
          onClick={handleAbility}
          className="flex items-center justify-center space-x-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition-colors"
        >
          <Zap className="w-4 h-4" />
          <span>Ability</span>
        </button>
        <button
          onClick={handleDamage}
          className="flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
        >
          <Swords className="w-4 h-4" />
          <span>Damage</span>
        </button>
        <button
          onClick={handleHeal}
          className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
        >
          <Heart className="w-4 h-4" />
          <span>Heal</span>
        </button>
      </div>
    </div>
  );
}
