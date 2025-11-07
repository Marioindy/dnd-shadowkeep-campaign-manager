'use client';

interface InventoryItemProps {
  item: {
    _id: string;
    name: string;
    type: string;
    quantity: number;
    weight: number;
  };
}

/**
 * Render a styled inventory card for a single item.
 *
 * @param item - The inventory item to display; expected fields: `_id`, `name`, `type`, `quantity`, and `weight`.
 * @returns A JSX element containing the item's name, a colored type badge, quantity, and total weight in pounds.
 */
export default function InventoryItem({ item }: InventoryItemProps) {
  const typeColors: Record<string, string> = {
    weapon: 'text-red-400 bg-red-500/10',
    armor: 'text-blue-400 bg-blue-500/10',
    potion: 'text-green-400 bg-green-500/10',
    tool: 'text-yellow-400 bg-yellow-500/10',
    misc: 'text-gray-400 bg-gray-500/10',
  };

  const colorClass = typeColors[item.type] || typeColors.misc;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white">{item.name}</h3>
        <span className={`px-2 py-1 rounded text-xs ${colorClass}`}>
          {item.type}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Qty: {item.quantity}</span>
        <span>{(item.weight * item.quantity).toFixed(1)} lbs</span>
      </div>
    </div>
  );
}