'use client';

import Link from 'next/link';

const actions = [
  { label: 'Create Character', href: '/characters/new', color: 'purple' },
  { label: 'View Maps', href: '/maps', color: 'blue' },
  { label: 'Session Tools', href: '/session-tools', color: 'green' },
  { label: 'Campaign Notes', href: '/campaign', color: 'pink' },
];

export default function QuickActions() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`block w-full px-4 py-3 bg-${action.color}-600 hover:bg-${action.color}-700 rounded-lg text-center font-medium transition-colors`}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
