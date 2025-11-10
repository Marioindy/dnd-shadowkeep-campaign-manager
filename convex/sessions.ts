import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * List all sessions for a campaign
 */
export const listByCampaign = query({
  args: {
    campaignId: v.id('campaigns'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .order('desc')
      .collect();
  },
});

/**
 * Get active session for a campaign
 */
export const getActive = query({
  args: {
    campaignId: v.id('campaigns'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .filter((q) => q.eq(q.field('active'), true))
      .first();
  },
});

/**
 * Get a single session
 */
export const get = query({
  args: {
    id: v.id('sessions'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Create a new session
 */
export const create = mutation({
  args: {
    campaignId: v.id('campaigns'),
    name: v.string(),
    date: v.number(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('sessions', {
      ...args,
      active: false,
    });
  },
});

/**
 * Start a session (set as active)
 */
export const start = mutation({
  args: {
    id: v.id('sessions'),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.id);
    if (!session) {
      throw new Error('Session not found');
    }

    // Deactivate all other sessions for this campaign
    const allSessions = await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', session.campaignId))
      .collect();

    for (const s of allSessions) {
      if (s.active) {
        await ctx.db.patch(s._id, { active: false });
      }
    }

    // Activate this session
    await ctx.db.patch(args.id, { active: true });

    // Update campaign's currentSession
    await ctx.db.patch(session.campaignId, {
      currentSession: args.id,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * End a session (deactivate)
 */
export const end = mutation({
  args: {
    id: v.id('sessions'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { active: false });
    return args.id;
  },
});

/**
 * Update session notes
 */
export const updateNotes = mutation({
  args: {
    id: v.id('sessions'),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      notes: args.notes,
    });
    return args.id;
  },
});

/**
 * Update a session
 */
export const update = mutation({
  args: {
    id: v.id('sessions'),
    name: v.optional(v.string()),
    date: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

/**
 * Delete a session
 */
export const remove = mutation({
  args: {
    id: v.id('sessions'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
