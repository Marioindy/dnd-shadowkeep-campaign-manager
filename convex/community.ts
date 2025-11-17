import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// ============== SHARED CAMPAIGNS ==============

// Browse shared campaigns
export const browseSharedCampaigns = query({
  args: {
    category: v.optional(
      v.union(
        v.literal('homebrew'),
        v.literal('official'),
        v.literal('oneshot'),
        v.literal('longform'),
        v.literal('other')
      )
    ),
    sortBy: v.optional(
      v.union(v.literal('recent'), v.literal('popular'), v.literal('rating'))
    ),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const offset = args.offset || 0;

    let query = ctx.db.query('sharedCampaigns');

    if (args.category) {
      query = query.withIndex('by_category', (q) => q.eq('category', args.category));
    }

    let campaigns = await query.collect();

    // Sort
    if (args.sortBy === 'popular') {
      campaigns.sort((a, b) => b.viewCount - a.viewCount);
    } else if (args.sortBy === 'rating') {
      campaigns.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else {
      campaigns.sort((a, b) => b.createdAt - a.createdAt);
    }

    return campaigns.slice(offset, offset + limit);
  },
});

// Get shared campaign by ID
export const getSharedCampaign = query({
  args: { campaignId: v.id('sharedCampaigns') },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    return campaign;
  },
});

// Get user's shared campaigns
export const getUserSharedCampaigns = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('sharedCampaigns')
      .withIndex('by_author', (q) => q.eq('authorId', args.userId))
      .collect();
  },
});

// Share a campaign to community
export const shareCampaign = mutation({
  args: {
    originalCampaignId: v.optional(v.id('campaigns')),
    authorId: v.id('users'),
    name: v.string(),
    description: v.string(),
    content: v.string(),
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
  },
  handler: async (ctx, args) => {
    const campaignId = await ctx.db.insert('sharedCampaigns', {
      ...args,
      viewCount: 0,
      downloadCount: 0,
      likeCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return campaignId;
  },
});

// ============== SHARED CHARACTERS ==============

// Browse shared characters
export const browseSharedCharacters = query({
  args: {
    class: v.optional(v.string()),
    sortBy: v.optional(
      v.union(v.literal('recent'), v.literal('popular'), v.literal('rating'))
    ),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const offset = args.offset || 0;

    let query = ctx.db.query('sharedCharacters');

    if (args.class) {
      query = query.withIndex('by_class', (q) => q.eq('class', args.class));
    }

    let characters = await query.collect();

    // Sort
    if (args.sortBy === 'popular') {
      characters.sort((a, b) => b.viewCount - a.viewCount);
    } else if (args.sortBy === 'rating') {
      characters.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else {
      characters.sort((a, b) => b.createdAt - a.createdAt);
    }

    return characters.slice(offset, offset + limit);
  },
});

// Get shared character by ID
export const getSharedCharacter = query({
  args: { characterId: v.id('sharedCharacters') },
  handler: async (ctx, args) => {
    const character = await ctx.db.get(args.characterId);
    if (!character) {
      throw new Error('Character not found');
    }
    return character;
  },
});

// Share a character to community
export const shareCharacter = mutation({
  args: {
    originalCharacterId: v.optional(v.id('characters')),
    authorId: v.id('users'),
    name: v.string(),
    race: v.string(),
    class: v.string(),
    level: v.number(),
    description: v.string(),
    buildStrategy: v.optional(v.string()),
    content: v.string(),
    portraitUrl: v.optional(v.string()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const characterId = await ctx.db.insert('sharedCharacters', {
      ...args,
      viewCount: 0,
      downloadCount: 0,
      likeCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return characterId;
  },
});

// ============== SHARED MAPS ==============

// Browse shared maps
export const browseSharedMaps = query({
  args: {
    category: v.optional(
      v.union(
        v.literal('dungeon'),
        v.literal('wilderness'),
        v.literal('city'),
        v.literal('building'),
        v.literal('battlemap'),
        v.literal('other')
      )
    ),
    sortBy: v.optional(
      v.union(v.literal('recent'), v.literal('popular'), v.literal('rating'))
    ),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const offset = args.offset || 0;

    let query = ctx.db.query('sharedMaps');

    if (args.category) {
      query = query.withIndex('by_category', (q) => q.eq('category', args.category));
    }

    let maps = await query.collect();

    // Sort
    if (args.sortBy === 'popular') {
      maps.sort((a, b) => b.viewCount - a.viewCount);
    } else if (args.sortBy === 'rating') {
      maps.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else {
      maps.sort((a, b) => b.createdAt - a.createdAt);
    }

    return maps.slice(offset, offset + limit);
  },
});

// Get shared map by ID
export const getSharedMap = query({
  args: { mapId: v.id('sharedMaps') },
  handler: async (ctx, args) => {
    const map = await ctx.db.get(args.mapId);
    if (!map) {
      throw new Error('Map not found');
    }
    return map;
  },
});

// Share a map to community
export const shareMap = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const mapId = await ctx.db.insert('sharedMaps', {
      ...args,
      viewCount: 0,
      downloadCount: 0,
      likeCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return mapId;
  },
});

// ============== VIEW/DOWNLOAD TRACKING ==============

// Increment view count
export const incrementViewCount = mutation({
  args: {
    contentType: v.union(
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(),
  },
  handler: async (ctx, args) => {
    let table: 'sharedCampaigns' | 'sharedCharacters' | 'sharedMaps';

    if (args.contentType === 'campaign') {
      table = 'sharedCampaigns';
    } else if (args.contentType === 'character') {
      table = 'sharedCharacters';
    } else {
      table = 'sharedMaps';
    }

    const content = await ctx.db.get(args.contentId as any);
    if (content) {
      await ctx.db.patch(args.contentId as any, {
        viewCount: (content.viewCount || 0) + 1,
      });
    }
  },
});

// Increment download count
export const incrementDownloadCount = mutation({
  args: {
    contentType: v.union(
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(),
  },
  handler: async (ctx, args) => {
    const content = await ctx.db.get(args.contentId as any);
    if (content) {
      await ctx.db.patch(args.contentId as any, {
        downloadCount: (content.downloadCount || 0) + 1,
      });
    }
  },
});

// Search shared content
export const searchSharedContent = query({
  args: {
    searchTerm: v.string(),
    contentType: v.optional(
      v.union(v.literal('campaign'), v.literal('character'), v.literal('map'))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const searchLower = args.searchTerm.toLowerCase();

    const results: any[] = [];

    if (!args.contentType || args.contentType === 'campaign') {
      const campaigns = await ctx.db.query('sharedCampaigns').collect();
      const filtered = campaigns.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
      results.push(
        ...filtered.map((c) => ({ ...c, _type: 'campaign' as const }))
      );
    }

    if (!args.contentType || args.contentType === 'character') {
      const characters = await ctx.db.query('sharedCharacters').collect();
      const filtered = characters.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.class.toLowerCase().includes(searchLower) ||
          c.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
      results.push(
        ...filtered.map((c) => ({ ...c, _type: 'character' as const }))
      );
    }

    if (!args.contentType || args.contentType === 'map') {
      const maps = await ctx.db.query('sharedMaps').collect();
      const filtered = maps.filter(
        (m) =>
          m.name.toLowerCase().includes(searchLower) ||
          m.description.toLowerCase().includes(searchLower) ||
          m.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
      results.push(...filtered.map((m) => ({ ...m, _type: 'map' as const })));
    }

    return results.slice(0, limit);
  },
});
