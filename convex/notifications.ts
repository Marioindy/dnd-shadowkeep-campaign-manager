import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// ============== NOTIFICATION QUERIES ==============

// Get user's notifications
export const getUserNotifications = query({
  args: {
    userId: v.id('users'),
    unreadOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    let query = ctx.db
      .query('notifications')
      .withIndex('by_user', (q) => q.eq('userId', args.userId));

    let notifications = await query.collect();

    if (args.unreadOnly) {
      notifications = notifications.filter((n) => !n.isRead);
    }

    // Sort by most recent first
    notifications.sort((a, b) => b.createdAt - a.createdAt);

    // Enrich with actor info
    const enriched = await Promise.all(
      notifications.slice(0, limit).map(async (notification) => {
        let actor = null;
        if (notification.actorId) {
          actor = await ctx.db.get(notification.actorId);
        }

        return {
          ...notification,
          actor: actor
            ? {
                username: actor.username,
                displayName: actor.displayName,
                avatarUrl: actor.avatarUrl,
              }
            : null,
        };
      })
    );

    return enriched;
  },
});

// Get unread notification count
export const getUnreadCount = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isRead'), false))
      .collect();

    return notifications.length;
  },
});

// ============== NOTIFICATION MUTATIONS ==============

// Mark notification as read
export const markAsRead = mutation({
  args: { notificationId: v.id('notifications') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });

    return { success: true };
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isRead'), false))
      .collect();

    await Promise.all(
      notifications.map((n) =>
        ctx.db.patch(n._id, {
          isRead: true,
        })
      )
    );

    return { success: true, count: notifications.length };
  },
});

// Delete notification
export const deleteNotification = mutation({
  args: { notificationId: v.id('notifications') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
    return { success: true };
  },
});

// Clear old notifications (older than 30 days)
export const clearOldNotifications = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.lt(q.field('createdAt'), thirtyDaysAgo))
      .collect();

    await Promise.all(notifications.map((n) => ctx.db.delete(n._id)));

    return { success: true, count: notifications.length };
  },
});

// ============== NOTIFICATION CREATION HELPERS ==============

// Create custom notification
export const createNotification = mutation({
  args: {
    userId: v.id('users'),
    type: v.union(
      v.literal('follow'),
      v.literal('like'),
      v.literal('comment'),
      v.literal('review'),
      v.literal('mention'),
      v.literal('campaign_invite')
    ),
    actorId: v.optional(v.id('users')),
    contentType: v.optional(v.string()),
    contentId: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert('notifications', {
      ...args,
      isRead: false,
      createdAt: Date.now(),
    });

    return notificationId;
  },
});
