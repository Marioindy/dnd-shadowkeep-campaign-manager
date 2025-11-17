'use client';

import { useState } from 'react';
import { audioManager } from '@/lib/audioManager';

/**
 * Render a DM-facing map viewer UI with controls for grid, markers, and fog of war.
 *
 * The component manages local UI state for showing the grid, markers, and fog (all enabled by default)
 * and presents a placeholder main view when no map is loaded. Header controls toggle the corresponding state,
 * and the footer exposes DM action buttons and usage hints.
 * Includes audio feedback for map interactions with spatial audio support.
 *
 * @returns The rendered JSX element for the DM map viewer.
 */
export default function DMMapViewer() {
  const [showGrid, setShowGrid] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showFog, setShowFog] = useState(true);

  /**
   * Handle fog of war toggle with audio feedback
   */
  const handleFogToggle = (checked: boolean) => {
    setShowFog(checked);
    if (checked) {
      audioManager.playSoundEffect('fog_reveal', { volume: 0.6 });
    }
  };

  /**
   * Handle adding a map marker (placeholder for actual implementation)
   */
  const handleAddMarker = () => {
    // Simulate placing marker at random position for audio demo
    // In real implementation, this would use actual map coordinates
    const randomX = (Math.random() * 2) - 1; // -1 to 1 (left to right)
    const randomY = Math.random() * 0.5; // 0 to 0.5 (close to far)

    audioManager.playSoundEffect('map_marker_placed', {
      spatial: { x: randomX, y: randomY }
    });
  };

  /**
   * Handle revealing an area with audio feedback
   */
  const handleRevealArea = () => {
    audioManager.playSoundEffect('fog_reveal', { volume: 0.8 });
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Shadowkeep Dungeon - DM View</h2>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-300">Grid</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showMarkers}
                onChange={(e) => setShowMarkers(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-300">Markers</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFog}
                onChange={(e) => handleFogToggle(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-300">Fog of War</span>
            </label>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[600px] bg-gray-950 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No map loaded</p>
          <p className="text-sm">Upload a map to get started</p>
        </div>
      </div>

      <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            DM controls: Right-click to add markers • Shift+drag to draw fog
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddMarker}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
            >
              Add Marker
            </button>
            <button
              onClick={handleRevealArea}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
            >
              Reveal Area
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}