import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    username: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal('player'), v.literal('dm'), v.literal('admin')),
    campaignId: v.optional(v.id('campaigns')),
    // Community profile fields
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
    discordUsername: v.optional(v.string()),
    isPublicProfile: v.optional(v.boolean()),
    followersCount: v.optional(v.number()),
    followingCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index('by_username', ['username']),

  // User following/follower relationships
  follows: defineTable({
    followerId: v.id('users'), // User who is following
    followingId: v.id('users'), // User being followed
    createdAt: v.number(),
  })
    .index('by_follower', ['followerId'])
    .index('by_following', ['followingId']),

  campaigns: defineTable({
    name: v.string(),
    description: v.string(),
    dmId: v.id('users'),
    players: v.array(v.id('users')),
    currentSession: v.optional(v.id('sessions')),
    // Community sharing fields
    isShared: v.optional(v.boolean()),
    visibility: v.optional(
      v.union(v.literal('private'), v.literal('friends'), v.literal('public'))
    ),
    tags: v.optional(v.array(v.string())),
    thumbnailUrl: v.optional(v.string()),
    viewCount: v.optional(v.number()),
    likeCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_dm', ['dmId'])
    .index('by_visibility', ['visibility'])
    .index('by_shared', ['isShared']),

  characters: defineTable({
    userId: v.id('users'),
    campaignId: v.id('campaigns'),
    name: v.string(),
    race: v.string(),
    class: v.string(),
    level: v.number(),
    stats: v.object({
      strength: v.number(),
      dexterity: v.number(),
      constitution: v.number(),
      intelligence: v.number(),
      wisdom: v.number(),
      charisma: v.number(),
      hp: v.number(),
      maxHp: v.number(),
      ac: v.number(),
      speed: v.number(),
    }),
    portraitUrl: v.optional(v.string()),
    backstory: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_campaign', ['campaignId']),

  inventory: defineTable({
    characterId: v.id('characters'),
    name: v.string(),
    type: v.union(
      v.literal('weapon'),
      v.literal('armor'),
      v.literal('potion'),
      v.literal('tool'),
      v.literal('misc')
    ),
    quantity: v.number(),
    weight: v.number(),
    description: v.optional(v.string()),
    properties: v.optional(v.any()),
    equipped: v.optional(v.boolean()),
    equipSlot: v.optional(v.string()),
  }).index('by_character', ['characterId']),

  maps: defineTable({
    campaignId: v.id('campaigns'),
    name: v.string(),
    imageUrl: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_campaign', ['campaignId']),

  mapMarkers: defineTable({
    mapId: v.id('maps'),
    type: v.union(
      v.literal('player'),
      v.literal('npc'),
      v.literal('enemy'),
      v.literal('poi')
    ),
    x: v.number(),
    y: v.number(),
    label: v.optional(v.string()),
    color: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    visible: v.boolean(),
  }).index('by_map', ['mapId']),

  sessions: defineTable({
    campaignId: v.id('campaigns'),
    name: v.string(),
    date: v.number(),
    notes: v.string(),
    active: v.boolean(),
  }).index('by_campaign', ['campaignId']),

  encounters: defineTable({
    sessionId: v.id('sessions'),
    name: v.string(),
    enemies: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        hp: v.number(),
        maxHp: v.number(),
        ac: v.number(),
        initiativeBonus: v.number(),
      })
    ),
    initiative: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        initiative: v.number(),
        type: v.union(v.literal('player'), v.literal('enemy'), v.literal('npc')),
      })
    ),
  }).index('by_session', ['sessionId']),

  // ============== COMMUNITY FEATURES ==============

  // Shared campaign templates
  sharedCampaigns: defineTable({
    originalCampaignId: v.optional(v.id('campaigns')),
    authorId: v.id('users'),
    name: v.string(),
    description: v.string(),
    content: v.string(), // JSON string of campaign data
    thumbnailUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    category: v.union(
      v.literal('homebrew'),
      v.literal('official'),
      v.literal('oneshot'),
      v.literal('longform'),
      v.literal('other')
    ),
    difficulty: v.optional(
      v.union(v.literal('beginner'), v.literal('intermediate'), v.literal('advanced'))
    ),
    viewCount: v.number(),
    downloadCount: v.number(),
    likeCount: v.number(),
    averageRating: v.optional(v.number()),
    ratingCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_author', ['authorId'])
    .index('by_category', ['category'])
    .index('by_created', ['createdAt']),

  // Shared character builds
  sharedCharacters: defineTable({
    originalCharacterId: v.optional(v.id('characters')),
    authorId: v.id('users'),
    name: v.string(),
    race: v.string(),
    class: v.string(),
    level: v.number(),
    description: v.string(),
    buildStrategy: v.optional(v.string()),
    content: v.string(), // JSON string of character data
    portraitUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    viewCount: v.number(),
    downloadCount: v.number(),
    likeCount: v.number(),
    averageRating: v.optional(v.number()),
    ratingCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_author', ['authorId'])
    .index('by_class', ['class'])
    .index('by_created', ['createdAt']),

  // Shared maps repository
  sharedMaps: defineTable({
    originalMapId: v.optional(v.id('maps')),
    authorId: v.id('users'),
    name: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    gridSize: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    tags: v.array(v.string()),
    category: v.union(
      v.literal('dungeon'),
      v.literal('wilderness'),
      v.literal('city'),
      v.literal('building'),
      v.literal('battlemap'),
      v.literal('other')
    ),
    viewCount: v.number(),
    downloadCount: v.number(),
    likeCount: v.number(),
    averageRating: v.optional(v.number()),
    ratingCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_author', ['authorId'])
    .index('by_category', ['category'])
    .index('by_created', ['createdAt']),

  // Reviews and ratings
  reviews: defineTable({
    authorId: v.id('users'),
    contentType: v.union(
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(), // ID of the shared content
    rating: v.number(), // 1-5 stars
    title: v.optional(v.string()),
    comment: v.optional(v.string()),
    helpful: v.optional(v.number()), // Helpful count
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_content', ['contentType', 'contentId'])
    .index('by_author', ['authorId'])
    .index('by_rating', ['rating']),

  // Community posts and discussions
  posts: defineTable({
    authorId: v.id('users'),
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal('discussion'),
      v.literal('showcase'),
      v.literal('question'),
      v.literal('story')
    ),
    tags: v.array(v.string()),
    campaignId: v.optional(v.id('campaigns')),
    characterId: v.optional(v.id('characters')),
    imageUrls: v.optional(v.array(v.string())),
    likeCount: v.number(),
    commentCount: v.number(),
    viewCount: v.number(),
    isPinned: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_author', ['authorId'])
    .index('by_type', ['type'])
    .index('by_created', ['createdAt']),

  // Comments on posts and shared content
  comments: defineTable({
    authorId: v.id('users'),
    contentType: v.union(
      v.literal('post'),
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(), // ID of the content being commented on
    parentCommentId: v.optional(v.id('comments')), // For nested comments
    content: v.string(),
    likeCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_content', ['contentType', 'contentId'])
    .index('by_author', ['authorId'])
    .index('by_parent', ['parentCommentId']),

  // Likes/reactions
  reactions: defineTable({
    userId: v.id('users'),
    contentType: v.union(
      v.literal('post'),
      v.literal('comment'),
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(),
    reactionType: v.union(
      v.literal('like'),
      v.literal('love'),
      v.literal('laugh'),
      v.literal('wow')
    ),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_content', ['contentType', 'contentId'])
    .index('by_user_and_content', ['userId', 'contentType', 'contentId']),

  // User notifications
  notifications: defineTable({
    userId: v.id('users'),
    type: v.union(
      v.literal('follow'),
      v.literal('like'),
      v.literal('comment'),
      v.literal('review'),
      v.literal('mention'),
      v.literal('campaign_invite')
    ),
    actorId: v.optional(v.id('users')), // User who triggered the notification
    contentType: v.optional(v.string()),
    contentId: v.optional(v.string()),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_unread', ['userId', 'isRead'])
    .index('by_created', ['createdAt']),

  // Discord webhook configurations
  discordWebhooks: defineTable({
    userId: v.id('users'),
    campaignId: v.optional(v.id('campaigns')),
    webhookUrl: v.string(),
    webhookName: v.string(),
    events: v.array(
      v.union(
        v.literal('session_start'),
        v.literal('session_end'),
        v.literal('character_update'),
        v.literal('new_post'),
        v.literal('combat_start')
      )
    ),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_campaign', ['campaignId']),

  // Social media share tracking
  socialShares: defineTable({
    userId: v.id('users'),
    contentType: v.union(
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map'),
      v.literal('post')
    ),
    contentId: v.string(),
    platform: v.union(
      v.literal('twitter'),
      v.literal('facebook'),
      v.literal('reddit'),
      v.literal('discord')
    ),
    shareUrl: v.string(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_content', ['contentType', 'contentId']),
});
