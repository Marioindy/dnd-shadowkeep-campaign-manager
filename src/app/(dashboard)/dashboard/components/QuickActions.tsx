'use client';

import Link from 'next/link';
import clsx from 'clsx';

const actions = [
  { label: 'Create Character', href: '/characters/new', color: 'purple' },
  { label: 'View Maps', href: '/maps', color: 'blue' },
  { label: 'Session Tools', href: '/session-tools', color: 'green' },
  { label: 'Campaign Notes', href: '/campaign', color: 'pink' },
];

const colorClasses = {
  purple: 'bg-purple-600 hover:bg-purple-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
  green: 'bg-green-600 hover:bg-green-700',
  pink: 'bg-pink-600 hover:bg-pink-700',
  default: 'bg-gray-600 hover:bg-gray-700',
} as const;

/**
 * Renders a "Quick Actions" panel with one button-like link for each configured action.
 *
 * @returns A JSX element containing a titled container with link actions for navigation.
 */
export default function QuickActions() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={clsx(
              colorClasses[action.color as keyof typeof colorClasses] ?? colorClasses.default,
              'block w-full px-4 py-3 rounded-lg text-center font-medium transition-colors'
            )}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}