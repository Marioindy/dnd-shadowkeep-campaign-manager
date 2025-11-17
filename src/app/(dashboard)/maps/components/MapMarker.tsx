'use client';

import { useRef, useEffect } from 'react';
import { MapMarker as MapMarkerType } from '@/types';
import { MarkerAnimations } from '@/utils/mapAnimations';

interface MapMarkerProps {
  marker: MapMarkerType;
  onRemove?: () => void;
}

/**
 * Render a circular map marker at the given coordinates with animated entrance/exit effects.
 *
 * Features GSAP animations for:
 * - Placement: Pop-in effect with rotation
 * - Removal: Pop-out effect with rotation
 * - Hover: Smooth scale transition
 *
 * @param marker - Marker data conforming to the shared MapMarker type with fields: `id` (string), `type` ('player'|'npc'|'enemy'|'poi'), `x` and `y` (coordinates), `visible` (boolean), optional `label`, `color`, and `iconUrl`
 * @param onRemove - Optional callback fired when marker removal animation completes
 * @returns A JSX element that visually represents the positioned map marker and its tooltip
 */
export default function MapMarker({ marker, onRemove }: MapMarkerProps) {
  const markerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Animate marker placement on mount
  useEffect(() => {
    if (markerRef.current && isInitialMount.current) {
      MarkerAnimations.placeMarker(markerRef.current);
      isInitialMount.current = false;
    }
  }, []);

  // Handle marker visibility changes
  useEffect(() => {
    if (markerRef.current && !isInitialMount.current) {
      if (marker.visible) {
        MarkerAnimations.placeMarker(markerRef.current);
      } else {
        MarkerAnimations.removeMarker(markerRef.current, {
          onComplete: onRemove,
        });
      }
    }
  }, [marker.visible, onRemove]);

  // Animate position changes
  useEffect(() => {
    if (markerRef.current && !isInitialMount.current) {
      MarkerAnimations.moveMarker(markerRef.current, marker.x, marker.y);
    }
  }, [marker.x, marker.y]);

  return (
    <div
      ref={markerRef}
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
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          {marker.label}
        </div>
      )}
    </div>
  );
}