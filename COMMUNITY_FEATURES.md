# Community Features Documentation

## Overview

The D&D Shadowkeep Campaign Manager now includes comprehensive community features that enable players and Dungeon Masters to share campaigns, characters, maps, and engage with fellow adventurers. This document provides detailed information about the implementation and usage of these features.

## Table of Contents

1. [Features Overview](#features-overview)
2. [Database Schema](#database-schema)
3. [Backend API](#backend-api)
4. [Frontend Components](#frontend-components)
5. [Social Sharing](#social-sharing)
6. [Discord Integration](#discord-integration)
7. [Usage Examples](#usage-examples)

---

## Features Overview

### 1. User Profiles and Following System

Users can create public profiles with:
- Display name and bio
- Avatar/profile picture
- Location and website
- Social media handles (Twitter, Discord)
- Follower/following counts
- Profile visibility settings

**Key Features:**
- Follow/unfollow other users
- View follower and following lists
- Search for users by username or display name
- Public/private profile toggle

### 2. Campaign Sharing and Collaboration

Share complete campaigns with the community:
- Campaign templates with full session data
- Maps and encounters included
- Visibility settings (private, friends, public)
- Tags and categories for discovery
- View and download tracking

**Sharing Options:**
- Share existing campaigns
- Create campaign templates from scratch
- Import shared campaigns
- Rate and review campaigns

### 3. Character Export/Import

Share optimized character builds:
- Complete character data export
- Inventory included
- Build strategies and notes
- Level progression recommendations
- Import characters into your campaigns

**Export Format:**
```json
{
  "character": {...},
  "inventory": [...],
  "exportedAt": 1234567890,
  "version": "1.0.0"
}
```

### 4. Map Repository

Community map sharing:
- Battle maps for encounters
- Dungeon layouts
- City/wilderness maps
- Grid size and dimension info
- Category-based browsing (dungeon, city, wilderness, etc.)

### 5. Reviews and Ratings System

Rate and review shared content:
- 5-star rating system
- Written reviews with title and comment
- Helpful vote count
- Average rating calculation
- Filter by rating or helpfulness

### 6. Community Posts and Discussions

Engage with the community:
- Post types: Discussion, Showcase, Question, Story
- Rich text content with images
- Comments and nested replies
- Reactions (like, love, laugh, wow)
- Tags for categorization

### 7. Notifications System

Stay updated with real-time notifications:
- Follow notifications
- Like and comment notifications
- Review notifications
- Campaign invite notifications
- Mention notifications
- Unread count indicator

### 8. Discord Bot Integration

Connect your campaigns to Discord:
- Webhook configuration per campaign
- Event-based notifications:
  - Session start/end
  - Character updates
  - New community posts
  - Combat start
- Rich embeds with campaign info
- Test webhook functionality

### 9. Social Media Sharing

Share content across platforms:
- Twitter/X integration
- Facebook sharing
- Reddit submission
- Discord message formatting
- Copy to clipboard
- Native Web Share API support

---

## Database Schema

### New Tables

#### `follows`
```typescript
{
  followerId: Id<'users'>,    // User who is following
  followingId: Id<'users'>,   // User being followed
  createdAt: number
}
```

#### `sharedCampaigns`
```typescript
{
  originalCampaignId?: Id<'campaigns'>,
  authorId: Id<'users'>,
  name: string,
  description: string,
  content: string,  // JSON serialized campaign data
  thumbnailUrl?: string,
  tags: string[],
  category: 'homebrew' | 'official' | 'oneshot' | 'longform' | 'other',
  difficulty?: 'beginner' | 'intermediate' | 'advanced',
  viewCount: number,
  downloadCount: number,
  likeCount: number,
  averageRating?: number,
  ratingCount?: number,
  createdAt: number,
  updatedAt: number
}
```

#### `sharedCharacters`
```typescript
{
  originalCharacterId?: Id<'characters'>,
  authorId: Id<'users'>,
  name: string,
  race: string,
  class: string,
  level: number,
  description: string,
  buildStrategy?: string,
  content: string,  // JSON serialized character data
  portraitUrl?: string,
  tags: string[],
  viewCount: number,
  downloadCount: number,
  likeCount: number,
  averageRating?: number,
  ratingCount?: number,
  createdAt: number,
  updatedAt: number
}
```

#### `sharedMaps`
```typescript
{
  originalMapId?: Id<'maps'>,
  authorId: Id<'users'>,
  name: string,
  description: string,
  imageUrl: string,
  thumbnailUrl?: string,
  gridSize?: string,
  dimensions?: string,
  tags: string[],
  category: 'dungeon' | 'wilderness' | 'city' | 'building' | 'battlemap' | 'other',
  viewCount: number,
  downloadCount: number,
  likeCount: number,
  averageRating?: number,
  ratingCount?: number,
  createdAt: number,
  updatedAt: number
}
```

#### `reviews`
```typescript
{
  authorId: Id<'users'>,
  contentType: 'campaign' | 'character' | 'map',
  contentId: string,
  rating: number,  // 1-5
  title?: string,
  comment?: string,
  helpful?: number,
  createdAt: number,
  updatedAt: number
}
```

#### `posts`
```typescript
{
  authorId: Id<'users'>,
  title: string,
  content: string,
  type: 'discussion' | 'showcase' | 'question' | 'story',
  tags: string[],
  campaignId?: Id<'campaigns'>,
  characterId?: Id<'characters'>,
  imageUrls?: string[],
  likeCount: number,
  commentCount: number,
  viewCount: number,
  isPinned?: boolean,
  createdAt: number,
  updatedAt: number
}
```

#### `comments`
```typescript
{
  authorId: Id<'users'>,
  contentType: 'post' | 'campaign' | 'character' | 'map',
  contentId: string,
  parentCommentId?: Id<'comments'>,
  content: string,
  likeCount: number,
  createdAt: number,
  updatedAt: number
}
```

#### `reactions`
```typescript
{
  userId: Id<'users'>,
  contentType: 'post' | 'comment' | 'campaign' | 'character' | 'map',
  contentId: string,
  reactionType: 'like' | 'love' | 'laugh' | 'wow',
  createdAt: number
}
```

#### `notifications`
```typescript
{
  userId: Id<'users'>,
  type: 'follow' | 'like' | 'comment' | 'review' | 'mention' | 'campaign_invite',
  actorId?: Id<'users'>,
  contentType?: string,
  contentId?: string,
  message: string,
  isRead: boolean,
  createdAt: number
}
```

#### `discordWebhooks`
```typescript
{
  userId: Id<'users'>,
  campaignId?: Id<'campaigns'>,
  webhookUrl: string,
  webhookName: string,
  events: ('session_start' | 'session_end' | 'character_update' | 'new_post' | 'combat_start')[],
  isActive: boolean,
  createdAt: number,
  updatedAt: number
}
```

#### `socialShares`
```typescript
{
  userId: Id<'users'>,
  contentType: 'campaign' | 'character' | 'map' | 'post',
  contentId: string,
  platform: 'twitter' | 'facebook' | 'reddit' | 'discord',
  shareUrl: string,
  createdAt: number
}
```

### Extended Tables

#### `users` (extended fields)
```typescript
{
  // ... existing fields ...
  displayName?: string,
  bio?: string,
  avatarUrl?: string,
  location?: string,
  website?: string,
  twitterHandle?: string,
  discordUsername?: string,
  isPublicProfile?: boolean,
  followersCount?: number,
  followingCount?: number,
  updatedAt?: number
}
```

#### `campaigns` (extended fields)
```typescript
{
  // ... existing fields ...
  isShared?: boolean,
  visibility?: 'private' | 'friends' | 'public',
  tags?: string[],
  thumbnailUrl?: string,
  viewCount?: number,
  likeCount?: number
}
```

---

## Backend API

### Profile API (`convex/profiles.ts`)

**Queries:**
- `getProfile(userId)` - Get user profile by ID
- `getProfileByUsername(username)` - Get profile by username
- `getFollowers(userId)` - Get user's followers
- `getFollowing(userId)` - Get users being followed
- `isFollowing(followerId, followingId)` - Check follow status
- `searchUsers(searchTerm, limit?)` - Search users

**Mutations:**
- `updateProfile(userId, profileData)` - Update user profile
- `followUser(followerId, followingId)` - Follow a user
- `unfollowUser(followerId, followingId)` - Unfollow a user

### Community API (`convex/community.ts`)

**Shared Campaigns:**
- `browseSharedCampaigns(category?, sortBy?, limit?, offset?)` - Browse campaigns
- `getSharedCampaign(campaignId)` - Get specific campaign
- `getUserSharedCampaigns(userId)` - Get user's shared campaigns
- `shareCampaign(campaignData)` - Share a campaign

**Shared Characters:**
- `browseSharedCharacters(class?, sortBy?, limit?, offset?)` - Browse characters
- `getSharedCharacter(characterId)` - Get specific character
- `shareCharacter(characterData)` - Share a character

**Shared Maps:**
- `browseSharedMaps(category?, sortBy?, limit?, offset?)` - Browse maps
- `getSharedMap(mapId)` - Get specific map
- `shareMap(mapData)` - Share a map

**Tracking:**
- `incrementViewCount(contentType, contentId)` - Track views
- `incrementDownloadCount(contentType, contentId)` - Track downloads
- `searchSharedContent(searchTerm, contentType?, limit?)` - Search content

### Reviews API (`convex/reviews.ts`)

**Queries:**
- `getReviews(contentType, contentId, sortBy?, limit?)` - Get reviews
- `getUserReviews(userId)` - Get user's reviews
- `getReviewStats(contentType, contentId)` - Get rating statistics
- `hasUserReviewed(userId, contentType, contentId)` - Check if reviewed

**Mutations:**
- `createReview(reviewData)` - Create a review
- `updateReview(reviewId, updates)` - Update a review
- `deleteReview(reviewId)` - Delete a review
- `markReviewHelpful(reviewId)` - Mark review as helpful

### Social API (`convex/social.ts`)

**Posts:**
- `getPosts(type?, sortBy?, limit?, offset?)` - Get posts feed
- `getPost(postId)` - Get single post
- `getUserPosts(userId)` - Get user's posts
- `createPost(postData)` - Create a post
- `updatePost(postId, updates)` - Update a post
- `deletePost(postId)` - Delete a post
- `incrementPostViewCount(postId)` - Track post views

**Comments:**
- `getComments(contentType, contentId, parentCommentId?)` - Get comments
- `createComment(commentData)` - Create a comment
- `updateComment(commentId, content)` - Update a comment
- `deleteComment(commentId)` - Delete a comment

**Reactions:**
- `getUserReaction(userId, contentType, contentId)` - Get user's reaction
- `toggleReaction(userId, contentType, contentId, reactionType)` - Toggle reaction

### Export/Import API (`convex/exportImport.ts`)

**Character Export/Import:**
- `exportCharacter(characterId)` - Export character with inventory
- `importCharacter(userId, campaignId, exportData)` - Import character

**Campaign Export/Import:**
- `exportCampaign(campaignId)` - Export campaign with sessions and maps
- `importCampaign(dmId, exportData, importSessions?, importMaps?)` - Import campaign

**Helpers:**
- `generateShareableLink(contentType, contentId)` - Generate share link
- `validateImportData(exportData)` - Validate import data

### Notifications API (`convex/notifications.ts`)

**Queries:**
- `getUserNotifications(userId, unreadOnly?, limit?)` - Get notifications
- `getUnreadCount(userId)` - Get unread count

**Mutations:**
- `markAsRead(notificationId)` - Mark notification as read
- `markAllAsRead(userId)` - Mark all as read
- `deleteNotification(notificationId)` - Delete notification
- `clearOldNotifications(userId)` - Clear notifications older than 30 days
- `createNotification(notificationData)` - Create custom notification

### Discord API (`convex/discord.ts`)

**Queries:**
- `getUserWebhooks(userId)` - Get user's webhooks
- `getCampaignWebhooks(campaignId)` - Get campaign webhooks
- `getWebhook(webhookId)` - Get specific webhook

**Mutations:**
- `createWebhook(webhookData)` - Create Discord webhook
- `updateWebhook(webhookId, updates)` - Update webhook
- `deleteWebhook(webhookId)` - Delete webhook
- `toggleWebhook(webhookId)` - Toggle active status
- `testWebhook(webhookId)` - Send test notification
- `triggerEventNotification(eventType, campaignId?, userId?, data)` - Trigger event

---

## Frontend Components

### Community Hub (`/community`)

**Location:** `src/app/(dashboard)/community/`

Main hub with three tabs:
1. **Discover** - Browse shared campaigns, characters, and maps
2. **Community Posts** - View and create discussion posts
3. **My Shared Content** - Manage your shared content

**Features:**
- Category cards with item counts
- Featured content carousel
- Post creation and browsing
- Filter and sort options

### User Profile (`/profile`)

**Location:** `src/app/(dashboard)/profile/`

**Features:**
- Profile display with avatar
- Editable profile information
- Follower/following counts
- Contact and social links
- Statistics dashboard
- Shared content listing

### Shared Components

#### `NotificationBell`
**Location:** `src/components/shared/NotificationBell.tsx`

Real-time notification dropdown with:
- Unread count badge
- Notification list with icons
- Time ago formatting
- Mark as read functionality
- Link to full notifications page

#### `SocialShareButtons`
**Location:** `src/components/shared/SocialShareButtons.tsx`

Share menu with options for:
- Twitter/X
- Facebook
- Reddit
- Discord (copy to clipboard)
- Copy link

**Usage:**
```tsx
import SocialShareButtons from '@/components/shared/SocialShareButtons';

<SocialShareButtons
  data={{
    title: "My Awesome Campaign",
    description: "Check out this epic adventure!",
    url: "https://example.com/campaign/123",
    hashtags: ["dnd", "campaign"],
    imageUrl: "https://example.com/thumbnail.jpg"
  }}
/>
```

---

## Social Sharing

### Utilities (`src/lib/social-sharing.ts`)

**Platform-Specific Functions:**
- `shareToTwitter(data)` - Generate Twitter share URL
- `shareToFacebook(data)` - Generate Facebook share URL
- `shareToReddit(data)` - Generate Reddit submit URL
- `generateDiscordMessage(data)` - Format Discord message

**Helper Functions:**
- `canUseWebShare()` - Check Web Share API availability
- `shareNative(data)` - Use native Web Share API
- `copyToClipboard(data)` - Copy formatted text to clipboard
- `generateShareableUrl(contentType, contentId, baseUrl?)` - Generate share URL
- `openShareDialog(url, title, width?, height?)` - Open share window
- `shareToPlatform(platform, data)` - Share to specific platform
- `generateOGMetaTags(data)` - Generate Open Graph meta tags

**ShareData Interface:**
```typescript
interface ShareData {
  title: string;
  description?: string;
  url: string;
  hashtags?: string[];
  imageUrl?: string;
}
```

---

## Discord Integration

### Webhook Configuration

1. Create webhook in Discord server settings
2. Copy webhook URL
3. Add webhook in app settings
4. Configure event triggers
5. Test webhook

### Event Types

- `session_start` - Notify when session begins
- `session_end` - Notify when session ends
- `character_update` - Notify on character changes
- `new_post` - Notify on new community posts
- `combat_start` - Notify when combat begins

### Discord Embed Format

```typescript
{
  title: "Event Title",
  description: "Event description",
  color: 0x10b981,  // Hex color
  fields: [
    { name: "Field Name", value: "Field Value", inline: true }
  ],
  timestamp: "2024-01-01T00:00:00.000Z",
  footer: {
    text: "D&D Shadowkeep Campaign Manager"
  }
}
```

---

## Usage Examples

### Example 1: Share a Campaign

```typescript
// Export campaign
const exportData = await exportCampaign(campaignId);

// Share to community
const sharedCampaignId = await shareCampaign({
  authorId: userId,
  name: "Dragon's Lair Adventure",
  description: "Epic level 5-10 campaign",
  content: JSON.stringify(exportData),
  tags: ["dragons", "dungeon", "magic"],
  category: "homebrew",
  difficulty: "intermediate"
});

// Share on social media
shareToPlatform('twitter', {
  title: "Dragon's Lair Adventure",
  description: "Check out my new D&D campaign!",
  url: generateShareableUrl('campaign', sharedCampaignId),
  hashtags: ["dnd", "campaign"]
});
```

### Example 2: Import a Character

```typescript
// Export character from source
const exportData = await exportCharacter(sourceCharacterId);
const exportJson = JSON.stringify(exportData);

// Import to new campaign
const result = await importCharacter(
  newUserId,
  newCampaignId,
  exportJson
);

console.log(`Character imported with ID: ${result.characterId}`);
```

### Example 3: Set Up Discord Notifications

```typescript
// Create webhook
const webhookId = await createWebhook({
  userId: userId,
  campaignId: campaignId,
  webhookUrl: "https://discord.com/api/webhooks/...",
  webhookName: "Campaign Notifications",
  events: ['session_start', 'combat_start']
});

// Test webhook
await testWebhook(webhookId);

// Trigger event
await triggerEventNotification(
  'session_start',
  campaignId,
  userId,
  {
    sessionName: "Session 5: The Dragon's Lair",
    campaignName: "Epic Campaign",
    dmName: "DM Dave"
  }
);
```

### Example 4: Create and Comment on Post

```typescript
// Create post
const postId = await createPost({
  authorId: userId,
  title: "Amazing session last night!",
  content: "Our party defeated the ancient dragon...",
  type: "showcase",
  tags: ["combat", "dragons"],
  imageUrls: ["https://example.com/photo.jpg"]
});

// Add comment
await createComment({
  authorId: commentUserId,
  contentType: "post",
  contentId: postId,
  content: "That sounds epic! How did you handle the dragon's breath?"
});

// Toggle reaction
await toggleReaction(
  reactUserId,
  "post",
  postId,
  "love"
);
```

### Example 5: Review Shared Content

```typescript
// Create review
await createReview({
  authorId: userId,
  contentType: "campaign",
  contentId: sharedCampaignId,
  rating: 5,
  title: "Best campaign I've played!",
  comment: "The encounters are balanced and the story is engaging..."
});

// Get review statistics
const stats = await getReviewStats("campaign", sharedCampaignId);
console.log(`Average rating: ${stats.averageRating} (${stats.totalReviews} reviews)`);
```

---

## Next Steps

### Recommended Enhancements

1. **Real-time Features**
   - WebSocket integration for live updates
   - Real-time notification delivery
   - Live comment threads

2. **Advanced Search**
   - Full-text search across content
   - Advanced filters (level range, tags, ratings)
   - Saved searches

3. **Moderation Tools**
   - Content reporting system
   - Admin moderation panel
   - Automated content filtering

4. **Analytics**
   - User engagement metrics
   - Popular content tracking
   - Community growth analytics

5. **Enhanced Collaboration**
   - Co-authoring campaigns
   - Campaign forking
   - Version history

6. **Gamification**
   - Achievement badges
   - Reputation system
   - Leaderboards

---

## Support and Contributing

For questions or issues with community features, please:
1. Check this documentation
2. Review API examples
3. Check existing GitHub issues
4. Create a new issue with detailed information

## License

Part of D&D Shadowkeep Campaign Manager - See main LICENSE file.
