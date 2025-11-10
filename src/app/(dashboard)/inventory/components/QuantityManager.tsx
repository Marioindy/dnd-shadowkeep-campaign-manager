'use client';

import { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { InventoryItem } from '@/types';

interface QuantityManagerProps {
  item: InventoryItem;
  onQuantityChange: (newQuantity: number) => void;
  onClose?: () => void;
}

/**
 * Quantity manager component for adjusting stackable item quantities
 * Can be used inline or as a modal
 */
export default function QuantityManager({
  item,
  onQuantityChange,
  onClose,
}: QuantityManagerProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [inputValue, setInputValue] = useState(item.quantity.toString());

  const handleIncrement = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    setInputValue(newQty.toString());
  };

  const handleDecrement = () => {
    const newQty = Math.max(0, quantity - 1);
    setQuantity(newQty);
    setInputValue(newQty.toString());
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setQuantity(parsed);
    }
  };

  const handleApply = () => {
    onQuantityChange(quantity);
    onClose?.();
  };

  const handleCancel = () => {
    setQuantity(item.quantity);
    setInputValue(item.quantity.toString());
    onClose?.();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Adjust Quantity</h3>
        {onClose && (
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">{item.name}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecrement}
            className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            disabled={quantity <= 0}
          >
            <Minus className="w-4 h-4 text-white" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={handleIncrement}
            className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Weight information */}
      <div className="mb-4 p-3 bg-gray-900 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Unit Weight:</span>
          <span className="text-white">{item.weight} lbs</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-400">Total Weight:</span>
          <span className="text-white">{(item.weight * quantity).toFixed(2)} lbs</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {onClose && (
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          disabled={quantity === item.quantity}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

/**
 * Inline quantity adjuster for quick +/- changes
 */
export function InlineQuantityAdjuster({
  item,
  onQuantityChange,
}: {
  item: InventoryItem;
  onQuantityChange: (newQuantity: number);
}) {
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuantityChange(item.quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newQty = Math.max(0, item.quantity - 1);
    onQuantityChange(newQty);
  };

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={handleDecrement}
        className="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        disabled={item.quantity <= 0}
      >
        <Minus className="w-3 h-3 text-white" />
      </button>
      <span className="px-2 text-sm text-white font-medium">{item.quantity}</span>
      <button
        onClick={handleIncrement}
        className="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded transition-colors"
      >
        <Plus className="w-3 h-3 text-white" />
      </button>
    </div>
  );
}
