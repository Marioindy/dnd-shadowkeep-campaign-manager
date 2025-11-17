// User Types
export interface User {
  _id: string;
  username: string;
  role: 'player' | 'dm' | 'admin';
  campaignId?: string;
  // Community profile fields
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  twitterHandle?: string;
  discordUsername?: string;
  isPublicProfile?: boolean;
  followersCount?: number;
  followingCount?: number;
  createdAt: number;
  updatedAt?: number;
}

// User following/follower relationship
export interface Follow {
  _id: string;
  followerId: string;
  followingId: string;
  createdAt: number;
}

// Character Types
export interface Character {
  _id: string;
  userId: string;
  campaignId: string;
  name: string;
  race: string;
  class: string;
  level: number;
  stats: CharacterStats;
  portraitUrl?: string;
  backstory?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  hp: number;
  maxHp: number;
  ac: number;
  speed: number;
}

// Inventory Types
export interface InventoryItem {
  _id: string;
  characterId: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'tool' | 'misc';
  quantity: number;
  weight: number;
  description?: string;
  properties?: Record<string, any>;
  equipped?: boolean;
  equipSlot?: string;
}

export interface Equipment {
  mainHand?: InventoryItem;
  offHand?: InventoryItem;
  head?: InventoryItem;
  chest?: InventoryItem;
  legs?: InventoryItem;
  feet?: InventoryItem;
  accessories?: InventoryItem[];
}

// Map Types
export interface Map {
  _id: string;
  campaignId: string;
  name: string;
  imageUrl: string;
  createdAt: number;
  updatedAt: number;
}

export interface MapMarker {
  _id: string;
  mapId: string;
  type: 'player' | 'npc' | 'enemy' | 'poi';
  x: number;
  y: number;
  label?: string;
  color?: string;
  iconUrl?: string;
  visible: boolean;
}

// Campaign Types
export interface Campaign {
  _id: string;
  name: string;
  description: string;
  dmId: string;
  players: string[];
  currentSession?: string;
  // Community sharing fields
  isShared?: boolean;
  visibility?: 'private' | 'friends' | 'public';
  tags?: string[];
  thumbnailUrl?: string;
  viewCount?: number;
  likeCount?: number;
  createdAt: number;
  updatedAt: number;
}

// Session Types
// Database type - matches Convex schema
export interface SessionDB {
  _id: string;
  campaignId: string;
  name: string;
  date: number;
  notes: string;
  active: boolean;
}

// Composed view type - includes encounters from separate table
export interface Session extends SessionDB {
  encounters: Encounter[];
}

// Database type - matches Convex schema
export interface EncounterDB {
  _id: string;
  sessionId: string;
  name: string;
  enemies: Enemy[];
  initiative: InitiativeEntry[];
}

// View type - same as DB but without sessionId (implied by parent session)
export interface Encounter {
  id: string;
  name: string;
  enemies: Enemy[];
  initiative: InitiativeEntry[];
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
  initiativeBonus: number;
}

export interface InitiativeEntry {
  id: string;
  name: string;
  initiative: number;
  type: 'player' | 'enemy' | 'npc';
}

// ============== COMMUNITY FEATURE TYPES ==============

// Shared campaign templates
export interface SharedCampaign {
  _id: string;
  originalCampaignId?: string;
  authorId: string;
  name: string;
  description: string;
  content: string; // JSON string of campaign data
  thumbnailUrl?: string;
  tags: string[];
  category: 'homebrew' | 'official' | 'oneshot' | 'longform' | 'other';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  viewCount: number;
  downloadCount: number;
  likeCount: number;
  averageRating?: number;
  ratingCount?: number;
  createdAt: number;
  updatedAt: number;
}

// Shared character builds
export interface SharedCharacter {
  _id: string;
  originalCharacterId?: string;
  authorId: string;
  name: string;
  race: string;
  class: string;
  level: number;
  description: string;
  buildStrategy?: string;
  content: string; // JSON string of character data
  portraitUrl?: string;
  tags: string[];
  viewCount: number;
  downloadCount: number;
  likeCount: number;
  averageRating?: number;
  ratingCount?: number;
  createdAt: number;
  updatedAt: number;
}

// Shared maps repository
export interface SharedMap {
  _id: string;
  originalMapId?: string;
  authorId: string;
  name: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  gridSize?: string;
  dimensions?: string;
  tags: string[];
  category: 'dungeon' | 'wilderness' | 'city' | 'building' | 'battlemap' | 'other';
  viewCount: number;
  downloadCount: number;
  likeCount: number;
  averageRating?: number;
  ratingCount?: number;
  createdAt: number;
  updatedAt: number;
}

// Reviews and ratings
export interface Review {
  _id: string;
  authorId: string;
  contentType: 'campaign' | 'character' | 'map';
  contentId: string;
  rating: number; // 1-5 stars
  title?: string;
  comment?: string;
  helpful?: number;
  createdAt: number;
  updatedAt: number;
}

// Community posts and discussions
export interface Post {
  _id: string;
  authorId: string;
  title: string;
  content: string;
  type: 'discussion' | 'showcase' | 'question' | 'story';
  tags: string[];
  campaignId?: string;
  characterId?: string;
  imageUrls?: string[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isPinned?: boolean;
  createdAt: number;
  updatedAt: number;
}

// Comments
export interface Comment {
  _id: string;
  authorId: string;
  contentType: 'post' | 'campaign' | 'character' | 'map';
  contentId: string;
  parentCommentId?: string;
  content: string;
  likeCount: number;
  createdAt: number;
  updatedAt: number;
}

// Reactions
export interface Reaction {
  _id: string;
  userId: string;
  contentType: 'post' | 'comment' | 'campaign' | 'character' | 'map';
  contentId: string;
  reactionType: 'like' | 'love' | 'laugh' | 'wow';
  createdAt: number;
}

// Notifications
export interface Notification {
  _id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'review' | 'mention' | 'campaign_invite';
  actorId?: string;
  contentType?: string;
  contentId?: string;
  message: string;
  isRead: boolean;
  createdAt: number;
}

// Discord webhook configuration
export interface DiscordWebhook {
  _id: string;
  userId: string;
  campaignId?: string;
  webhookUrl: string;
  webhookName: string;
  events: ('session_start' | 'session_end' | 'character_update' | 'new_post' | 'combat_start')[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// Social media share tracking
export interface SocialShare {
  _id: string;
  userId: string;
  contentType: 'campaign' | 'character' | 'map' | 'post';
  contentId: string;
  platform: 'twitter' | 'facebook' | 'reddit' | 'discord';
  shareUrl: string;
  createdAt: number;
}

// Export/Import data structures
export interface CharacterExport {
  character: Character;
  inventory: InventoryItem[];
  exportedAt: number;
  version: string;
}

export interface CampaignExport {
  campaign: Campaign;
  sessions: Session[];
  maps: Map[];
  exportedAt: number;
  version: string;
}
