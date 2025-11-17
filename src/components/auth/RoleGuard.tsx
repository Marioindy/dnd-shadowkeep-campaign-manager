'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/providers/AuthProvider';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: 'player' | 'dm' | 'admin';
  fallback?: ReactNode;
}

/**
 * RoleGuard component that conditionally renders children based on user role.
 * Unlike ProtectedRoute, this doesn't redirect - it just shows/hides content.
 *
 * @param children - Content to render if user has required role
 * @param requiredRole - Minimum role required
 * @param fallback - Optional content to render if user doesn't have required role
 */
export default function RoleGuard({
  children,
  requiredRole,
  fallback = null,
}: RoleGuardProps) {
  const { hasRole } = useAuth();

  if (!hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
