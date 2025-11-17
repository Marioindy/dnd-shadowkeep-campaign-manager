import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// ============== USER PROFILE QUERIES ==============

// Get user profile by ID
export const getProfile = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
});

// Get user profile by username
export const getProfileByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first();

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
});

// Get user's followers
export const getFollowers = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query('follows')
      .withIndex('by_following', (q) => q.eq('followingId', args.userId))
      .collect();

    const followers = await Promise.all(
      follows.map(async (follow) => {
        const user = await ctx.db.get(follow.followerId);
        return user;
      })
    );

    return followers.filter((u) => u !== null);
  },
});

// Get users being followed
export const getFollowing = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query('follows')
      .withIndex('by_follower', (q) => q.eq('followerId', args.userId))
      .collect();

    const following = await Promise.all(
      follows.map(async (follow) => {
        const user = await ctx.db.get(follow.followingId);
        return user;
      })
    );

    return following.filter((u) => u !== null);
  },
});

// Check if user is following another user
export const isFollowing = query({
  args: {
    followerId: v.id('users'),
    followingId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const follow = await ctx.db
      .query('follows')
      .withIndex('by_follower', (q) => q.eq('followerId', args.followerId))
      .filter((q) => q.eq(q.field('followingId'), args.followingId))
      .first();

    return follow !== null;
  },
});

// Search users by username or display name
export const searchUsers = query({
  args: {
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const searchLower = args.searchTerm.toLowerCase();

    const users = await ctx.db.query('users').collect();

    const filtered = users
      .filter((user) => {
        const username = user.username.toLowerCase();
        const displayName = (user.displayName || '').toLowerCase();
        return username.includes(searchLower) || displayName.includes(searchLower);
      })
      .filter((user) => user.isPublicProfile !== false)
      .slice(0, limit);

    return filtered;
  },
});

// ============== USER PROFILE MUTATIONS ==============

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id('users'),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
    discordUsername: v.optional(v.string()),
    isPublicProfile: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;

    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Follow a user
export const followUser = mutation({
  args: {
    followerId: v.id('users'),
    followingId: v.id('users'),
  },
  handler: async (ctx, args) => {
    if (args.followerId === args.followingId) {
      throw new Error('Cannot follow yourself');
    }

    // Check if already following
    const existing = await ctx.db
      .query('follows')
      .withIndex('by_follower', (q) => q.eq('followerId', args.followerId))
      .filter((q) => q.eq(q.field('followingId'), args.followingId))
      .first();

    if (existing) {
      throw new Error('Already following this user');
    }

    // Create follow relationship
    await ctx.db.insert('follows', {
      followerId: args.followerId,
      followingId: args.followingId,
      createdAt: Date.now(),
    });

    // Update follower counts
    const follower = await ctx.db.get(args.followerId);
    const following = await ctx.db.get(args.followingId);

    if (follower) {
      await ctx.db.patch(args.followerId, {
        followingCount: (follower.followingCount || 0) + 1,
      });
    }

    if (following) {
      await ctx.db.patch(args.followingId, {
        followersCount: (following.followersCount || 0) + 1,
      });
    }

    // Create notification
    await ctx.db.insert('notifications', {
      userId: args.followingId,
      type: 'follow',
      actorId: args.followerId,
      message: `${follower?.username || 'Someone'} started following you`,
      isRead: false,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Unfollow a user
export const unfollowUser = mutation({
  args: {
    followerId: v.id('users'),
    followingId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const follow = await ctx.db
      .query('follows')
      .withIndex('by_follower', (q) => q.eq('followerId', args.followerId))
      .filter((q) => q.eq(q.field('followingId'), args.followingId))
      .first();

    if (!follow) {
      throw new Error('Not following this user');
    }

    await ctx.db.delete(follow._id);

    // Update follower counts
    const follower = await ctx.db.get(args.followerId);
    const following = await ctx.db.get(args.followingId);

    if (follower && follower.followingCount) {
      await ctx.db.patch(args.followerId, {
        followingCount: Math.max(0, follower.followingCount - 1),
      });
    }

    if (following && following.followersCount) {
      await ctx.db.patch(args.followingId, {
        followersCount: Math.max(0, following.followersCount - 1),
      });
    }

    return { success: true };
  },
});
