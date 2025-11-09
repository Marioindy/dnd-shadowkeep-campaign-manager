'use client';

import Link from 'next/link';

/**
 * Header bar for the dashboard that displays branding, navigation, and user controls.
 *
 * Renders the Shadowkeep brand link, primary navigation links, a welcome message with the current user's username, and a DM Panel link when the user's role equals 'dm'.
 *
 * @returns The header React element for the dashboard layout.
 */
export default function DashboardHeader() {
  const user = { username: 'Player', role: 'player' };

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Shadowkeep
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-purple-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/characters" className="text-gray-300 hover:text-purple-400 transition-colors">
                Characters
              </Link>
              <Link href="/inventory" className="text-gray-300 hover:text-purple-400 transition-colors">
                Inventory
              </Link>
              <Link href="/maps" className="text-gray-300 hover:text-purple-400 transition-colors">
                Maps
              </Link>
              <Link href="/campaign" className="text-gray-300 hover:text-purple-400 transition-colors">
                Campaign
              </Link>
              <Link href="/session-tools" className="text-gray-300 hover:text-purple-400 transition-colors">
                Session Tools
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              Welcome, <span className="text-purple-400 font-semibold">{user.username}</span>
            </span>
            {user.role === 'dm' && (
              <Link
                href="/dm/overview"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors"
              >
                DM Panel
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}