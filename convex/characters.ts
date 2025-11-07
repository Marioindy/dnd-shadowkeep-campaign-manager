import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const statsValidator = v.object({
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
});

/**
 * Get all characters
 */
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('characters').collect();
  },
});

/**
 * Get a character by ID
 */
export const get = query({
  args: { characterId: v.id('characters') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.characterId);
  },
});

/**
 * Get characters by user
 */
export const getByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('characters')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

/**
 * Get characters by campaign
 */
export const getByCampaign = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('characters')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .collect();
  },
});

/**
 * Create a new character
 */
export const create = mutation({
  args: {
    userId: v.id('users'),
    campaignId: v.id('campaigns'),
    name: v.string(),
    race: v.string(),
    class: v.string(),
    level: v.number(),
    stats: statsValidator,
    portraitUrl: v.optional(v.string()),
    backstory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const characterId = await ctx.db.insert('characters', {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return characterId;
  },
});

/**
 * Update character stats
 */
export const updateStats = mutation({
  args: {
    characterId: v.id('characters'),
    stats: statsValidator,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.characterId, {
      stats: args.stats,
      updatedAt: Date.now(),
    });
    return args.characterId;
  },
});

/**
 * Update character details
 */
export const update = mutation({
  args: {
    characterId: v.id('characters'),
    name: v.optional(v.string()),
    race: v.optional(v.string()),
    class: v.optional(v.string()),
    level: v.optional(v.number()),
    portraitUrl: v.optional(v.string()),
    backstory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { characterId, ...updates } = args;
    await ctx.db.patch(characterId, {
      ...updates,
      updatedAt: Date.now(),
    });
    return characterId;
  },
});

/**
 * Level up a character
 */
export const levelUp = mutation({
  args: { characterId: v.id('characters') },
  handler: async (ctx, args) => {
    const character = await ctx.db.get(args.characterId);
    if (!character) throw new Error('Character not found');

    await ctx.db.patch(args.characterId, {
      level: character.level + 1,
      updatedAt: Date.now(),
    });
    return args.characterId;
  },
});

/**
 * Delete a character
 */
export const remove = mutation({
  args: { characterId: v.id('characters') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.characterId);
    return args.characterId;
  },
});
