'use client';

import { useState } from 'react';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import InventoryGrid from './components/InventoryGrid';
import EquipmentSlots from './components/EquipmentSlots';
import InventoryDragDrop from './components/InventoryDragDrop';
import { InventoryItem } from '@/types';
import { EquipmentSlot } from '@/lib/dragValidation';

/**
 * Render the Inventory page with drag-and-drop functionality.
 *
 * The layout includes:
 * - Dashboard header
 * - Equipment slots (left column)
 * - Inventory grid with sorting and filtering (right column)
 * - Drag-and-drop context for moving items between inventory and equipment
 *
 * @returns A JSX element containing the inventory page layout
 */
export default function InventoryPage() {
  // Sample data - replace with actual data from Convex
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Longsword +1',
      type: 'weapon',
      quantity: 1,
      weight: 3,
      description: 'A finely crafted longsword with magical enhancement',
      properties: { weaponType: 'one-handed', weaponCategory: 'martial' },
    },
    {
      id: '2',
      name: 'Health Potion',
      type: 'potion',
      quantity: 5,
      weight: 0.5,
      description: 'Restores 2d4+2 hit points',
    },
    {
      id: '3',
      name: 'Rope (50 ft)',
      type: 'tool',
      quantity: 1,
      weight: 10,
      description: 'Hemp rope, 50 feet',
    },
    {
      id: '4',
      name: 'Torch',
      type: 'tool',
      quantity: 10,
      weight: 1,
      description: 'Provides bright light in a 20-foot radius',
    },
    {
      id: '5',
      name: 'Rations',
      type: 'misc',
      quantity: 7,
      weight: 2,
      description: 'One day of travel rations',
    },
    {
      id: '6',
      name: 'Gold Pieces',
      type: 'misc',
      quantity: 237,
      weight: 0.02,
      description: 'Standard gold currency',
    },
    {
      id: '7',
      name: 'Chain Mail',
      type: 'armor',
      quantity: 1,
      weight: 55,
      description: 'Heavy armor, AC 16',
      properties: { armorType: 'heavy armor' },
    },
    {
      id: '8',
      name: 'Shield',
      type: 'armor',
      quantity: 1,
      weight: 6,
      description: '+2 AC bonus',
      properties: { weaponType: 'shield' },
    },
  ]);

  const [equipment, setEquipment] = useState<Record<EquipmentSlot, InventoryItem | null>>({
    head: null,
    chest: null,
    mainHand: null,
    offHand: null,
    legs: null,
    feet: null,
    accessory: null,
  });

  // Character class for validation - replace with actual character data
  const characterClass = 'Fighter';

  // Handle equipping an item
  const handleItemEquip = (item: InventoryItem, slot: EquipmentSlot) => {
    console.log('Equipping item:', item.name, 'to slot:', slot);

    // Remove from inventory
    setInventoryItems((prev) => prev.filter((i) => i.id !== item.id));

    // Add to equipment (unequip existing item if any)
    setEquipment((prev) => {
      const existingItem = prev[slot];

      // If there's an existing item, add it back to inventory
      if (existingItem) {
        setInventoryItems((prevItems) => [...prevItems, existingItem]);
      }

      return {
        ...prev,
        [slot]: item,
      };
    });
  };

  // Handle unequipping an item
  const handleItemUnequip = (item: InventoryItem, slot: EquipmentSlot) => {
    console.log('Unequipping item:', item.name, 'from slot:', slot);

    // Remove from equipment
    setEquipment((prev) => ({
      ...prev,
      [slot]: null,
    }));

    // Add back to inventory
    setInventoryItems((prev) => [...prev, item]);
  };

  // Handle moving item between equipment slots
  const handleItemMove = (
    item: InventoryItem,
    fromSlot: EquipmentSlot,
    toSlot: EquipmentSlot
  ) => {
    console.log('Moving item:', item.name, 'from', fromSlot, 'to', toSlot);

    setEquipment((prev) => {
      const existingItem = prev[toSlot];

      // If there's an existing item in the target slot, swap them
      if (existingItem) {
        return {
          ...prev,
          [fromSlot]: existingItem,
          [toSlot]: item,
        };
      }

      // Otherwise, just move the item
      return {
        ...prev,
        [fromSlot]: null,
        [toSlot]: item,
      };
    });
  };

  // Handle merging stackable items
  const handleStackMerge = (item1: InventoryItem, item2: InventoryItem) => {
    console.log('Merging stacks:', item1.name, item2.name);

    // Merge the quantities
    setInventoryItems((prev) => {
      const filtered = prev.filter((i) => i.id !== item1.id && i.id !== item2.id);
      const merged = {
        ...item1,
        quantity: item1.quantity + item2.quantity,
      };
      return [...filtered, merged];
    });
  };

  // Handle quantity changes
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    console.log('Changing quantity for item:', itemId, 'to', newQuantity);

    if (newQuantity <= 0) {
      // Remove item if quantity is 0
      setInventoryItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      // Update quantity
      setInventoryItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Inventory</h1>
          <p className="text-gray-400">Drag items to equip or manage your inventory</p>
        </div>

        <InventoryDragDrop
          characterClass={characterClass}
          onItemEquip={handleItemEquip}
          onItemUnequip={handleItemUnequip}
          onItemMove={handleItemMove}
          onStackMerge={handleStackMerge}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <EquipmentSlots equipment={equipment} showValidationFeedback={true} />
            </div>
            <div className="lg:col-span-2">
              <InventoryGrid items={inventoryItems} onQuantityChange={handleQuantityChange} />
            </div>
          </div>
        </InventoryDragDrop>
      </main>
    </div>
  );
}