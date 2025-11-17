'use client';

import { useRef, useEffect, useState } from 'react';
import { StatAnimations } from '@/utils/mapAnimations';

interface AnimatedStatDisplayProps {
  label: string;
  value: number;
  previousValue?: number;
  icon?: React.ReactNode;
  color?: string;
  showPercentage?: boolean;
}

/**
 * Animated stat display component with GSAP-powered count-up animations.
 *
 * Features:
 * - Count-up animation when value changes
 * - Color flash highlight on changes
 * - Slide-in entrance animation
 * - Optional icon and percentage display
 *
 * @param label - Stat label text
 * @param value - Current stat value
 * @param previousValue - Previous value to animate from (optional)
 * @param icon - Optional icon element
 * @param color - Highlight color for changes (default: green)
 * @param showPercentage - Display as percentage (default: false)
 * @returns A JSX element showing the animated stat
 */
export default function AnimatedStatDisplay({
  label,
  value,
  previousValue,
  icon,
  color = '#10b981',
  showPercentage = false,
}: AnimatedStatDisplayProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(value);

  // Slide in on mount
  useEffect(() => {
    if (containerRef.current) {
      StatAnimations.slideIn(containerRef.current);
    }
  }, []);

  // Animate value changes
  useEffect(() => {
    if (valueRef.current && previousValue !== undefined && previousValue !== value) {
      // Count up animation
      StatAnimations.countUp(valueRef.current, previousValue, value, {
        duration: 1.0,
        onComplete: () => setDisplayValue(value),
      });

      // Highlight the change
      StatAnimations.highlightChange(valueRef.current, color);
    } else {
      setDisplayValue(value);
    }
  }, [value, previousValue, color]);

  return (
    <div
      ref={containerRef}
      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-gray-400">{icon}</div>}
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <span
          ref={valueRef}
          className="text-2xl font-bold text-white"
        >
          {Math.round(displayValue)}
          {showPercentage && '%'}
        </span>
      </div>
    </div>
  );
}
