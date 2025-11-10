'use client';

import { InventoryItem } from '@/types';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { EquipmentSlot } from '@/lib/dragValidation';

interface InventoryItemProps {
  item: InventoryItem;
  source?: 'inventory' | 'equipment';
  slot?: EquipmentSlot;
  isDraggable?: boolean;
  onQuantityChange?: (newQuantity: number) => void;
}

/**
 * Render a styled inventory card for a single item with drag-and-drop support.
 *
 * @param item - The inventory item to display; expected fields: `id`, `name`, `type`, `quantity`, and `weight`.
 * @param source - The source of the item (inventory or equipment)
 * @param slot - The equipment slot if the item is equipped
 * @param isDraggable - Whether the item can be dragged (default: true)
 * @param onQuantityChange - Callback for when quantity changes
 * @returns A JSX element containing the item's name, a colored type badge, quantity, and total weight in pounds.
 */
export default function InventoryItem({
  item,
  source = 'inventory',
  slot,
  isDraggable = true,
  onQuantityChange,
}: InventoryItemProps) {
  const typeColors: Record<string, string> = {
    weapon: 'text-red-400 bg-red-500/10',
    armor: 'text-blue-400 bg-blue-500/10',
    potion: 'text-green-400 bg-green-500/10',
    tool: 'text-yellow-400 bg-yellow-500/10',
    misc: 'text-gray-400 bg-gray-500/10',
  };

  const colorClass = typeColors[item.type] || typeColors.misc;

  // Set up draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${source}-${item.id}`,
    data: {
      item,
      source,
      slot,
    },
    disabled: !isDraggable,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors ${
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
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
      {item.description && (
        <p className="text-xs text-gray-500 mt-2">{item.description}</p>
      )}
    </div>
  );
}