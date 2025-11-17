'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export type ItemType = 'weapon' | 'armor' | 'potion' | 'tool' | 'misc';

export interface AddInventoryItemArgs {
  characterId: Id<'characters'>;
  name: string;
  type: ItemType;
  quantity: number;
  weight: number;
  description?: string;
  properties?: any;
}

/**
 * Hook to fetch inventory for a character
 */
export function useInventory(characterId?: Id<'characters'>) {
  const items = useQuery(
    api.inventory.listByCharacter,
    characterId ? { characterId } : 'skip'
  );

  return {
    items,
    isLoading: items === undefined,
  };
}

/**
 * Hook to manage inventory mutations
 */
export function useInventoryMutations() {
  const addItem = useMutation(api.inventory.add);
  const updateItem = useMutation(api.inventory.update);
  const toggleEquip = useMutation(api.inventory.toggleEquip);
  const updateQuantity = useMutation(api.inventory.updateQuantity);
  const removeItem = useMutation(api.inventory.remove);

  return {
    addItem,
    updateItem,
    toggleEquip,
    updateQuantity,
    removeItem,
  };
}
