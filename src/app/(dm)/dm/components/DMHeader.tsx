'use client';

import Link from 'next/link';

/**
 * Render the DM Panel header with a title, responsive navigation, and a Player View link.
 *
 * The header includes a gradient-styled "DM Panel" title, a navigation bar with links to
 * Overview, Party Management, Map Control, and Documents (navigation is hidden on small screens
 * and visible on medium screens and larger), and a right-aligned "Player View" link to the dashboard.
 *
 * @returns A JSX.Element containing the styled header and its navigation elements.
 */
export default function DMHeader() {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dm/overview" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600">
              DM Panel
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link href="/dm/overview" className="text-gray-300 hover:text-red-400 transition-colors">
                Overview
              </Link>
              <Link href="/dm/party-management" className="text-gray-300 hover:text-red-400 transition-colors">
                Party Management
              </Link>
              <Link href="/dm/map-control" className="text-gray-300 hover:text-red-400 transition-colors">
                Map Control
              </Link>
              <Link href="/dm/documents" className="text-gray-300 hover:text-red-400 transition-colors">
                Documents
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold transition-colors"
            >
              Player View
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}