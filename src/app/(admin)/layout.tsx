import { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

/**
 * Layout for admin routes
 * Wraps all admin pages with authentication protection requiring Admin role
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}
