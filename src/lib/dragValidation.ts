import { InventoryItem } from '@/types';

// Equipment slot types
export type EquipmentSlot = 'mainHand' | 'offHand' | 'head' | 'chest' | 'legs' | 'feet' | 'accessory';

// Item type to valid equipment slots mapping
const itemTypeToSlots: Record<string, EquipmentSlot[]> = {
  weapon: ['mainHand', 'offHand'],
  armor: ['head', 'chest', 'legs', 'feet'],
  potion: [], // Potions cannot be equipped
  tool: [], // Tools cannot be equipped
  misc: ['accessory'], // Misc items can go in accessory slots
};

// Weapon type restrictions (from item properties)
const weaponTypeRestrictions: Record<string, EquipmentSlot[]> = {
  'two-handed': ['mainHand'], // Two-handed weapons only in main hand
  'one-handed': ['mainHand', 'offHand'],
  'shield': ['offHand'], // Shields only in off-hand
};

// Character class restrictions for items
const classRestrictions: Record<string, string[]> = {
  'heavy armor': ['Fighter', 'Paladin', 'Cleric'],
  'medium armor': ['Fighter', 'Paladin', 'Cleric', 'Barbarian', 'Ranger', 'Druid'],
  'martial weapons': ['Fighter', 'Paladin', 'Barbarian', 'Ranger', 'Monk'],
};

/**
 * Validates if an item can be dropped into a specific equipment slot
 */
export function canDropInSlot(
  item: InventoryItem,
  slot: EquipmentSlot
): boolean {
  // Get valid slots for this item type
  const validSlots = itemTypeToSlots[item.type] || [];

  // Check if slot is valid for this item type
  if (!validSlots.includes(slot)) {
    return false;
  }

  // Additional validation for weapons based on weapon type
  if (item.type === 'weapon' && item.properties?.weaponType) {
    const weaponType = item.properties.weaponType as string;
    const allowedSlots = weaponTypeRestrictions[weaponType];

    if (allowedSlots && !allowedSlots.includes(slot)) {
      return false;
    }
  }

  return true;
}

/**
 * Validates if a character class can use a specific item
 */
export function canClassUseItem(
  item: InventoryItem,
  characterClass: string
): { canUse: boolean; reason?: string } {
  // Check for class restrictions based on item properties
  const armorType = item.properties?.armorType as string | undefined;
  const weaponCategory = item.properties?.weaponCategory as string | undefined;

  // Check armor restrictions
  if (item.type === 'armor' && armorType) {
    const allowedClasses = classRestrictions[armorType.toLowerCase()];
    if (allowedClasses && !allowedClasses.includes(characterClass)) {
      return {
        canUse: false,
        reason: `${characterClass} cannot use ${armorType}`,
      };
    }
  }

  // Check weapon restrictions
  if (item.type === 'weapon' && weaponCategory === 'martial') {
    const allowedClasses = classRestrictions['martial weapons'];
    if (!allowedClasses.includes(characterClass)) {
      return {
        canUse: false,
        reason: `${characterClass} cannot use martial weapons`,
      };
    }
  }

  return { canUse: true };
}

/**
 * Checks if two items can be swapped (when dragging equipped item to another slot)
 */
export function canSwapItems(
  item1: InventoryItem,
  slot1: EquipmentSlot,
  item2: InventoryItem,
  slot2: EquipmentSlot
): boolean {
  return canDropInSlot(item1, slot2) && canDropInSlot(item2, slot1);
}

/**
 * Validates if equipping an item would conflict with currently equipped items
 * For example: two-handed weapons conflict with off-hand items
 */
export function hasEquipmentConflict(
  item: InventoryItem,
  slot: EquipmentSlot,
  currentEquipment: Record<EquipmentSlot, InventoryItem | null>
): { hasConflict: boolean; conflictingSlots?: EquipmentSlot[] } {
  // Check for two-handed weapon conflicts
  if (
    item.type === 'weapon' &&
    item.properties?.weaponType === 'two-handed' &&
    slot === 'mainHand'
  ) {
    if (currentEquipment.offHand) {
      return {
        hasConflict: true,
        conflictingSlots: ['offHand'],
      };
    }
  }

  // Check if off-hand item conflicts with two-handed main hand
  if (slot === 'offHand' && currentEquipment.mainHand) {
    const mainHandItem = currentEquipment.mainHand;
    if (
      mainHandItem.type === 'weapon' &&
      mainHandItem.properties?.weaponType === 'two-handed'
    ) {
      return {
        hasConflict: true,
        conflictingSlots: ['mainHand'],
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Gets a user-friendly message for why an item cannot be equipped
 */
export function getDropValidationMessage(
  item: InventoryItem,
  slot: EquipmentSlot,
  characterClass?: string
): string | null {
  // Check slot compatibility
  if (!canDropInSlot(item, slot)) {
    const itemTypeName = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    return `${itemTypeName}s cannot be equipped in ${slot} slot`;
  }

  // Check class restrictions
  if (characterClass) {
    const classCheck = canClassUseItem(item, characterClass);
    if (!classCheck.canUse) {
      return classCheck.reason || 'Class cannot use this item';
    }
  }

  return null;
}

/**
 * Checks if an item is stackable
 */
export function isStackable(item: InventoryItem): boolean {
  // Potions, tools (like torches, rope), and misc items (like rations, gold) are stackable
  return ['potion', 'tool', 'misc'].includes(item.type);
}

/**
 * Merges two stackable items, returns the merged item
 */
export function mergeStackableItems(
  item1: InventoryItem,
  item2: InventoryItem
): InventoryItem | null {
  // Can only merge if both are the same item
  if (item1.name !== item2.name || !isStackable(item1)) {
    return null;
  }

  return {
    ...item1,
    quantity: item1.quantity + item2.quantity,
  };
}
