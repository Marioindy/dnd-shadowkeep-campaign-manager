'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/providers/AuthProvider';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

/**
 * AuthGuard component that conditionally renders children based on authentication status.
 *
 * @param children - Content to render if authenticated (or not authenticated if requireAuth is false)
 * @param fallback - Optional content to render in the opposite case
 * @param requireAuth - If true, renders children when authenticated. If false, renders when not authenticated.
 */
export default function AuthGuard({
  children,
  fallback = null,
  requireAuth = true,
}: AuthGuardProps) {
  const { isAuthenticated } = useAuth();

  const shouldRender = requireAuth ? isAuthenticated : !isAuthenticated;

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
