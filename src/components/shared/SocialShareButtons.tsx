'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  shareToPlatform,
  generateDiscordMessage,
  copyToClipboard,
  type ShareData,
} from '@/lib/social-sharing';

interface SocialShareButtonsProps {
  data: ShareData;
}

export default function SocialShareButtons({ data }: SocialShareButtonsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async (
    platform: 'twitter' | 'facebook' | 'reddit' | 'discord'
  ) => {
    if (platform === 'discord') {
      await copyToClipboard(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      shareToPlatform(platform, data);
    }
    setShowShareMenu(false);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(data.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShareMenu(false);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setShowShareMenu(!showShareMenu)}
      >
        {copied ? '✓ Copied!' : '🔗 Share'}
      </Button>

      {showShareMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowShareMenu(false)}
          />

          {/* Share Menu */}
          <Card className="absolute right-0 mt-2 w-64 z-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Share to
                </h3>

                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-left"
                  onClick={() => handleShare('twitter')}
                >
                  <span className="text-xl">𝕏</span>
                  <span className="text-white">Twitter</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-left"
                  onClick={() => handleShare('facebook')}
                >
                  <span className="text-xl">📘</span>
                  <span className="text-white">Facebook</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-left"
                  onClick={() => handleShare('reddit')}
                >
                  <span className="text-xl">🤖</span>
                  <span className="text-white">Reddit</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-left"
                  onClick={() => handleShare('discord')}
                >
                  <span className="text-xl">💬</span>
                  <span className="text-white">Discord</span>
                </button>

                <hr className="border-gray-700 my-2" />

                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-left"
                  onClick={handleCopyLink}
                >
                  <span className="text-xl">📋</span>
                  <span className="text-white">Copy Link</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
