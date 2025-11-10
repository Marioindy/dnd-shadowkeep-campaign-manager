'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

/**
 * Hook to fetch sessions for a campaign
 */
export function useSessionsByCampaign(campaignId?: Id<'campaigns'>) {
  const sessions = useQuery(
    api.sessions.listByCampaign,
    campaignId ? { campaignId } : 'skip'
  );

  return {
    sessions,
    isLoading: sessions === undefined,
  };
}

/**
 * Hook to fetch active session for a campaign
 */
export function useActiveSession(campaignId?: Id<'campaigns'>) {
  const session = useQuery(
    api.sessions.getActive,
    campaignId ? { campaignId } : 'skip'
  );

  return {
    session,
    isLoading: session === undefined,
  };
}

/**
 * Hook to fetch a single session
 */
export function useSession(sessionId?: Id<'sessions'>) {
  const session = useQuery(
    api.sessions.get,
    sessionId ? { id: sessionId } : 'skip'
  );

  return {
    session,
    isLoading: session === undefined,
  };
}

/**
 * Hook to manage session mutations
 */
export function useSessionMutations() {
  const createSession = useMutation(api.sessions.create);
  const startSession = useMutation(api.sessions.start);
  const endSession = useMutation(api.sessions.end);
  const updateNotes = useMutation(api.sessions.updateNotes);
  const updateSession = useMutation(api.sessions.update);
  const deleteSession = useMutation(api.sessions.remove);

  return {
    createSession,
    startSession,
    endSession,
    updateNotes,
    updateSession,
    deleteSession,
  };
}
