import { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

/**
 * Layout for DM routes
 * Wraps all DM pages with authentication protection requiring DM or Admin role
 */
export default function DMLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="dm">
      {children}
    </ProtectedRoute>
  );
}
