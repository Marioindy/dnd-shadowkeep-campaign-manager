import type { Metadata } from 'next';
import '../styles/globals.css';
import { ConvexClientProvider } from '@/providers/ConvexClientProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { OfflineProvider } from '../contexts/OfflineContext';
import { OfflineIndicator } from '../components/shared/OfflineIndicator';

export const metadata: Metadata = {
  title: 'D&D Campaign Manager - Shadowkeep',
  description: 'Real-time collaborative tabletop RPG management platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shadowkeep',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

/**
 * Provides the root HTML layout for the application and renders `children` inside the document body.
 * Wraps the application with ConvexProvider, AuthProvider, and OfflineProvider for authentication,
 * real-time data, and offline functionality.
 *
 * @param children - The React nodes to render inside the page's <body>.
 * @returns The root `<html>` element containing a `<body>` that wraps `children`.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <AuthProvider>
            <OfflineProvider>
              {children}
              <OfflineIndicator />
            </OfflineProvider>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}