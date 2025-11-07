'use client';

import InventoryItem from './InventoryItem';

/**
 * Renders an inventory dashboard section showing a list of items and their aggregate weight.
 *
 * Displays a header with the title and computed total weight, a responsive grid of InventoryItem entries, and a full-width "Add New Item" button.
 *
 * @returns A JSX element containing the inventory grid UI.
 */
export default function InventoryGrid() {
  const items = [
    { _id: '1', name: 'Longsword +1', type: 'weapon', quantity: 1, weight: 3 },
    { _id: '2', name: 'Health Potion', type: 'potion', quantity: 5, weight: 0.5 },
    { _id: '3', name: 'Rope (50 ft)', type: 'tool', quantity: 1, weight: 10 },
    { _id: '4', name: 'Torch', type: 'tool', quantity: 10, weight: 1 },
    { _id: '5', name: 'Rations', type: 'misc', quantity: 7, weight: 2 },
    { _id: '6', name: 'Gold Pieces', type: 'misc', quantity: 237, weight: 0.02 },
  ];

  const totalWeight = items.reduce((sum, item) => sum + item.weight * item.quantity, 0);

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
        {items.map((item) => (
          <InventoryItem key={item._id} item={item} />
        ))}
      </div>

      <button className="mt-6 w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors">
        + Add New Item
      </button>
    </div>
  );
}