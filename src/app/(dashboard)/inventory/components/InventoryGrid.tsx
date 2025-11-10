'use client';

import { useState, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import InventoryItem from './InventoryItem';
import { InventoryItem as InventoryItemType } from '@/types';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface InventoryGridProps {
  items?: InventoryItemType[];
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
}

type SortOption = 'name' | 'type' | 'weight' | 'quantity';
type FilterOption = 'all' | 'weapon' | 'armor' | 'potion' | 'tool' | 'misc';

/**
 * Renders an inventory dashboard section showing a list of items with sorting, filtering, and drag-drop support.
 *
 * @param items - Array of inventory items to display
 * @param onQuantityChange - Callback when item quantity changes
 * @returns A JSX element containing the inventory grid UI.
 */
export default function InventoryGrid({ items = [], onQuantityChange }: InventoryGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortAscending, setSortAscending] = useState(true);

  // Make the grid droppable (for unequipping items)
  const { setNodeRef, isOver } = useDroppable({
    id: 'inventory-grid',
    data: {
      isInventory: true,
    },
  });

  // Filter and sort items
  const processedItems = useMemo(() => {
    let filtered = items;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'weight':
          comparison = a.weight * a.quantity - b.weight * b.quantity;
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
      }

      return sortAscending ? comparison : -comparison;
    });

    return sorted;
  }, [items, searchQuery, filterType, sortBy, sortAscending]);

  const totalWeight = items.reduce((sum, item) => sum + item.weight * item.quantity, 0);

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortAscending(!sortAscending);
    } else {
      setSortBy(option);
      setSortAscending(true);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-900 rounded-lg p-6 border border-gray-800 transition-colors ${
        isOver ? 'border-purple-500 bg-purple-500/5' : ''
      }`}
    >
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Items</h2>
        <div className="text-sm">
          <span className="text-gray-400">Total Weight: </span>
          <span className="text-white font-semibold">{totalWeight.toFixed(1)} lbs</span>
          <span className="text-gray-500 mx-2">|</span>
          <span className="text-gray-400">Count: </span>
          <span className="text-white font-semibold">{items.length}</span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex gap-2 flex-wrap">
          {/* Type Filter */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Filter className="text-gray-500 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterOption)}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Types</option>
              <option value="weapon">Weapons</option>
              <option value="armor">Armor</option>
              <option value="potion">Potions</option>
              <option value="tool">Tools</option>
              <option value="misc">Misc</option>
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="text-gray-500 w-4 h-4" />
            <button
              onClick={() => toggleSort('name')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                sortBy === 'name'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Name {sortBy === 'name' && (sortAscending ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('type')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                sortBy === 'type'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Type {sortBy === 'type' && (sortAscending ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('weight')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                sortBy === 'weight'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Weight {sortBy === 'weight' && (sortAscending ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[200px]">
        {processedItems.length > 0 ? (
          processedItems.map((item) => (
            <InventoryItem
              key={item.id}
              item={item}
              source="inventory"
              isDraggable={true}
              onQuantityChange={
                onQuantityChange ? (newQty) => onQuantityChange(item.id, newQty) : undefined
              }
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-gray-500">
            {searchQuery || filterType !== 'all' ? 'No items match your filters' : 'No items yet'}
          </div>
        )}
      </div>

      <button className="mt-6 w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors">
        + Add New Item
      </button>
    </div>
  );
}