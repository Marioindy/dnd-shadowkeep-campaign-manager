/**
 * Offline Mode Usage Examples
 *
 * This file demonstrates how to use the offline mode features
 * in the Shadowkeep Campaign Manager.
 */

import { useOffline } from '@/contexts/OfflineContext';
import { useOfflineQuery } from '@/hooks/useOfflineQuery';
import { useOfflineMutation } from '@/hooks/useOfflineMutation';

// ============================================================================
// Example 1: Basic Offline Status Indicator
// ============================================================================

export function OfflineStatusExample() {
  const { isOnline, pendingMutations } = useOffline();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`} />
      <span>{isOnline ? 'Online' : 'Offline'}</span>
      {pendingMutations > 0 && <span className="text-sm">({pendingMutations} pending)</span>}
    </div>
  );
}

// ============================================================================
// Example 2: Using Offline Query for Character List
// ============================================================================

export function CharacterListExample() {
  const { data: characters, isLoading, isOfflineData, refetch } = useOfflineQuery(
    // Replace with actual Convex query
    async () => {
      // const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      // return convex.query(api.characters.list, { userId });
      return [];
    },
    {
      storeName: 'characters',
      refetchOnReconnect: true, // Auto-refetch when connection restores
    }
  );

  if (isLoading) return <div>Loading characters...</div>;

  return (
    <div>
      {isOfflineData && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Viewing offline data. Changes will sync when online.
        </div>
      )}

      <button onClick={refetch} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        Refresh
      </button>

      <ul>
        {characters?.map((char: any) => (
          <li key={char._id}>
            {char.name} - Level {char.level} {char.class}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Example 3: Using Offline Mutation for Character Update
// ============================================================================

export function UpdateCharacterExample({ characterId }: { characterId: string }) {
  const { mutate, isLoading, isQueued } = useOfflineMutation(
    // Replace with actual Convex mutation
    async (args: { id: string; hp: number }) => {
      // const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      // return convex.mutation(api.characters.update, args);
      return { _id: args.id, hp: args.hp };
    },
    {
      storeName: 'characters',
      mutationType: 'update',
      functionName: 'characters:update',
      optimisticUpdate: true, // Apply changes immediately to local storage
      onSuccess: (data) => {
        console.log('Character updated:', data);
      },
      onError: (error) => {
        console.error('Update failed:', error);
      },
    }
  );

  const handleUpdateHP = async (newHp: number) => {
    await mutate({ id: characterId, hp: newHp });
  };

  return (
    <div>
      <button
        onClick={() => handleUpdateHP(50)}
        disabled={isLoading}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Updating...' : 'Update HP to 50'}
      </button>

      {isQueued && (
        <div className="mt-2 text-sm text-yellow-600">
          Change queued for sync when connection restores
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 4: Manual Sync Control
// ============================================================================

export function ManualSyncExample() {
  const { syncNow, isSyncing, pendingMutations, syncProgress, lastSyncTime } = useOffline();

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  const handleSync = async () => {
    const result = await syncNow();
    if (result.success) {
      alert(`Synced ${result.syncedCount} changes successfully!`);
    } else {
      alert(`Sync failed: ${result.failedCount} errors`);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-4">Sync Status</h3>

      <div className="space-y-2 mb-4">
        <div>Pending mutations: {pendingMutations}</div>
        <div>Last synced: {formatLastSync(lastSyncTime)}</div>
      </div>

      {syncProgress && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Syncing...</span>
            <span>
              {syncProgress.completed} / {syncProgress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(syncProgress.completed / syncProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSync}
        disabled={isSyncing || pendingMutations === 0}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
      >
        {isSyncing ? 'Syncing...' : `Sync Now (${pendingMutations})`}
      </button>
    </div>
  );
}

// ============================================================================
// Example 5: Enable/Disable Offline Mode
// ============================================================================

export function OfflineModeToggleExample() {
  const { offlineModeEnabled, enableOfflineMode, disableOfflineMode, isOnline } = useOffline();

  const handleToggle = async () => {
    if (offlineModeEnabled) {
      await disableOfflineMode();
      alert('Offline mode disabled');
    } else {
      await enableOfflineMode();
      alert('Offline mode enabled - Data will be cached for offline use');
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-4">Offline Mode Settings</h3>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        <div className="text-sm text-gray-600">
          Status: {offlineModeEnabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>

      <button
        onClick={handleToggle}
        className={`w-full px-4 py-2 rounded text-white ${
          offlineModeEnabled ? 'bg-red-600' : 'bg-green-600'
        }`}
      >
        {offlineModeEnabled ? 'Disable Offline Mode' : 'Enable Offline Mode'}
      </button>

      {offlineModeEnabled && (
        <div className="mt-4 text-sm text-gray-600">
          Your data is being cached locally. You can use the app offline.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 6: Offline Query with Index
// ============================================================================

export function CharactersByUserExample({ userId }: { userId: string }) {
  const { data: characters, isLoading, isOfflineData } = useOfflineQuery(
    async () => {
      // Fetch from Convex with index
      return [];
    },
    {
      storeName: 'characters',
      indexName: 'by_user', // Use IndexedDB index
      indexValue: userId,
      enabled: !!userId, // Only fetch if userId is available
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isOfflineData && <span className="text-yellow-600">Offline Data</span>}
      <h3>Characters for User {userId}</h3>
      <ul>
        {characters?.map((char: any) => (
          <li key={char._id}>{char.name}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Example 7: Create New Character Offline
// ============================================================================

export function CreateCharacterExample() {
  const { mutate, isLoading, isQueued } = useOfflineMutation(
    async (args: { name: string; class: string; level: number }) => {
      // Create character via Convex
      return { _id: 'temp-id', ...args };
    },
    {
      storeName: 'characters',
      mutationType: 'create',
      functionName: 'characters:create',
      optimisticUpdate: true,
      onSuccess: (data) => {
        alert('Character created!');
      },
    }
  );

  const handleCreate = async () => {
    await mutate({
      name: 'Aragorn',
      class: 'Ranger',
      level: 1,
    });
  };

  return (
    <button
      onClick={handleCreate}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {isLoading ? 'Creating...' : 'Create Character'}
      {isQueued && ' (Queued)'}
    </button>
  );
}

// ============================================================================
// Example 8: Delete Character Offline
// ============================================================================

export function DeleteCharacterExample({ characterId }: { characterId: string }) {
  const { mutate, isLoading } = useOfflineMutation(
    async (args: { id: string }) => {
      // Delete character via Convex
      return { success: true };
    },
    {
      storeName: 'characters',
      mutationType: 'delete',
      functionName: 'characters:delete',
      optimisticUpdate: true,
    }
  );

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this character?')) {
      await mutate({ id: characterId });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      {isLoading ? 'Deleting...' : 'Delete Character'}
    </button>
  );
}

// ============================================================================
// Example 9: Complete Character Management Page
// ============================================================================

export function CompleteCharacterPageExample({ userId }: { userId: string }) {
  const { isOnline, pendingMutations, syncNow } = useOffline();

  const { data: characters, isLoading, isOfflineData, refetch } = useOfflineQuery(
    async () => [],
    {
      storeName: 'characters',
      indexName: 'by_user',
      indexValue: userId,
    }
  );

  const { mutate: updateCharacter } = useOfflineMutation(
    async (args: any) => args,
    {
      storeName: 'characters',
      mutationType: 'update',
      functionName: 'characters:update',
      optimisticUpdate: true,
    }
  );

  return (
    <div className="p-6">
      {/* Header with status */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Characters</h1>

        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>

          {pendingMutations > 0 && (
            <button
              onClick={syncNow}
              className="text-sm px-3 py-1 bg-purple-600 text-white rounded"
            >
              Sync {pendingMutations}
            </button>
          )}
        </div>
      </div>

      {/* Offline data warning */}
      {isOfflineData && (
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">Viewing Offline Data</p>
          <p className="text-sm">Changes will sync when connection is restored.</p>
        </div>
      )}

      {/* Character list */}
      {isLoading ? (
        <div>Loading characters...</div>
      ) : (
        <div className="grid gap-4">
          {characters?.map((char: any) => (
            <div key={char._id} className="p-4 border rounded-lg">
              <h3 className="font-bold">{char.name}</h3>
              <p>
                Level {char.level} {char.class}
              </p>

              <button
                onClick={() => updateCharacter({ id: char._id, hp: char.hp - 10 })}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                Take Damage
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
