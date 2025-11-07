'use client';

import { useState } from 'react';

export default function DMMapViewer() {
  const [showGrid, setShowGrid] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showFog, setShowFog] = useState(true);

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
                onChange={(e) => setShowFog(e.target.checked)}
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
            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors">
              Add Marker
            </button>
            <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors">
              Reveal Area
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
