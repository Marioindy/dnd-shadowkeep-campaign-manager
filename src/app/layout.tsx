import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'D&D Campaign Manager - Shadowkeep',
  description: 'Real-time collaborative tabletop RPG management platform',
};

/**
 * Provides the root HTML layout for the application and renders `children` inside the document body.
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
      <body>{children}</body>
    </html>
  );
}