'use client';

export default function RecentActivity() {
  const activities = [
    { id: 1, type: 'character', message: 'Created character "Thaldrin"', time: '2 hours ago' },
    { id: 2, type: 'inventory', message: 'Added Longsword +1 to inventory', time: '5 hours ago' },
    { id: 3, type: 'map', message: 'Updated marker on Shadowkeep Dungeon', time: '1 day ago' },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 pb-4 border-b border-gray-800 last:border-0"
          >
            <div className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
            <div className="flex-1">
              <p className="text-gray-300">{activity.message}</p>
              <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
