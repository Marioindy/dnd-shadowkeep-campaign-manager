'use client';

import { useState } from 'react';

interface FogOfWarControlProps {
  onDrawFog?: () => void;
  onRevealArea?: () => void;
  onHideAll?: () => void;
  onRevealAll?: () => void;
  onOpacityChange?: (opacity: number) => void;
}

/**
 * Fog of War control panel with animated transitions.
 *
 * Features:
 * - Draw fog area tool
 * - Reveal area tool
 * - Hide/Reveal all buttons with animations
 * - Opacity slider with smooth transitions
 *
 * The actual fog rendering and animation logic is handled by parent components
 * using the FogAnimations utility from mapAnimations.
 *
 * @param onDrawFog - Callback when Draw Fog Area is clicked
 * @param onRevealArea - Callback when Reveal Area is clicked
 * @param onHideAll - Callback when Hide All is clicked
 * @param onRevealAll - Callback when Reveal All is clicked
 * @param onOpacityChange - Callback when opacity changes (0-100)
 * @returns A JSX element containing the fog-of-war controls panel
 */
export default function FogOfWarControl({
  onDrawFog,
  onRevealArea,
  onHideAll,
  onRevealAll,
  onOpacityChange,
}: FogOfWarControlProps) {
  const [opacity, setOpacity] = useState(80);

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseInt(e.target.value);
    setOpacity(newOpacity);
    onOpacityChange?.(newOpacity);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Fog of War</h2>

      <div className="space-y-3">
        <button
          onClick={onDrawFog}
          className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors text-left"
        >
          Draw Fog Area
        </button>
        <button
          onClick={onRevealArea}
          className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors text-left"
        >
          Reveal Area
        </button>
        <button
          onClick={onHideAll}
          className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors text-left"
        >
          Hide All
        </button>
        <button
          onClick={onRevealAll}
          className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors text-left"
        >
          Reveal All
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <label className="block text-sm text-gray-400 mb-2">
          Fog Opacity: {opacity}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={opacity}
          onChange={handleOpacityChange}
          className="w-full"
        />
      </div>
    </div>
  );
}