'use client';

interface MapMarkerProps {
  marker: {
    id: string;
    x: number;
    y: number;
    type: string;
    label?: string;
    color?: string;
  };
}

export default function MapMarker({ marker }: MapMarkerProps) {
  return (
    <div
      className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{ left: marker.x, top: marker.y }}
    >
      <div
        className="w-full h-full rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-125"
        style={{ backgroundColor: marker.color || '#8b5cf6' }}
      >
        {marker.label?.charAt(0) || '?'}
      </div>
      {marker.label && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {marker.label}
        </div>
      )}
    </div>
  );
}
