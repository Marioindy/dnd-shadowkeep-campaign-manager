'use client';

import { useOffline } from '@/contexts/OfflineContext';

/**
 * Displays a banner when the user is offline or has pending mutations
 */
export function OfflineIndicator() {
  const { isOnline, pendingMutations } = useOffline();

  if (isOnline && pendingMutations === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-gray-900 px-4 py-2 text-center text-sm font-medium">
      {!isOnline ? (
        <span>You are offline. Changes will be synced when connection is restored.</span>
      ) : pendingMutations > 0 ? (
        <span>Syncing {pendingMutations} pending change{pendingMutations > 1 ? 's' : ''}...</span>
      ) : null}
    </div>
  );
}
