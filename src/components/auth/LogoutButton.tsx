'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import Button from '@/components/ui/Button';

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
}

/**
 * LogoutButton component that handles user logout
 * Clears session and redirects to login page
 */
export default function LogoutButton({
  variant = 'ghost',
  className = '',
}: LogoutButtonProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Button variant={variant} onClick={handleLogout} className={className}>
      Logout
    </Button>
  );
}
