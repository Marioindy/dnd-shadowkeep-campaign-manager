import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// ============== REVIEW QUERIES ==============

// Get reviews for content
export const getReviews = query({
  args: {
    contentType: v.union(
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(),
    sortBy: v.optional(
      v.union(v.literal('recent'), v.literal('rating'), v.literal('helpful'))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;

    let reviews = await ctx.db
      .query('reviews')
      .withIndex('by_content', (q) =>
        q.eq('contentType', args.contentType).eq('contentId', args.contentId)
      )
      .collect();

    // Sort
    if (args.sortBy === 'rating') {
      reviews.sort((a, b) => b.rating - a.rating);
    } else if (args.sortBy === 'helpful') {
      reviews.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
    } else {
      reviews.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Enrich with author info
    const enriched = await Promise.all(
      reviews.slice(0, limit).map(async (review) => {
        const author = await ctx.db.get(review.authorId);
        return {
          ...review,
          author: author
            ? {
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

// Get user's reviews
export const getUserReviews = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('reviews')
      .withIndex('by_author', (q) => q.eq('authorId', args.userId))
      .collect();
  },
});

// Get review statistics for content
export const getReviewStats = query({
  args: {
    contentType: v.union(
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query('reviews')
      .withIndex('by_content', (q) =>
        q.eq('contentType', args.contentType).eq('contentId', args.contentId)
      )
      .collect();

    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let totalRating = 0;

    reviews.forEach((review) => {
      ratingCounts[review.rating as keyof typeof ratingCounts]++;
      totalRating += review.rating;
    });

    const averageRating =
      reviews.length > 0 ? totalRating / reviews.length : 0;

    return {
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingCounts,
    };
  },
});

// Check if user has reviewed content
export const hasUserReviewed = query({
  args: {
    userId: v.id('users'),
    contentType: v.union(
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(),
  },
  handler: async (ctx, args) => {
    const review = await ctx.db
      .query('reviews')
      .withIndex('by_author', (q) => q.eq('authorId', args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field('contentType'), args.contentType),
          q.eq(q.field('contentId'), args.contentId)
        )
      )
      .first();

    return review !== null;
  },
});

// ============== REVIEW MUTATIONS ==============

// Create a review
export const createReview = mutation({
  args: {
    authorId: v.id('users'),
    contentType: v.union(
      v.literal('campaign'),
      v.literal('character'),
      v.literal('map')
    ),
    contentId: v.string(),
    rating: v.number(),
    title: v.optional(v.string()),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate rating
    if (args.rating < 1 || args.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if user already reviewed this content
    const existing = await ctx.db
      .query('reviews')
      .withIndex('by_author', (q) => q.eq('authorId', args.authorId))
      .filter((q) =>
        q.and(
          q.eq(q.field('contentType'), args.contentType),
          q.eq(q.field('contentId'), args.contentId)
        )
      )
      .first();

    if (existing) {
      throw new Error('You have already reviewed this content');
    }

    // Create review
    const reviewId = await ctx.db.insert('reviews', {
      ...args,
      helpful: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update content rating stats
    await updateContentRating(ctx, args.contentType, args.contentId);

    // Create notification for content author
    const content = await ctx.db.get(args.contentId as any);
    if (content && 'authorId' in content) {
      const reviewer = await ctx.db.get(args.authorId);
      await ctx.db.insert('notifications', {
        userId: content.authorId,
        type: 'review',
        actorId: args.authorId,
        contentType: args.contentType,
        contentId: args.contentId,
        message: `${reviewer?.username || 'Someone'} reviewed your ${args.contentType}`,
        isRead: false,
        createdAt: Date.now(),
      });
    }

    return reviewId;
  },
});

// Update a review
export const updateReview = mutation({
  args: {
    reviewId: v.id('reviews'),
    rating: v.optional(v.number()),
    title: v.optional(v.string()),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { reviewId, ...updates } = args;

    if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const review = await ctx.db.get(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    await ctx.db.patch(reviewId, {
      ...updates,
      updatedAt: Date.now(),
    });

    // Update content rating stats if rating changed
    if (updates.rating) {
      await updateContentRating(ctx, review.contentType, review.contentId);
    }

    return { success: true };
  },
});

// Delete a review
export const deleteReview = mutation({
  args: { reviewId: v.id('reviews') },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    await ctx.db.delete(args.reviewId);

    // Update content rating stats
    await updateContentRating(ctx, review.contentType, review.contentId);

    return { success: true };
  },
});

// Mark review as helpful
export const markReviewHelpful = mutation({
  args: { reviewId: v.id('reviews') },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    await ctx.db.patch(args.reviewId, {
      helpful: (review.helpful || 0) + 1,
    });

    return { success: true };
  },
});

// ============== HELPER FUNCTIONS ==============

async function updateContentRating(
  ctx: any,
  contentType: 'campaign' | 'character' | 'map',
  contentId: string
) {
  const reviews = await ctx.db
    .query('reviews')
    .withIndex('by_content', (q) =>
      q.eq('contentType', contentType).eq('contentId', contentId)
    )
    .collect();

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  let table: 'sharedCampaigns' | 'sharedCharacters' | 'sharedMaps';
  if (contentType === 'campaign') {
    table = 'sharedCampaigns';
  } else if (contentType === 'character') {
    table = 'sharedCharacters';
  } else {
    table = 'sharedMaps';
  }

  await ctx.db.patch(contentId as any, {
    averageRating: Math.round(averageRating * 10) / 10,
    ratingCount: reviews.length,
  });
}
