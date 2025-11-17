/**
 * Offline Indicator Component
 *
 * Displays connection status and sync information in the UI.
 * Shows online/offline state, pending mutations, and sync progress.
 */

'use client';

import React, { useState } from 'react';
import { useOffline } from '../../contexts/OfflineContext';

export function OfflineIndicator() {
  const {
    isOnline,
    isSyncing,
    pendingMutations,
    syncProgress,
    lastSyncTime,
    syncNow,
    offlineModeEnabled,
  } = useOffline();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncingManually, setIsSyncingManually] = useState(false);

  // Don't show if offline mode is not enabled
  if (!offlineModeEnabled) {
    return null;
  }

  const handleSyncClick = async () => {
    setIsSyncingManually(true);
    try {
      await syncNow();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncingManually(false);
    }
  };

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Never';

    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Compact indicator */}
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg cursor-pointer transition-all ${
          isOnline
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-yellow-900 border border-yellow-700'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Status dot */}
        <div className="relative">
          <div
            className={`w-3 h-3 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
          {isSyncing && (
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
          )}
        </div>

        {/* Status text */}
        <span className="text-sm font-medium text-gray-200">
          {isSyncing ? 'Syncing...' : isOnline ? 'Online' : 'Offline'}
        </span>

        {/* Pending mutations badge */}
        {pendingMutations > 0 && (
          <span className="px-2 py-0.5 text-xs font-bold bg-purple-600 text-white rounded-full">
            {pendingMutations}
          </span>
        )}

        {/* Expand icon */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="mt-2 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Sync Status</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Connection status */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              />
              <span className="text-sm text-gray-300">
                {isOnline ? 'Connected to server' : 'Working offline'}
              </span>
            </div>

            {!isOnline && (
              <p className="text-xs text-gray-400 ml-4">
                Changes will sync when connection is restored
              </p>
            )}
          </div>

          {/* Pending mutations */}
          {pendingMutations > 0 && (
            <div className="mb-4 p-3 bg-purple-900/30 border border-purple-700 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-purple-300">Pending Changes</span>
                <span className="text-lg font-bold text-purple-400">{pendingMutations}</span>
              </div>
              <p className="text-xs text-purple-300/70">
                Waiting to sync to server
              </p>
            </div>
          )}

          {/* Sync progress */}
          {syncProgress && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Syncing...</span>
                <span className="text-sm text-gray-400">
                  {syncProgress.completed} / {syncProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(syncProgress.completed / syncProgress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Last sync time */}
          <div className="mb-4 text-xs text-gray-400">
            Last synced: {formatLastSync(lastSyncTime)}
          </div>

          {/* Sync button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSyncClick();
            }}
            disabled={!isOnline || isSyncing || isSyncingManually}
            className={`w-full py-2 px-4 rounded font-medium text-sm transition-colors ${
              !isOnline || isSyncing || isSyncingManually
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isSyncing || isSyncingManually ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Syncing...
              </span>
            ) : !isOnline ? (
              'Offline - Cannot Sync'
            ) : (
              'Sync Now'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
