import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Get all sessions for a campaign
 */
export const getByCampaign = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .collect();
  },
});

/**
 * Get active session for a campaign
 */
export const getActive = query({
  args: { campaignId: v.id('campaigns') },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', args.campaignId))
      .collect();

    return sessions.find((s) => s.active) || null;
  },
});

/**
 * Get a session by ID
 */
export const get = query({
  args: { sessionId: v.id('sessions') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

/**
 * Create a new session
 */
export const create = mutation({
  args: {
    campaignId: v.id('campaigns'),
    name: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert('sessions', {
      campaignId: args.campaignId,
      name: args.name,
      date: Date.now(),
      notes: args.notes,
      active: false,
    });
    return sessionId;
  },
});

/**
 * Start a session (make it active)
 */
export const start = mutation({
  args: { sessionId: v.id('sessions') },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error('Session not found');

    // Deactivate all other sessions in the campaign
    const allSessions = await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', session.campaignId))
      .collect();

    for (const s of allSessions) {
      if (s.active && s._id !== args.sessionId) {
        await ctx.db.patch(s._id, { active: false });
      }
    }

    // Activate this session
    await ctx.db.patch(args.sessionId, { active: true });
    return args.sessionId;
  },
});

/**
 * End a session
 */
export const end = mutation({
  args: { sessionId: v.id('sessions') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { active: false });
    return args.sessionId;
  },
});

/**
 * Update session notes
 */
export const updateNotes = mutation({
  args: {
    sessionId: v.id('sessions'),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      notes: args.notes,
    });
    return args.sessionId;
  },
});

/**
 * Update session name
 */
export const updateName = mutation({
  args: {
    sessionId: v.id('sessions'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      name: args.name,
    });
    return args.sessionId;
  },
});

/**
 * Delete a session
 */
export const remove = mutation({
  args: { sessionId: v.id('sessions') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sessionId);
    return args.sessionId;
  },
});
