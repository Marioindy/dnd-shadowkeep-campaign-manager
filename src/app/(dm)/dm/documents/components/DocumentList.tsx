'use client';

export default function DocumentList() {
  const documents = [
    { id: '1', name: 'Campaign Outline', type: 'PDF', size: '2.4 MB', uploadedAt: '2025-11-01' },
    { id: '2', name: 'NPC Roster', type: 'PDF', size: '1.8 MB', uploadedAt: '2025-10-28' },
    { id: '3', name: 'Session Notes - Week 1', type: 'TXT', size: '45 KB', uploadedAt: '2025-10-15' },
    { id: '4', name: 'Lore Document', type: 'PDF', size: '5.2 MB', uploadedAt: '2025-10-10' },
    { id: '5', name: 'Monster Stats', type: 'PDF', size: '3.1 MB', uploadedAt: '2025-10-05' },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF':
        return 'bg-red-500/10 text-red-400';
      case 'TXT':
        return 'bg-blue-500/10 text-blue-400';
      case 'IMG':
        return 'bg-green-500/10 text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">All Documents</h2>
        <input
          type="text"
          placeholder="Search documents..."
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none w-64"
        />
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded text-xs font-medium ${getTypeColor(doc.type)}`}>
                {doc.type}
              </div>
              <div>
                <h3 className="font-medium text-white">{doc.name}</h3>
                <p className="text-sm text-gray-400">
                  {doc.size} • Uploaded {doc.uploadedAt}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                View
              </button>
              <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
