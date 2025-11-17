'use client';

import { useRef, useEffect } from 'react';
import { FogOfWarLayer as FogOfWarLayerType } from '@/types';
import { FogAnimations } from '@/utils/mapAnimations';

interface FogOfWarLayerProps {
  layer: FogOfWarLayerType;
  opacity?: number;
}

/**
 * Renders an animated fog of war layer as an SVG polygon.
 *
 * Features GSAP animations for:
 * - Reveal: Smooth fade-out with ripple effect
 * - Hide: Smooth fade-in
 * - Opacity changes: Smooth transitions
 *
 * @param layer - Fog layer data with polygon points and revealed state
 * @param opacity - Fog opacity (0-1), defaults to 0.8
 * @returns A JSX element representing the fog layer
 */
export default function FogOfWarLayer({ layer, opacity = 0.8 }: FogOfWarLayerProps) {
  const fogRef = useRef<SVGPolygonElement>(null);
  const isInitialMount = useRef(true);

  // Animate reveal/hide state changes
  useEffect(() => {
    if (fogRef.current && !isInitialMount.current) {
      if (layer.revealed) {
        FogAnimations.rippleReveal(fogRef.current);
      } else {
        FogAnimations.hideArea(fogRef.current);
      }
    }
    isInitialMount.current = false;
  }, [layer.revealed]);

  // Animate opacity changes
  useEffect(() => {
    if (fogRef.current && !isInitialMount.current) {
      FogAnimations.setOpacity(fogRef.current, layer.revealed ? 0 : opacity);
    }
  }, [opacity, layer.revealed]);

  // Convert points array to SVG polygon points string
  const pointsString = layer.points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <polygon
      ref={fogRef}
      points={pointsString}
      fill="rgba(0, 0, 0, 0.8)"
      style={{
        opacity: layer.revealed ? 0 : opacity,
        transition: 'none', // GSAP handles transitions
      }}
    />
  );
}
