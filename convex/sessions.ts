import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const encounterValidator = v.object({
  id: v.string(),
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
});

/**
 * Get all sessions for a campaign
 */
export const byCampaign = query({
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
    return sessions.find((s) => s.active === true) || null;
  },
});

/**
 * Get a single session by ID
 */
export const get = query({
  args: { id: v.id('sessions') },
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
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert('sessions', {
      campaignId: args.campaignId,
      name: args.name,
      date: Date.now(),
      notes: args.notes,
      active: false,
      encounters: [],
    });
    return sessionId;
  },
});

/**
 * Update a session
 */
export const update = mutation({
  args: {
    id: v.id('sessions'),
    name: v.optional(v.string()),
    notes: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

/**
 * Set session as active (deactivates other sessions in campaign)
 */
export const setActive = mutation({
  args: {
    id: v.id('sessions'),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.id);
    if (!session) throw new Error('Session not found');

    // Deactivate all other sessions in the campaign
    const allSessions = await ctx.db
      .query('sessions')
      .withIndex('by_campaign', (q) => q.eq('campaignId', session.campaignId))
      .collect();

    for (const s of allSessions) {
      if (s._id !== args.id && s.active) {
        await ctx.db.patch(s._id, { active: false });
      }
    }

    // Activate this session
    await ctx.db.patch(args.id, { active: true });
    return args.id;
  },
});

/**
 * Add an encounter to a session
 */
export const addEncounter = mutation({
  args: {
    sessionId: v.id('sessions'),
    encounter: encounterValidator,
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error('Session not found');

    const encounters = session.encounters || [];
    await ctx.db.patch(args.sessionId, {
      encounters: [...encounters, args.encounter],
    });
    return args.sessionId;
  },
});

/**
 * Update an encounter in a session
 */
export const updateEncounter = mutation({
  args: {
    sessionId: v.id('sessions'),
    encounterId: v.string(),
    encounter: encounterValidator,
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error('Session not found');

    const encounters = session.encounters || [];
    const updatedEncounters = encounters.map((e) =>
      e.id === args.encounterId ? args.encounter : e
    );

    await ctx.db.patch(args.sessionId, {
      encounters: updatedEncounters,
    });
    return args.sessionId;
  },
});

/**
 * Remove an encounter from a session
 */
export const removeEncounter = mutation({
  args: {
    sessionId: v.id('sessions'),
    encounterId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error('Session not found');

    const encounters = session.encounters || [];
    await ctx.db.patch(args.sessionId, {
      encounters: encounters.filter((e) => e.id !== args.encounterId),
    });
    return args.sessionId;
  },
});

/**
 * Delete a session
 */
export const remove = mutation({
  args: { id: v.id('sessions') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
