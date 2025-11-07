'use client';

export default function ActiveSession() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-4">Active Session</h2>

      <div className="space-y-4">
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400 font-semibold">Session Active</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <p className="text-sm text-gray-400">Session #12</p>
          <p className="text-xs text-gray-500 mt-1">Started 2 hours ago</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
              Roll Initiative
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
              Spawn Enemy
            </button>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
              Update Map
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Session Notes</h3>
          <textarea
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            rows={6}
            placeholder="Add session notes..."
          />
        </div>
      </div>
    </div>
  );
}
