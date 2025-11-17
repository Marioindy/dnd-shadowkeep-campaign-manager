import { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

/**
 * Layout for dashboard routes
 * Wraps all dashboard pages with authentication protection
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="player">
      {children}
    </ProtectedRoute>
  );
}
