/**
 * Social Media Sharing Utilities
 * Provides functions to generate share links for various social media platforms
 */

export interface ShareData {
  title: string;
  description?: string;
  url: string;
  hashtags?: string[];
  imageUrl?: string;
}

// ============== TWITTER/X SHARING ==============

export function shareToTwitter(data: ShareData): string {
  const params = new URLSearchParams();

  const text = data.description
    ? `${data.title}\n\n${data.description}`
    : data.title;

  params.append('text', text);
  params.append('url', data.url);

  if (data.hashtags && data.hashtags.length > 0) {
    params.append('hashtags', data.hashtags.join(','));
  }

  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

// ============== FACEBOOK SHARING ==============

export function shareToFacebook(data: ShareData): string {
  const params = new URLSearchParams();
  params.append('u', data.url);

  if (data.hashtags && data.hashtags.length > 0) {
    params.append('hashtag', `#${data.hashtags[0]}`);
  }

  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

// ============== REDDIT SHARING ==============

export function shareToReddit(data: ShareData): string {
  const params = new URLSearchParams();
  params.append('url', data.url);
  params.append('title', data.title);

  return `https://reddit.com/submit?${params.toString()}`;
}

// ============== DISCORD SHARING ==============

/**
 * Generate Discord-friendly markdown for sharing
 * Discord doesn't have a direct share URL, so we generate copyable markdown
 */
export function generateDiscordMessage(data: ShareData): string {
  let message = `**${data.title}**\n`;

  if (data.description) {
    message += `${data.description}\n`;
  }

  message += `\n${data.url}`;

  if (data.hashtags && data.hashtags.length > 0) {
    message += `\n\nTags: ${data.hashtags.map(tag => `\`${tag}\``).join(' ')}`;
  }

  return message;
}

// ============== NATIVE WEB SHARE API ==============

/**
 * Check if Web Share API is available
 */
export function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * Use native Web Share API if available
 */
export async function shareNative(data: ShareData): Promise<void> {
  if (!canUseWebShare()) {
    throw new Error('Web Share API not available');
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.description,
      url: data.url,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // User cancelled, ignore
      return;
    }
    throw error;
  }
}

// ============== COPY TO CLIPBOARD ==============

/**
 * Copy share link to clipboard
 */
export async function copyToClipboard(data: ShareData): Promise<void> {
  let text = `${data.title}\n\n`;

  if (data.description) {
    text += `${data.description}\n\n`;
  }

  text += data.url;

  if (data.hashtags && data.hashtags.length > 0) {
    text += `\n\n${data.hashtags.map(tag => `#${tag}`).join(' ')}`;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

// ============== GENERATE SHAREABLE URL ==============

/**
 * Generate shareable URL for content
 */
export function generateShareableUrl(
  contentType: 'campaign' | 'character' | 'map' | 'post',
  contentId: string,
  baseUrl?: string
): string {
  const base = baseUrl || window.location.origin;
  return `${base}/community/${contentType}/${contentId}`;
}

// ============== OPEN SHARE DIALOG ==============

/**
 * Open share dialog in new window
 */
export function openShareDialog(
  url: string,
  title: string,
  width: number = 600,
  height: number = 400
): void {
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  const features = `
    width=${width},
    height=${height},
    left=${left},
    top=${top},
    toolbar=no,
    menubar=no,
    scrollbars=yes,
    resizable=yes
  `.replace(/\s+/g, '');

  window.open(url, title, features);
}

// ============== SHARE HELPERS ==============

/**
 * Get sharing options for different platforms
 */
export function getShareOptions(data: ShareData) {
  return {
    twitter: {
      name: 'Twitter',
      url: shareToTwitter(data),
      icon: '𝕏',
    },
    facebook: {
      name: 'Facebook',
      url: shareToFacebook(data),
      icon: '📘',
    },
    reddit: {
      name: 'Reddit',
      url: shareToReddit(data),
      icon: '🤖',
    },
    discord: {
      name: 'Discord',
      message: generateDiscordMessage(data),
      icon: '💬',
    },
  };
}

/**
 * Share to specific platform
 */
export function shareToPlatform(
  platform: 'twitter' | 'facebook' | 'reddit' | 'discord',
  data: ShareData
): void {
  switch (platform) {
    case 'twitter':
      openShareDialog(shareToTwitter(data), 'Share on Twitter');
      break;
    case 'facebook':
      openShareDialog(shareToFacebook(data), 'Share on Facebook');
      break;
    case 'reddit':
      openShareDialog(shareToReddit(data), 'Share on Reddit');
      break;
    case 'discord':
      // Copy Discord message to clipboard
      const message = generateDiscordMessage(data);
      navigator.clipboard.writeText(message);
      break;
  }
}

// ============== GENERATE OG META TAGS ==============

/**
 * Generate Open Graph meta tags for better social media previews
 */
export function generateOGMetaTags(data: ShareData): Record<string, string> {
  const tags: Record<string, string> = {
    'og:title': data.title,
    'og:url': data.url,
    'og:type': 'website',
  };

  if (data.description) {
    tags['og:description'] = data.description;
  }

  if (data.imageUrl) {
    tags['og:image'] = data.imageUrl;
  }

  // Twitter Card tags
  tags['twitter:card'] = 'summary_large_image';
  tags['twitter:title'] = data.title;

  if (data.description) {
    tags['twitter:description'] = data.description;
  }

  if (data.imageUrl) {
    tags['twitter:image'] = data.imageUrl;
  }

  return tags;
}
