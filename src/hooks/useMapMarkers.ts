'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export type MarkerType = 'player' | 'npc' | 'enemy' | 'poi';

export interface CreateMarkerArgs {
  mapId: Id<'maps'>;
  type: MarkerType;
  x: number;
  y: number;
  label?: string;
  color?: string;
  iconUrl?: string;
  visible: boolean;
}

/**
 * Hook to fetch all markers for a map (DM view)
 */
export function useMapMarkers(mapId?: Id<'maps'>) {
  const markers = useQuery(
    api.mapMarkers.listByMap,
    mapId ? { mapId } : 'skip'
  );

  return {
    markers,
    isLoading: markers === undefined,
  };
}

/**
 * Hook to fetch only visible markers (player view)
 */
export function useVisibleMapMarkers(mapId?: Id<'maps'>) {
  const markers = useQuery(
    api.mapMarkers.listVisibleByMap,
    mapId ? { mapId } : 'skip'
  );

  return {
    markers,
    isLoading: markers === undefined,
  };
}

/**
 * Hook to manage map marker mutations
 */
export function useMapMarkerMutations() {
  const createMarker = useMutation(api.mapMarkers.create);
  const updateMarker = useMutation(api.mapMarkers.update);
  const updatePosition = useMutation(api.mapMarkers.updatePosition);
  const updateVisibility = useMutation(api.mapMarkers.updateVisibility);
  const batchUpdateVisibility = useMutation(api.mapMarkers.batchUpdateVisibility);
  const deleteMarker = useMutation(api.mapMarkers.remove);

  return {
    createMarker,
    updateMarker,
    updatePosition,
    updateVisibility,
    batchUpdateVisibility,
    deleteMarker,
  };
}
