'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'player' | 'dm' | 'admin';
  fallbackPath?: string;
}

/**
 * ProtectedRoute component that ensures users are authenticated
 * and have the required role before accessing the route.
 *
 * @param children - Content to render if authorized
 * @param requiredRole - Minimum role required (admin > dm > player)
 * @param fallbackPath - Path to redirect to if unauthorized (defaults to /login)
 */
export default function ProtectedRoute({
  children,
  requiredRole = 'player',
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { user, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated
    if (!user) {
      router.push(fallbackPath);
      return;
    }

    // Authenticated but doesn't have required role
    if (!hasRole(requiredRole)) {
      router.push('/dashboard'); // Redirect to dashboard if insufficient permissions
      return;
    }
  }, [user, isLoading, hasRole, requiredRole, router, fallbackPath]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  // Not authenticated or insufficient permissions
  if (!user || !hasRole(requiredRole)) {
    return null;
  }

  // Authorized, render children
  return <>{children}</>;
}
