'use client';

import { useRef, useEffect, useState } from 'react';
import MapMarkerComponent from './MapMarker';

export default function MapViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState([
    { id: '1', x: 100, y: 150, type: 'player', label: 'Thaldrin', color: '#8b5cf6' },
    { id: '2', x: 200, y: 180, type: 'player', label: 'Lyra', color: '#ec4899' },
    { id: '3', x: 350, y: 120, type: 'enemy', label: 'Goblin', color: '#ef4444' },
  ]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(Math.max(0.5, prev * delta), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <h2 className="font-semibold text-white">Shadowkeep Dungeon - Level 1</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            -
          </button>
          <span className="text-sm text-gray-400 w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((prev) => Math.min(3, prev + 0.1))}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            +
          </button>
          <button
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors ml-2"
          >
            Reset
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[600px] overflow-hidden bg-gray-950 cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s',
          }}
        >
          {/* Placeholder map - replace with actual map image */}
          <div className="w-[800px] h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
            <div className="grid grid-cols-8 grid-rows-6 w-full h-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-gray-800/50" />
              ))}
            </div>

            {/* Markers */}
            {markers.map((marker) => (
              <MapMarkerComponent key={marker.id} marker={marker} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 text-sm text-gray-400">
        Drag to pan • Scroll to zoom • Click markers for details
      </div>
    </div>
  );
}
