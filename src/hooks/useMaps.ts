'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

/**
 * Hook to fetch maps for a campaign
 */
export function useMapsByCampaign(campaignId?: Id<'campaigns'>) {
  const maps = useQuery(
    api.maps.listByCampaign,
    campaignId ? { campaignId } : 'skip'
  );

  return {
    maps,
    isLoading: maps === undefined,
  };
}

/**
 * Hook to fetch a single map
 */
export function useMap(mapId?: Id<'maps'>) {
  const map = useQuery(api.maps.get, mapId ? { id: mapId } : 'skip');

  return {
    map,
    isLoading: map === undefined,
  };
}

/**
 * Hook to manage map mutations
 */
export function useMapMutations() {
  const createMap = useMutation(api.maps.create);
  const updateMap = useMutation(api.maps.update);
  const deleteMap = useMutation(api.maps.remove);

  return {
    createMap,
    updateMap,
    deleteMap,
  };
}
