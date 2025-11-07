'use client';

interface StatBlockProps {
  label: string;
  value: number;
  modifier?: number;
}

/**
 * Renders a centered stat block showing a label, a numeric value, and a formatted modifier.
 *
 * If `modifier` is omitted, the modifier is derived as Math.floor((value - 10) / 2).
 *
 * @param label - Short descriptor shown above the value
 * @param value - Numeric stat value to display
 * @param modifier - Optional explicit modifier to display instead of the derived value
 * @returns The JSX element for the stat block containing the label, value, and formatted modifier
 */
export default function StatBlock({ label, value, modifier }: StatBlockProps) {
  const calculatedModifier = modifier ?? Math.floor((value - 10) / 2);
  const modifierString = calculatedModifier >= 0 ? `+${calculatedModifier}` : `${calculatedModifier}`;

  return (
    <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
      <p className="text-xs text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-purple-400">{modifierString}</p>
    </div>
  );
}