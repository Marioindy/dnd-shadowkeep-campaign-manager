'use client';

import InventoryItem from './InventoryItem';
import { useAuth } from '@/contexts/AuthContext';
import { useCharactersByUser } from '@/hooks/useCharacters';
import { useInventory } from '@/hooks/useInventory';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

/**
 * Renders an inventory dashboard section showing a list of items and their aggregate weight.
 *
 * Displays a header with the title and computed total weight, a responsive grid of InventoryItem entries, and a full-width "Add New Item" button.
 * Uses real-time data from Convex for the user's first character.
 *
 * @returns A JSX element containing the inventory grid UI.
 */
export default function InventoryGrid() {
  const { user } = useAuth();
  const { characters, isLoading: loadingCharacters } = useCharactersByUser(user?._id);

  // Get the first character for this user
  const character = characters?.[0];
  const { items, isLoading: loadingItems } = useInventory(character?._id);

  const totalWeight = items?.reduce((sum, item) => sum + item.weight * item.quantity, 0) || 0;

  if (loadingCharacters || loadingItems) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Items</h2>
        <div className="text-sm">
          <span className="text-gray-400">Total Weight: </span>
          <span className="text-white font-semibold">{totalWeight.toFixed(1)} lbs</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items && items.length > 0 ? (
          items.map((item) => (
            <InventoryItem key={item._id} item={item} />
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-gray-400">
            No items in inventory
          </div>
        )}
      </div>

      <button className="mt-6 w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors">
        + Add New Item
      </button>
    </div>
  );
}
