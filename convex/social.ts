import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// ============== POSTS ==============

// Get posts feed
export const getPosts = query({
  args: {
    type: v.optional(
      v.union(
        v.literal('discussion'),
        v.literal('showcase'),
        v.literal('question'),
        v.literal('story')
      )
    ),
    sortBy: v.optional(
      v.union(v.literal('recent'), v.literal('popular'), v.literal('trending'))
    ),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const offset = args.offset || 0;

    let query = ctx.db.query('posts');

    if (args.type) {
      query = query.withIndex('by_type', (q) => q.eq('type', args.type));
    }

    let posts = await query.collect();

    // Sort
    if (args.sortBy === 'popular') {
      posts.sort((a, b) => b.likeCount - a.likeCount);
    } else if (args.sortBy === 'trending') {
      // Trending: combination of recent + engagement
      posts.sort((a, b) => {
        const scoreA = a.likeCount + a.commentCount * 2 - (Date.now() - a.createdAt) / 1000000;
        const scoreB = b.likeCount + b.commentCount * 2 - (Date.now() - b.createdAt) / 1000000;
        return scoreB - scoreA;
      });
    } else {
      posts.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Get author info for each post
    const enriched = await Promise.all(
      posts.slice(offset, offset + limit).map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
          author: author
            ? {
                _id: author._id,
                username: author.username,
                displayName: author.displayName,
                avatarUrl: author.avatarUrl,
              }
            : null,
        };
      })
    );

    return enriched;
  },
});

// Get single post
export const getPost = query({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const author = await ctx.db.get(post.authorId);

    return {
      ...post,
      author: author
        ? {
            _id: author._id,
            username: author.username,
            displayName: author.displayName,
            avatarUrl: author.avatarUrl,
          }
        : null,
    };
  },
});

// Get user's posts
export const getUserPosts = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('posts')
      .withIndex('by_author', (q) => q.eq('authorId', args.userId))
      .collect();
  },
});

// Create post
export const createPost = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert('posts', {
      ...args,
      likeCount: 0,
      commentCount: 0,
      viewCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return postId;
  },
});

// Update post
export const updatePost = mutation({
  args: {
    postId: v.id('posts'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    imageUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { postId, ...updates } = args;

    await ctx.db.patch(postId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete post
export const deletePost = mutation({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.postId);
    return { success: true };
  },
});

// Increment post view count
export const incrementPostViewCount = mutation({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, {
        viewCount: (post.viewCount || 0) + 1,
      });
    }
  },
});

// ============== COMMENTS ==============

// Get comments for content
export const getComments = query({
  args: {
    contentType: v.union(
      v.literal('post'),
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(),
    parentCommentId: v.optional(v.id('comments')),
  },
  handler: async (ctx, args) => {
    let comments = await ctx.db
      .query('comments')
      .withIndex('by_content', (q) =>
        q.eq('contentType', args.contentType).eq('contentId', args.contentId)
      )
      .collect();

    // Filter by parent if specified
    if (args.parentCommentId !== undefined) {
      comments = comments.filter(
        (c) => c.parentCommentId === args.parentCommentId
      );
    } else {
      // Get only top-level comments
      comments = comments.filter((c) => !c.parentCommentId);
    }

    // Sort by creation date
    comments.sort((a, b) => a.createdAt - b.createdAt);

    // Enrich with author info
    const enriched = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        return {
          ...comment,
          author: author
            ? {
                _id: author._id,
                username: author.username,
                displayName: author.displayName,
                avatarUrl: author.avatarUrl,
              }
            : null,
        };
      })
    );

    return enriched;
  },
});

// Create comment
export const createComment = mutation({
  args: {
    authorId: v.id('users'),
    contentType: v.union(
      v.literal('post'),
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(),
    parentCommentId: v.optional(v.id('comments')),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const commentId = await ctx.db.insert('comments', {
      ...args,
      likeCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update comment count on parent content
    if (args.contentType === 'post') {
      const post = await ctx.db.get(args.contentId as any);
      if (post) {
        await ctx.db.patch(args.contentId as any, {
          commentCount: (post.commentCount || 0) + 1,
        });
      }
    }

    // Create notification
    let notifyUserId: string | null = null;

    if (args.contentType === 'post') {
      const post = await ctx.db.get(args.contentId as any);
      if (post && 'authorId' in post) {
        notifyUserId = post.authorId;
      }
    } else if (args.parentCommentId) {
      const parentComment = await ctx.db.get(args.parentCommentId);
      if (parentComment) {
        notifyUserId = parentComment.authorId;
      }
    } else {
      const content = await ctx.db.get(args.contentId as any);
      if (content && 'authorId' in content) {
        notifyUserId = content.authorId;
      }
    }

    if (notifyUserId && notifyUserId !== args.authorId) {
      const commenter = await ctx.db.get(args.authorId);
      await ctx.db.insert('notifications', {
        userId: notifyUserId as any,
        type: 'comment',
        actorId: args.authorId,
        contentType: args.contentType,
        contentId: args.contentId,
        message: `${commenter?.username || 'Someone'} commented on your ${args.contentType}`,
        isRead: false,
        createdAt: Date.now(),
      });
    }

    return commentId;
  },
});

// Update comment
export const updateComment = mutation({
  args: {
    commentId: v.id('comments'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commentId, {
      content: args.content,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete comment
export const deleteComment = mutation({
  args: { commentId: v.id('comments') },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    await ctx.db.delete(args.commentId);

    // Update comment count on parent content
    if (comment.contentType === 'post') {
      const post = await ctx.db.get(comment.contentId as any);
      if (post && post.commentCount) {
        await ctx.db.patch(comment.contentId as any, {
          commentCount: Math.max(0, post.commentCount - 1),
        });
      }
    }

    return { success: true };
  },
});

// ============== REACTIONS ==============

// Get user's reaction to content
export const getUserReaction = query({
  args: {
    userId: v.id('users'),
    contentType: v.union(
      v.literal('post'),
      v.literal('comment'),
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('reactions')
      .withIndex('by_user_and_content', (q) =>
        q
          .eq('userId', args.userId)
          .eq('contentType', args.contentType)
          .eq('contentId', args.contentId)
      )
      .first();
  },
});

// Toggle reaction
export const toggleReaction = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Check if reaction already exists
    const existing = await ctx.db
      .query('reactions')
      .withIndex('by_user_and_content', (q) =>
        q
          .eq('userId', args.userId)
          .eq('contentType', args.contentType)
          .eq('contentId', args.contentId)
      )
      .first();

    if (existing) {
      // Remove reaction
      await ctx.db.delete(existing._id);
      await updateLikeCount(ctx, args.contentType, args.contentId, -1);
      return { action: 'removed' };
    } else {
      // Add reaction
      await ctx.db.insert('reactions', {
        userId: args.userId,
        contentType: args.contentType,
        contentId: args.contentId,
        reactionType: args.reactionType,
        createdAt: Date.now(),
      });
      await updateLikeCount(ctx, args.contentType, args.contentId, 1);

      // Create notification
      const content = await ctx.db.get(args.contentId as any);
      if (content && 'authorId' in content && content.authorId !== args.userId) {
        const reactor = await ctx.db.get(args.userId);
        await ctx.db.insert('notifications', {
          userId: content.authorId,
          type: 'like',
          actorId: args.userId,
          contentType: args.contentType,
          contentId: args.contentId,
          message: `${reactor?.username || 'Someone'} reacted to your ${args.contentType}`,
          isRead: false,
          createdAt: Date.now(),
        });
      }

      return { action: 'added' };
    }
  },
});

// Helper to update like count
async function updateLikeCount(
  ctx: any,
  contentType: string,
  contentId: string,
  delta: number
) {
  const content = await ctx.db.get(contentId as any);
  if (content && 'likeCount' in content) {
    await ctx.db.patch(contentId as any, {
      likeCount: Math.max(0, (content.likeCount || 0) + delta),
    });
  }
}
