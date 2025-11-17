'use client';

import { useDroppable } from '@dnd-kit/core';
import { EquipmentSlot } from '@/lib/dragValidation';
import { InventoryItem } from '@/types';
import { useDragState } from './InventoryDragDrop';
import InventoryItemComponent from './InventoryItem';

interface EquipmentSlotsProps {
  equipment?: Record<EquipmentSlot, InventoryItem | null>;
  showValidationFeedback?: boolean;
}

/**
 * Render a styled equipment panel listing character equipment slots and their current items.
 * Each slot is droppable and shows visual feedback during drag operations.
 *
 * @param equipment - The currently equipped items
 * @param showValidationFeedback - Whether to show validation messages during drag
 * @returns A JSX element containing the equipment panel with droppable slot entries.
 */
export default function EquipmentSlots({
  equipment,
  showValidationFeedback = true,
}: EquipmentSlotsProps) {
  const slots: Array<{ id: EquipmentSlot; label: string }> = [
    { id: 'head', label: 'Head' },
    { id: 'chest', label: 'Chest' },
    { id: 'mainHand', label: 'Main Hand' },
    { id: 'offHand', label: 'Off Hand' },
    { id: 'legs', label: 'Legs' },
    { id: 'feet', label: 'Feet' },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-6">Equipment</h2>

      <div className="space-y-3">
        {slots.map((slot) => (
          <EquipmentSlot
            key={slot.id}
            slot={slot.id}
            label={slot.label}
            equippedItem={equipment?.[slot.id] || null}
            showValidationFeedback={showValidationFeedback}
          />
        ))}
      </div>
    </div>
  );
}

interface EquipmentSlotProps {
  slot: EquipmentSlot;
  label: string;
  equippedItem: InventoryItem | null;
  showValidationFeedback: boolean;
}

/**
 * Individual equipment slot component with drop zone
 */
function EquipmentSlot({
  slot,
  label,
  equippedItem,
  showValidationFeedback,
}: EquipmentSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `equipment-${slot}`,
    data: {
      slot,
      item: equippedItem,
    },
  });

  const { dragOverSlot, validationMessage } = useDragState();
  const isValidDrop = dragOverSlot === slot && !validationMessage;
  const isInvalidDrop = dragOverSlot === slot && validationMessage;

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-4 border-2 transition-all ${
        equippedItem
          ? 'bg-gray-800 border-purple-500'
          : 'bg-gray-800/50 border-dashed border-gray-700'
      } ${isValidDrop ? 'border-green-500 bg-green-500/10' : ''} ${
        isInvalidDrop ? 'border-red-500 bg-red-500/10' : ''
      } ${isOver ? 'scale-105' : 'scale-100'}`}
    >
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {equippedItem ? (
        <InventoryItemComponent
          item={equippedItem}
          source="equipment"
          slot={slot}
          isDraggable={true}
        />
      ) : (
        <div className="text-gray-600 text-sm italic py-2">Empty</div>
      )}
      {showValidationFeedback && isInvalidDrop && validationMessage && (
        <p className="text-xs text-red-400 mt-2">{validationMessage}</p>
      )}
    </div>
  );
}