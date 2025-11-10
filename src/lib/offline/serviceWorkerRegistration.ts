/**
 * Service Worker Registration Utility
 *
 * Provides functions to register, unregister, and manage the service worker.
 */

export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

/**
 * Register the service worker
 */
export async function registerServiceWorker(
  config?: ServiceWorkerConfig
): Promise<ServiceWorkerRegistration | null> {
  // Check if service workers are supported
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported in this browser');
    return null;
  }

  try {
    // Wait for the page to load
    if (document.readyState !== 'complete') {
      await new Promise((resolve) => {
        window.addEventListener('load', resolve);
      });
    }

    // Register the service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker registered:', registration);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New service worker available
            console.log('New service worker available');
            if (config?.onUpdate) {
              config.onUpdate(registration);
            }
          } else {
            // Service worker installed for the first time
            console.log('Service worker installed successfully');
            if (config?.onSuccess) {
              config.onSuccess(registration);
            }
          }
        }
      });
    });

    // Check for immediate update
    registration.update();

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    if (config?.onError) {
      config.onError(error instanceof Error ? error : new Error('Unknown error'));
    }
    return null;
  }
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const success = await registration.unregister();
      console.log('Service Worker unregistered:', success);
      return success;
    }
    return false;
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
    return false;
  }
}

/**
 * Update the service worker immediately
 */
export async function updateServiceWorker(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('Service Worker update check triggered');
    }
  } catch (error) {
    console.error('Service Worker update failed:', error);
  }
}

/**
 * Skip waiting and activate new service worker
 */
export function skipWaiting(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
}

/**
 * Clear all service worker caches
 */
export async function clearServiceWorkerCaches(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    console.log('All service worker caches cleared');

    // Also notify the service worker to clear its caches
    navigator.serviceWorker.controller?.postMessage({ type: 'CLEAR_CACHE' });
  } catch (error) {
    console.error('Failed to clear service worker caches:', error);
  }
}

/**
 * Check if service worker is active
 */
export async function isServiceWorkerActive(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return registration !== undefined && registration.active !== null;
  } catch {
    return false;
  }
}

/**
 * Listen for service worker messages
 */
export function addServiceWorkerMessageListener(
  callback: (event: MessageEvent) => void
): () => void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return () => {};
  }

  navigator.serviceWorker.addEventListener('message', callback);

  // Return cleanup function
  return () => {
    navigator.serviceWorker.removeEventListener('message', callback);
  };
}

/**
 * Request background sync (if supported)
 */
export async function requestBackgroundSync(tag: string = 'sync-mutations'): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    if ('sync' in registration) {
      await (registration as any).sync.register(tag);
      console.log('Background sync registered:', tag);
    } else {
      console.warn('Background sync not supported');
    }
  } catch (error) {
    console.error('Background sync registration failed:', error);
  }
}
