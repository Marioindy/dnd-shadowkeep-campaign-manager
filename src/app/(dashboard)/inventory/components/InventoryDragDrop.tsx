'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { InventoryItem } from '@/types';
import {
  canDropInSlot,
  canClassUseItem,
  hasEquipmentConflict,
  getDropValidationMessage,
  isStackable,
  mergeStackableItems,
  EquipmentSlot,
} from '@/lib/dragValidation';

interface InventoryDragDropProps {
  children: React.ReactNode;
  characterClass?: string;
  onItemEquip?: (item: InventoryItem, slot: EquipmentSlot) => void;
  onItemUnequip?: (item: InventoryItem, slot: EquipmentSlot) => void;
  onItemMove?: (item: InventoryItem, fromSlot: EquipmentSlot, toSlot: EquipmentSlot) => void;
  onStackMerge?: (item1: InventoryItem, item2: InventoryItem) => void;
}

export interface DragItem {
  item: InventoryItem;
  source: 'inventory' | 'equipment';
  slot?: EquipmentSlot;
}

/**
 * InventoryDragDrop component provides drag-and-drop functionality for inventory management
 * Uses dnd-kit library for handling drag operations between inventory and equipment slots
 */
export default function InventoryDragDrop({
  children,
  characterClass,
  onItemEquip,
  onItemUnequip,
  onItemMove,
  onStackMerge,
}: InventoryDragDropProps) {
  const [activeItem, setActiveItem] = useState<DragItem | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<EquipmentSlot | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag (prevents accidental drags)
      },
    })
  );

  /**
   * Handle drag start - store the dragged item
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as DragItem;

    setActiveItem(data);
    setValidationMessage(null);
  };

  /**
   * Handle drag over - validate drop target and show feedback
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;

    if (!over || !activeItem) {
      setDragOverSlot(null);
      setValidationMessage(null);
      return;
    }

    const targetData = over.data.current as { slot?: EquipmentSlot };
    const targetSlot = targetData?.slot;

    if (targetSlot) {
      setDragOverSlot(targetSlot);

      // Validate the drop
      const validationMsg = getDropValidationMessage(
        activeItem.item,
        targetSlot,
        characterClass
      );

      setValidationMessage(validationMsg);
    } else {
      setDragOverSlot(null);
      setValidationMessage(null);
    }
  };

  /**
   * Handle drag end - perform the item move/equip/unequip action
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveItem(null);
    setDragOverSlot(null);
    setValidationMessage(null);

    if (!over) return;

    const dragData = active.data.current as DragItem;
    const dropData = over.data.current as {
      slot?: EquipmentSlot;
      item?: InventoryItem;
      isInventory?: boolean;
    };

    // Case 1: Dropping into an equipment slot
    if (dropData.slot) {
      const targetSlot = dropData.slot;

      // Validate the drop
      if (!canDropInSlot(dragData.item, targetSlot)) {
        console.warn('Invalid drop: Item cannot be equipped in this slot');
        return;
      }

      // Check class restrictions
      if (characterClass) {
        const classCheck = canClassUseItem(dragData.item, characterClass);
        if (!classCheck.canUse) {
          console.warn(`Invalid drop: ${classCheck.reason}`);
          return;
        }
      }

      // Case 1a: Moving from inventory to equipment slot
      if (dragData.source === 'inventory') {
        onItemEquip?.(dragData.item, targetSlot);
      }
      // Case 1b: Moving from one equipment slot to another
      else if (dragData.source === 'equipment' && dragData.slot) {
        if (dragData.slot !== targetSlot) {
          onItemMove?.(dragData.item, dragData.slot, targetSlot);
        }
      }
    }
    // Case 2: Dropping back into inventory (unequip)
    else if (dropData.isInventory && dragData.source === 'equipment' && dragData.slot) {
      onItemUnequip?.(dragData.item, dragData.slot);
    }
    // Case 3: Merging stackable items
    else if (
      dropData.item &&
      isStackable(dragData.item) &&
      dragData.item.name === dropData.item.name
    ) {
      onStackMerge?.(dragData.item, dropData.item);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Pass drag state to children through context */}
      <DragStateProvider
        activeItem={activeItem}
        dragOverSlot={dragOverSlot}
        validationMessage={validationMessage}
      >
        {children}
      </DragStateProvider>

      {/* Drag overlay - shows the item being dragged */}
      <DragOverlay>
        {activeItem && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg opacity-90">
            <div className="flex items-center gap-2">
              <div className="text-white font-semibold">{activeItem.item.name}</div>
              <span className="text-xs text-gray-400">
                {activeItem.item.quantity > 1 ? `x${activeItem.item.quantity}` : ''}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {activeItem.item.weight * activeItem.item.quantity} lbs
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

// Context for sharing drag state with child components
interface DragState {
  activeItem: DragItem | null;
  dragOverSlot: EquipmentSlot | null;
  validationMessage: string | null;
}

const DragStateContext = React.createContext<DragState>({
  activeItem: null,
  dragOverSlot: null,
  validationMessage: null,
});

function DragStateProvider({
  children,
  activeItem,
  dragOverSlot,
  validationMessage,
}: {
  children: React.ReactNode;
  activeItem: DragItem | null;
  dragOverSlot: EquipmentSlot | null;
  validationMessage: string | null;
}) {
  return (
    <DragStateContext.Provider value={{ activeItem, dragOverSlot, validationMessage }}>
      {children}
    </DragStateContext.Provider>
  );
}

/**
 * Hook to access drag state from child components
 */
export function useDragState() {
  return React.useContext(DragStateContext);
}
