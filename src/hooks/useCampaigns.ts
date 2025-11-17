'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

/**
 * Hook to fetch a campaign by ID
 */
export function useCampaign(campaignId?: Id<'campaigns'>) {
  const campaign = useQuery(
    api.campaigns.get,
    campaignId ? { id: campaignId } : 'skip'
  );

  return {
    campaign,
    isLoading: campaign === undefined,
  };
}

/**
 * Hook to fetch campaigns for a DM
 */
export function useCampaignsByDM(dmId?: Id<'users'>) {
  const campaigns = useQuery(
    api.campaigns.listByDM,
    dmId ? { dmId } : 'skip'
  );

  return {
    campaigns,
    isLoading: campaigns === undefined,
  };
}

/**
 * Hook to fetch campaign for a player
 */
export function useCampaignByPlayer(userId?: Id<'users'>) {
  const campaign = useQuery(
    api.campaigns.getByPlayer,
    userId ? { userId } : 'skip'
  );

  return {
    campaign,
    isLoading: campaign === undefined,
  };
}

/**
 * Hook to manage campaign mutations
 */
export function useCampaignMutations() {
  const createCampaign = useMutation(api.campaigns.create);
  const updateCampaign = useMutation(api.campaigns.update);
  const addPlayer = useMutation(api.campaigns.addPlayer);
  const removePlayer = useMutation(api.campaigns.removePlayer);
  const deleteCampaign = useMutation(api.campaigns.remove);

  return {
    createCampaign,
    updateCampaign,
    addPlayer,
    removePlayer,
    deleteCampaign,
  };
}
