import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="text-center space-y-8 max-w-4xl">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Shadowkeep
        </h1>
        <p className="text-xl text-gray-300">
          Real-time Collaborative Campaign Management
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Manage your D&D campaigns with real-time character sheets, interactive maps,
          and persistent session state. Built for dungeon masters and players who want
          their campaigns to last beyond a single session.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/login"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            View Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">
              Character Management
            </h3>
            <p className="text-sm text-gray-400">
              Create and manage detailed character sheets with real-time updates
            </p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">
              Interactive Maps
            </h3>
            <p className="text-sm text-gray-400">
              Upload PNG maps, place markers, and control fog of war
            </p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">
              Session Persistence
            </h3>
            <p className="text-sm text-gray-400">
              Pick up exactly where you left off, minutes or weeks later
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
