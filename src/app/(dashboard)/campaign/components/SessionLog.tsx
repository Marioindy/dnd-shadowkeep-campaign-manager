'use client';

export default function SessionLog() {
  const sessions = [
    {
      id: '1',
      number: 12,
      date: '2025-11-05',
      title: 'The Forgotten Catacombs',
      summary: 'Party explored the ancient catacombs beneath Shadowkeep',
    },
    {
      id: '2',
      number: 11,
      date: '2025-10-29',
      title: 'Goblin Ambush',
      summary: 'Encountered goblin raiders on the way to the fortress',
    },
    {
      id: '3',
      number: 10,
      date: '2025-10-22',
      title: 'The Mysterious Stranger',
      summary: 'Met a hooded figure with information about Shadowkeep',
    },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-4">Session History</h2>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-white">{session.title}</h3>
                <p className="text-sm text-gray-400">Session #{session.number}</p>
              </div>
              <span className="text-xs text-gray-500">{session.date}</span>
            </div>
            <p className="text-sm text-gray-400">{session.summary}</p>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors">
        + Add Session Notes
      </button>
    </div>
  );
}
