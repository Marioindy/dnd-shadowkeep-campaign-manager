'use client';

export default function FogOfWarControl() {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Fog of War</h2>

      <div className="space-y-3">
        <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors text-left">
          Draw Fog Area
        </button>
        <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors text-left">
          Reveal Area
        </button>
        <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors text-left">
          Hide All
        </button>
        <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors text-left">
          Reveal All
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <label className="block text-sm text-gray-400 mb-2">Fog Opacity</label>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="80"
          className="w-full"
        />
      </div>
    </div>
  );
}
