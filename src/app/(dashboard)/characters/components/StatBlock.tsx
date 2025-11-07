'use client';

interface StatBlockProps {
  label: string;
  value: number;
  modifier?: number;
}

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
