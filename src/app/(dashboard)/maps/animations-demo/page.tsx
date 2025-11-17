'use client';

import { useState, useRef } from 'react';
import { MapMarker } from '@/types';
import MapMarkerComponent from '../components/MapMarker';
import MapEffectsDemo from '../components/MapEffectsDemo';
import AnimatedStatDisplay from '../components/AnimatedStatDisplay';
import { ViewportAnimations, MarkerAnimations } from '@/utils/mapAnimations';
import { Users, MapPin, Eye, Zap } from 'lucide-react';

/**
 * Animation Demo Page
 *
 * Showcases all GSAP animations implemented for the map system:
 * - Marker placement/removal animations
 * - Pan and zoom animations
 * - Particle effects for spells/abilities
 * - Animated stat displays
 * - Fog of war transitions (simulated)
 */
export default function AnimationsDemoPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapElementRef = useRef<HTMLDivElement>(null);

  const [markers, setMarkers] = useState<MapMarker[]>([
    { id: '1', x: 200, y: 150, type: 'player', label: 'Thaldrin', color: '#8b5cf6', visible: true },
    { id: '2', x: 300, y: 200, type: 'player', label: 'Lyra', color: '#ec4899', visible: true },
  ]);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Stats for demonstration
  const [totalMarkers, setTotalMarkers] = useState(markers.length);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [visibleMarkers, setVisibleMarkers] = useState(markers.filter(m => m.visible).length);

  const handleAddMarker = () => {
    const newMarker: MapMarker = {
      id: `marker-${Date.now()}`,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      type: Math.random() > 0.5 ? 'player' : 'enemy',
      label: `Marker ${markers.length + 1}`,
      color: Math.random() > 0.5 ? '#10b981' : '#ef4444',
      visible: true,
    };
    setMarkers([...markers, newMarker]);
    setTotalMarkers(markers.length + 1);
    setVisibleMarkers(visibleMarkers + 1);
  };

  const handleRemoveMarker = () => {
    if (markers.length > 0) {
      const updatedMarkers = markers.slice(0, -1);
      setMarkers(updatedMarkers);
      setTotalMarkers(updatedMarkers.length);
      setVisibleMarkers(updatedMarkers.filter(m => m.visible).length);
    }
  };

  const handleToggleVisibility = () => {
    const updatedMarkers = markers.map((m, i) =>
      i === markers.length - 1 ? { ...m, visible: !m.visible } : m
    );
    setMarkers(updatedMarkers);
    setVisibleMarkers(updatedMarkers.filter(m => m.visible).length);
  };

  const handleZoomIn = () => {
    const newScale = Math.min(2, scale + 0.2);
    if (mapElementRef.current) {
      ViewportAnimations.zoomTo(mapElementRef.current, newScale);
      setScale(newScale);
      setZoomLevel(Math.round(newScale * 100));
    }
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.5, scale - 0.2);
    if (mapElementRef.current) {
      ViewportAnimations.zoomTo(mapElementRef.current, newScale);
      setScale(newScale);
      setZoomLevel(Math.round(newScale * 100));
    }
  };

  const handleResetView = () => {
    if (mapElementRef.current) {
      ViewportAnimations.resetView(mapElementRef.current, {
        onComplete: () => {
          setScale(1);
          setPosition({ x: 0, y: 0 });
          setZoomLevel(100);
        },
      });
    }
  };

  const handleFocusOnCenter = () => {
    if (mapElementRef.current) {
      ViewportAnimations.focusOnPoint(mapElementRef.current, 400, 300, 1.5);
      setScale(1.5);
      setZoomLevel(150);
    }
  };

  const handlePulseMarker = () => {
    if (markers.length > 0) {
      const markerElement = document.querySelector(`[data-marker-id="${markers[0].id}"]`) as HTMLElement;
      if (markerElement) {
        MarkerAnimations.pulseMarker(markerElement);
      }
    }
  };

  const handleShakeMarker = () => {
    if (markers.length > 0) {
      const markerElement = document.querySelector(`[data-marker-id="${markers[0].id}"]`) as HTMLElement;
      if (markerElement) {
        MarkerAnimations.shakeMarker(markerElement);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">GSAP Map Animations Demo</h1>
          <p className="text-gray-400">
            Interactive demonstration of all map animation features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                <h2 className="font-semibold text-white">Interactive Map Canvas</h2>
              </div>

              <div
                ref={mapRef}
                className="relative w-full h-[600px] overflow-hidden bg-gray-950"
              >
                <div
                  ref={mapElementRef}
                  className="absolute inset-0"
                  style={{ transformOrigin: '0 0' }}
                >
                  {/* Map Grid */}
                  <div className="w-[800px] h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                    <div className="grid grid-cols-8 grid-rows-6 w-full h-full">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border border-gray-800/50" />
                      ))}
                    </div>

                    {/* Markers */}
                    {markers.map((marker) => (
                      <div key={marker.id} data-marker-id={marker.id}>
                        <MapMarkerComponent marker={marker} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="space-y-4">
            {/* Animated Stats */}
            <div className="space-y-3">
              <AnimatedStatDisplay
                label="Total Markers"
                value={totalMarkers}
                previousValue={totalMarkers - 1}
                icon={<MapPin className="w-4 h-4" />}
              />
              <AnimatedStatDisplay
                label="Visible Markers"
                value={visibleMarkers}
                previousValue={visibleMarkers}
                icon={<Eye className="w-4 h-4" />}
                color="#3b82f6"
              />
              <AnimatedStatDisplay
                label="Zoom Level"
                value={zoomLevel}
                previousValue={zoomLevel}
                icon={<Zap className="w-4 h-4" />}
                showPercentage={true}
                color="#f59e0b"
              />
            </div>

            {/* Marker Controls */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-white mb-3">Marker Controls</h3>
              <div className="space-y-2">
                <button
                  onClick={handleAddMarker}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition-colors"
                >
                  Add Marker
                </button>
                <button
                  onClick={handleRemoveMarker}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                  disabled={markers.length === 0}
                >
                  Remove Marker
                </button>
                <button
                  onClick={handleToggleVisibility}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                  disabled={markers.length === 0}
                >
                  Toggle Last Marker
                </button>
                <button
                  onClick={handlePulseMarker}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
                  disabled={markers.length === 0}
                >
                  Pulse First Marker
                </button>
                <button
                  onClick={handleShakeMarker}
                  className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm transition-colors"
                  disabled={markers.length === 0}
                >
                  Shake First Marker
                </button>
              </div>
            </div>

            {/* Viewport Controls */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-white mb-3">Viewport Controls</h3>
              <div className="space-y-2">
                <button
                  onClick={handleZoomIn}
                  className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  Zoom In
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  Zoom Out
                </button>
                <button
                  onClick={handleResetView}
                  className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  Reset View
                </button>
                <button
                  onClick={handleFocusOnCenter}
                  className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  Focus Center
                </button>
              </div>
            </div>

            {/* Particle Effects */}
            <MapEffectsDemo mapContainerRef={mapRef} />
          </div>
        </div>

        {/* Feature Documentation */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Implemented Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Marker Animations</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Pop-in effect on placement</li>
                <li>Pop-out effect on removal</li>
                <li>Smooth position transitions</li>
                <li>Pulse animation for highlighting</li>
                <li>Shake animation for damage indication</li>
                <li>Visibility toggle with fade</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Viewport Animations</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Smooth zoom in/out</li>
                <li>Animated reset to default view</li>
                <li>Focus on point with zoom</li>
                <li>Combined pan and zoom</li>
                <li>Eased transitions for all movements</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Particle Effects</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Spell cast radiating particles</li>
                <li>Ability burst effects</li>
                <li>Damage indicators</li>
                <li>Heal effects with glow</li>
                <li>Radial pulse for AOE spells</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">UI Animations</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Count-up stat displays</li>
                <li>Color flash on value changes</li>
                <li>Slide-in entrance effects</li>
                <li>Fog of war reveal/hide transitions</li>
                <li>Smooth opacity changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
