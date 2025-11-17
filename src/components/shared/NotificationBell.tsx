'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';

interface Notification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: number;
}

export default function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'DMaster99 started following you',
      type: 'follow',
      isRead: false,
      createdAt: Date.now() - 3600000,
    },
    {
      id: '2',
      message: 'Someone commented on your post',
      type: 'comment',
      isRead: false,
      createdAt: Date.now() - 7200000,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 rounded-full text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />

          {/* Notifications Panel */}
          <Card className="absolute right-0 mt-2 w-80 z-50 max-h-96 overflow-y-auto">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-white">
                  Notifications
                </h3>
              </div>

              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <p>No notifications</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer ${
                        !notification.isRead ? 'bg-purple-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <p className="text-sm text-white">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {getTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {notifications.length > 0 && (
                <div className="p-3 text-center border-t border-gray-800">
                  <button className="text-sm text-purple-400 hover:text-purple-300">
                    View all notifications
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function getNotificationIcon(type: string): string {
  const icons: Record<string, string> = {
    follow: '👤',
    like: '❤️',
    comment: '💬',
    review: '⭐',
    mention: '@',
    campaign_invite: '🎲',
  };
  return icons[type] || '🔔';
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
