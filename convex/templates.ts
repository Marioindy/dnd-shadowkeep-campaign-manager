import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Template type definitions for reuse
 */
const characterTemplateValidator = v.object({
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
  backstory: v.string(),
  portraitUrl: v.optional(v.string()),
});

const npcTemplateValidator = v.object({
  name: v.string(),
  role: v.string(),
  description: v.string(),
  stats: v.optional(
    v.object({
      hp: v.number(),
      maxHp: v.number(),
      ac: v.number(),
      initiativeBonus: v.number(),
    })
  ),
});

const mapTemplateValidator = v.object({
  name: v.string(),
  description: v.string(),
  imageUrl: v.optional(v.string()),
  markers: v.array(
    v.object({
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
    })
  ),
});

const encounterTemplateValidator = v.object({
  name: v.string(),
  description: v.string(),
  enemies: v.array(
    v.object({
      name: v.string(),
      hp: v.number(),
      maxHp: v.number(),
      ac: v.number(),
      initiativeBonus: v.number(),
    })
  ),
});

const itemTemplateValidator = v.object({
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
  description: v.string(),
  properties: v.optional(v.any()),
});

/**
 * Get all public templates
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db
      .query('campaignTemplates')
      .withIndex('by_public', (q) => q.eq('isPublic', true))
      .order('desc')
      .collect();
    return templates;
  },
});

/**
 * Get all official templates (curated by platform)
 */
export const listOfficial = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db
      .query('campaignTemplates')
      .withIndex('by_official', (q) => q.eq('isOfficial', true))
      .order('desc')
      .collect();
    return templates;
  },
});

/**
 * Get templates by genre
 */
export const listByGenre = query({
  args: {
    genre: v.union(
      v.literal('fantasy'),
      v.literal('sci-fi'),
      v.literal('horror'),
      v.literal('modern'),
      v.literal('steampunk'),
      v.literal('cyberpunk'),
      v.literal('post-apocalyptic'),
      v.literal('custom')
    ),
  },
  handler: async (ctx, args) => {
    const templates = await ctx.db
      .query('campaignTemplates')
      .withIndex('by_genre', (q) => q.eq('genre', args.genre))
      .filter((q) => q.eq(q.field('isPublic'), true))
      .order('desc')
      .collect();
    return templates;
  },
});

/**
 * Get a single template by ID
 */
export const get = query({
  args: { templateId: v.id('campaignTemplates') },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    return template;
  },
});

/**
 * Get templates created by a specific user
 */
export const listByAuthor = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const templates = await ctx.db
      .query('campaignTemplates')
      .withIndex('by_author', (q) => q.eq('authorId', args.userId))
      .order('desc')
      .collect();
    return templates;
  },
});

/**
 * Search templates by tags
 */
export const searchByTags = query({
  args: { tags: v.array(v.string()) },
  handler: async (ctx, args) => {
    const allTemplates = await ctx.db
      .query('campaignTemplates')
      .withIndex('by_public', (q) => q.eq('isPublic', true))
      .collect();

    // Filter templates that have at least one matching tag
    const matchingTemplates = allTemplates.filter((template) =>
      template.tags.some((tag) => args.tags.includes(tag))
    );

    return matchingTemplates;
  },
});

/**
 * Create a new campaign template
 */
export const createTemplate = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    genre: v.union(
      v.literal('fantasy'),
      v.literal('sci-fi'),
      v.literal('horror'),
      v.literal('modern'),
      v.literal('steampunk'),
      v.literal('cyberpunk'),
      v.literal('post-apocalyptic'),
      v.literal('custom')
    ),
    difficulty: v.union(
      v.literal('beginner'),
      v.literal('intermediate'),
      v.literal('advanced'),
      v.literal('expert')
    ),
    recommendedPlayers: v.object({
      min: v.number(),
      max: v.number(),
    }),
    imageUrl: v.optional(v.string()),
    lore: v.string(),
    characterTemplates: v.array(characterTemplateValidator),
    npcTemplates: v.array(npcTemplateValidator),
    mapTemplates: v.array(mapTemplateValidator),
    encounterTemplates: v.array(encounterTemplateValidator),
    starterItems: v.array(itemTemplateValidator),
    authorId: v.optional(v.id('users')),
    isOfficial: v.boolean(),
    isPublic: v.boolean(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const templateId = await ctx.db.insert('campaignTemplates', {
      name: args.name,
      description: args.description,
      genre: args.genre,
      difficulty: args.difficulty,
      recommendedPlayers: args.recommendedPlayers,
      imageUrl: args.imageUrl,
      lore: args.lore,
      characterTemplates: args.characterTemplates,
      npcTemplates: args.npcTemplates,
      mapTemplates: args.mapTemplates,
      encounterTemplates: args.encounterTemplates,
      starterItems: args.starterItems,
      authorId: args.authorId,
      isOfficial: args.isOfficial,
      isPublic: args.isPublic,
      downloads: 0,
      rating: 0,
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
    });
    return templateId;
  },
});

/**
 * Update an existing template
 */
export const updateTemplate = mutation({
  args: {
    templateId: v.id('campaignTemplates'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    genre: v.optional(
      v.union(
        v.literal('fantasy'),
        v.literal('sci-fi'),
        v.literal('horror'),
        v.literal('modern'),
        v.literal('steampunk'),
        v.literal('cyberpunk'),
        v.literal('post-apocalyptic'),
        v.literal('custom')
      )
    ),
    difficulty: v.optional(
      v.union(
        v.literal('beginner'),
        v.literal('intermediate'),
        v.literal('advanced'),
        v.literal('expert')
      )
    ),
    recommendedPlayers: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
      })
    ),
    imageUrl: v.optional(v.string()),
    lore: v.optional(v.string()),
    characterTemplates: v.optional(v.array(characterTemplateValidator)),
    npcTemplates: v.optional(v.array(npcTemplateValidator)),
    mapTemplates: v.optional(v.array(mapTemplateValidator)),
    encounterTemplates: v.optional(v.array(encounterTemplateValidator)),
    starterItems: v.optional(v.array(itemTemplateValidator)),
    isPublic: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { templateId, ...updates } = args;
    await ctx.db.patch(templateId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Delete a template
 */
export const deleteTemplate = mutation({
  args: { templateId: v.id('campaignTemplates') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.templateId);
  },
});

/**
 * Increment download count for a template
 */
export const incrementDownloads = mutation({
  args: { templateId: v.id('campaignTemplates') },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    await ctx.db.patch(args.templateId, {
      downloads: template.downloads + 1,
    });
  },
});

/**
 * Rate a template (simplified - in production would track individual ratings)
 */
export const rateTemplate = mutation({
  args: {
    templateId: v.id('campaignTemplates'),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    // Simple average - in production, track individual ratings
    const newRating =
      template.downloads === 0
        ? args.rating
        : (template.rating * template.downloads + args.rating) /
          (template.downloads + 1);

    await ctx.db.patch(args.templateId, {
      rating: newRating,
    });
  },
});

/**
 * ONE-CLICK CAMPAIGN CREATION FROM TEMPLATE
 * This is the core feature that creates a complete campaign with all template data
 */
export const createCampaignFromTemplate = mutation({
  args: {
    templateId: v.id('campaignTemplates'),
    dmId: v.id('users'),
    campaignName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the template
    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const now = Date.now();

    // 1. Create the campaign
    const campaignId = await ctx.db.insert('campaigns', {
      name: args.campaignName || template.name,
      description: `${template.description}\n\n${template.lore}`,
      dmId: args.dmId,
      players: [],
      createdAt: now,
      updatedAt: now,
    });

    // 2. Create maps from template
    const mapIds: { templateIndex: number; mapId: any }[] = [];
    for (let i = 0; i < template.mapTemplates.length; i++) {
      const mapTemplate = template.mapTemplates[i];
      const mapId = await ctx.db.insert('maps', {
        campaignId,
        name: mapTemplate.name,
        imageUrl: mapTemplate.imageUrl || '',
        createdAt: now,
        updatedAt: now,
      });
      mapIds.push({ templateIndex: i, mapId });

      // Create markers for this map
      for (const marker of mapTemplate.markers) {
        await ctx.db.insert('mapMarkers', {
          mapId,
          type: marker.type,
          x: marker.x,
          y: marker.y,
          label: marker.label,
          color: marker.color,
          visible: true,
        });
      }
    }

    // 3. Create a starter session with encounter templates
    if (template.encounterTemplates.length > 0) {
      const sessionId = await ctx.db.insert('sessions', {
        campaignId,
        name: 'First Session',
        date: now,
        notes: 'Created from template. Ready to begin your adventure!',
        active: true,
      });

      // Create encounters from templates
      for (const encounterTemplate of template.encounterTemplates) {
        await ctx.db.insert('encounters', {
          sessionId,
          name: encounterTemplate.name,
          enemies: encounterTemplate.enemies.map((enemy, idx) => ({
            id: `enemy-${idx}`,
            name: enemy.name,
            hp: enemy.hp,
            maxHp: enemy.maxHp,
            ac: enemy.ac,
            initiativeBonus: enemy.initiativeBonus,
          })),
          initiative: [],
        });
      }

      // Update campaign with current session
      await ctx.db.patch(campaignId, {
        currentSession: sessionId,
      });
    }

    // 4. Increment template downloads
    await ctx.db.patch(args.templateId, {
      downloads: template.downloads + 1,
    });

    // Return campaign info with template metadata
    return {
      campaignId,
      templateName: template.name,
      characterTemplates: template.characterTemplates,
      npcTemplates: template.npcTemplates,
      starterItems: template.starterItems,
      mapCount: template.mapTemplates.length,
      encounterCount: template.encounterTemplates.length,
    };
  },
});

/**
 * Helper: Add template characters to campaign when players join
 * Players can use this to quickly create characters from the campaign template
 */
export const createCharacterFromTemplate = mutation({
  args: {
    campaignId: v.id('campaigns'),
    userId: v.id('users'),
    templateCharacterIndex: v.number(),
  },
  handler: async (ctx, args) => {
    // Get campaign to find its template
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Note: In a full implementation, we'd store the template ID with the campaign
    // For now, this is a helper that would be called with template data from frontend

    throw new Error(
      'This function requires template data to be passed. Use the frontend to manage character creation from templates.'
    );
  },
});
