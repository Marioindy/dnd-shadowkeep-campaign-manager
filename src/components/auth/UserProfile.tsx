'use client';

import { useAuth } from '@/providers/AuthProvider';
import { getRoleDisplayName } from '@/lib/auth';
import LogoutButton from './LogoutButton';

/**
 * UserProfile component displays current user information and logout button
 */
export default function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-white">{user.username}</p>
        <p className="text-xs text-gray-400">{getRoleDisplayName(user.role)}</p>
      </div>
      <LogoutButton variant="ghost" className="text-sm" />
    </div>
  );
}
