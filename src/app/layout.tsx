import type { Metadata } from 'next';
import '../styles/globals.css';
import { ConvexClientProvider } from '@/providers/ConvexClientProvider';
import { AuthProvider } from '@/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'D&D Campaign Manager - Shadowkeep',
  description: 'Real-time collaborative tabletop RPG management platform',
};

/**
 * Provides the root HTML layout for the application and renders `children` inside the document body.
 * Wraps the application with ConvexProvider and AuthProvider for authentication and real-time data.
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
          <AuthProvider>{children}</AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}