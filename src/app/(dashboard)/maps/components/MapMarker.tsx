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

/**
 * Render a circular map marker at the given coordinates with an optional hover tooltip.
 *
 * Displays a colored circular badge centered at (marker.x, marker.y). The badge shows the first character of `marker.label` or `'?'` when no label is provided; if `marker.label` is present, the full label appears in a non-interactive tooltip on hover.
 *
 * @param marker - Marker data: `id` (string), `x` and `y` (coordinates used for CSS `left`/`top`), `type` (string), optional `label` (string) and optional `color` (CSS color string)
 * @returns A JSX element that visually represents the positioned map marker and its tooltip
 */
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