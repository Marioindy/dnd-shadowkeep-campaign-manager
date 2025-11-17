'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  hp: number;
  maxHp: number;
  ac: number;
  speed: number;
}

export interface CreateCharacterArgs {
  userId: Id<'users'>;
  campaignId: Id<'campaigns'>;
  name: string;
  race: string;
  class: string;
  level: number;
  stats: CharacterStats;
  portraitUrl?: string;
  backstory?: string;
}

/**
 * Hook to fetch and manage characters for a campaign
 */
export function useCharactersByCampaign(campaignId?: Id<'campaigns'>) {
  const characters = useQuery(
    api.characters.listByCampaign,
    campaignId ? { campaignId } : 'skip'
  );

  return {
    characters,
    isLoading: characters === undefined,
  };
}

/**
 * Hook to fetch and manage characters for a user
 */
export function useCharactersByUser(userId?: Id<'users'>) {
  const characters = useQuery(
    api.characters.listByUser,
    userId ? { userId } : 'skip'
  );

  return {
    characters,
    isLoading: characters === undefined,
  };
}

/**
 * Hook to fetch a single character
 */
export function useCharacter(characterId?: Id<'characters'>) {
  const character = useQuery(
    api.characters.get,
    characterId ? { id: characterId } : 'skip'
  );

  return {
    character,
    isLoading: character === undefined,
  };
}

/**
 * Hook to manage character mutations
 */
export function useCharacterMutations() {
  const createCharacter = useMutation(api.characters.create);
  const updateCharacter = useMutation(api.characters.update);
  const updateHP = useMutation(api.characters.updateHP);
  const deleteCharacter = useMutation(api.characters.remove);

  return {
    createCharacter,
    updateCharacter,
    updateHP,
    deleteCharacter,
  };
}
