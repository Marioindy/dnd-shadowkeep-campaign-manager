'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: 'adventurer123',
    displayName: 'Epic Adventurer',
    bio: 'Passionate DM and player. Love creating epic campaigns!',
    location: 'Waterdeep',
    website: 'https://mysite.com',
    twitterHandle: '@adventurer',
    discordUsername: 'adventurer#1234',
    isPublicProfile: true,
    followersCount: 42,
    followingCount: 28,
  });

  const handleSave = () => {
    // TODO: Save to backend
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl font-bold text-white">
              {profile.displayName.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {profile.displayName}
                  </h1>
                  <p className="text-gray-400">@{profile.username}</p>
                </div>
                <Button
                  variant={isEditing ? 'secondary' : 'primary'}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              {!isEditing ? (
                <>
                  <p className="text-gray-300 mt-4">{profile.bio}</p>
                  <div className="mt-4 flex gap-6 text-sm">
                    <div>
                      <span className="font-bold text-white">
                        {profile.followersCount}
                      </span>
                      <span className="text-gray-400"> Followers</span>
                    </div>
                    <div>
                      <span className="font-bold text-white">
                        {profile.followingCount}
                      </span>
                      <span className="text-gray-400"> Following</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-4 space-y-4">
                  <Input
                    label="Display Name"
                    value={profile.displayName}
                    onChange={(e) =>
                      setProfile({ ...profile, displayName: e.target.value })
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                    />
                  </div>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact & Social</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📍</span>
                    <span className="text-white">{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🔗</span>
                    <a
                      href={profile.website}
                      className="text-purple-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
                {profile.twitterHandle && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">𝕏</span>
                    <span className="text-white">{profile.twitterHandle}</span>
                  </div>
                )}
                {profile.discordUsername && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">💬</span>
                    <span className="text-white">{profile.discordUsername}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <StatItem label="Campaigns Shared" value="3" />
                <StatItem label="Characters Shared" value="7" />
                <StatItem label="Maps Shared" value="12" />
                <StatItem label="Total Downloads" value="245" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shared Content */}
      {!isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>My Shared Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-400 py-8">
              <p>Your shared campaigns, characters, and maps will appear here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white font-bold">{value}</span>
    </div>
  );
}
