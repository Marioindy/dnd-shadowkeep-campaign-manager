'use client';

import { useState } from 'react';

export default function MapList() {
  const [selectedMap, setSelectedMap] = useState('1');

  const maps = [
    { id: '1', name: 'Shadowkeep Dungeon - Level 1', markerCount: 3 },
    { id: '2', name: 'Shadowkeep Dungeon - Level 2', markerCount: 5 },
    { id: '3', name: 'Overworld', markerCount: 8 },
    { id: '4', name: 'Town of Riverdale', markerCount: 12 },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Available Maps</h2>

      <div className="space-y-2">
        {maps.map((map) => (
          <button
            key={map.id}
            onClick={() => setSelectedMap(map.id)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              selectedMap === map.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
            }`}
          >
            <p className="font-medium text-sm">{map.name}</p>
            <p className="text-xs opacity-75 mt-1">{map.markerCount} markers</p>
          </button>
        ))}
      </div>

      <button className="mt-4 w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors text-sm">
        + Upload Map
      </button>
    </div>
  );
}
