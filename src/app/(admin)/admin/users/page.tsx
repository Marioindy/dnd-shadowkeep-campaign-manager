'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useAuth } from '@/providers/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { validateUsername, validatePassword } from '@/lib/auth';

/**
 * Admin page for user management
 * Allows admins to create new users and view existing users
 */
export default function AdminUsersPage() {
  const { user } = useAuth();
  const createUserMutation = useMutation(api.users.createUser);
  const users = useQuery(api.users.listUsers, user ? { requestingUserId: user._id } : 'skip');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'player' as 'player' | 'dm' | 'admin',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must be logged in to create users');
      return;
    }

    // Validate input
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      setError(usernameValidation.errors[0]);
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    setLoading(true);

    try {
      await createUserMutation({
        username: formData.username,
        password: formData.password,
        role: formData.role,
        adminUserId: user._id,
      });

      setSuccess(`User "${formData.username}" created successfully!`);
      setFormData({ username: '', password: '', role: 'player' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      console.error('Create user error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">User Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create User Form */}
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">Create New User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
                required
              />

              <Input
                label="Password"
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                required
              />

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'player' | 'dm' | 'admin' })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white"
                >
                  <option value="player">Player</option>
                  <option value="dm">Dungeon Master</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {error && <ErrorMessage message={error} />}

              {success && (
                <div className="bg-green-500/10 border border-green-500 rounded-lg p-3">
                  <p className="text-sm text-green-500">{success}</p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating...' : 'Create User'}
              </Button>
            </form>
          </Card>

          {/* User List */}
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">Existing Users</h2>

            {users === undefined && (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            )}

            {users && users.length === 0 && (
              <p className="text-gray-400 text-center">No users found</p>
            )}

            {users && users.length > 0 && (
              <div className="space-y-3">
                {users.map((u: any) => (
                  <div
                    key={u._id}
                    className="bg-gray-800/50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-medium">{u.username}</p>
                      <p className="text-sm text-gray-400 capitalize">{u.role}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
