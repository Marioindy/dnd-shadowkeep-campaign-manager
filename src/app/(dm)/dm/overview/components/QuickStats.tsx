'use client';

export default function QuickStats() {
  const stats = [
    { label: 'Active Players', value: 4, color: 'blue' },
    { label: 'Current Session', value: 12, color: 'purple' },
    { label: 'Total NPCs', value: 23, color: 'green' },
    { label: 'Active Quests', value: 7, color: 'yellow' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-gray-900 rounded-lg p-4 border border-gray-800"
        >
          <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
