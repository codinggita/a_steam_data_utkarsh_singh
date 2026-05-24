/**
 * STEP 7 — analytics.controller.js
 *
 * One controller function per analytics.service function.
 * Controllers stay thin: read optional req.query.limit, call service, sendSuccess.
 *
 * req.query.limit — optional; caps how many top games to return (default 10, max 100).
 */
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const analytics = require('../services/analytics.service');

/**
 * withLimit — factory for analytics endpoints that accept ?limit=N.
 * Avoids repeating the same limit-parsing logic in every handler.
 */
const withLimit = (serviceFn, message = 'OK') =>
  asyncHandler(async (req, res) => {
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 10);
    const data = await serviceFn(limit);
    return sendSuccess(res, 200, message, { data });
  });

/** GET /analytics/games/top-rated?limit=10 */
exports.getTopRatedGames = withLimit(analytics.getTopRatedGames, 'Top rated games');

/** GET /analytics/games/most-downloaded?limit=10 */
exports.getMostDownloadedGames = withLimit(analytics.getMostDownloadedGames, 'Most downloaded games');

/** GET /analytics/games/revenue — per-developer estimated revenue */
exports.getRevenueAnalysis = asyncHandler(async (req, res) => {
  const data = await analytics.getRevenueAnalysis();
  return sendSuccess(res, 200, 'Revenue analysis', { data });
});

/** GET /analytics/games/platform-distribution — windows/mac/linux counts */
exports.getPlatformDistribution = asyncHandler(async (req, res) => {
  const data = await analytics.getPlatformDistribution();
  return sendSuccess(res, 200, 'Platform distribution', { data });
});

/** GET /analytics/games/genre-distribution — count per genre */
exports.getGenreDistribution = asyncHandler(async (req, res) => {
  const data = await analytics.getGenreDistribution();
  return sendSuccess(res, 200, 'Genre distribution', { data });
});

/** GET /analytics/games/trending?limit=10 — rating + downloads blend */
exports.getTrendingGames = withLimit(analytics.getTrendingGames, 'Trending games');

/** GET /analytics/games/release-trends — games per year/month */
exports.getReleaseTrends = asyncHandler(async (req, res) => {
  const data = await analytics.getReleaseTrends();
  return sendSuccess(res, 200, 'Release trends', { data });
});

/** GET /analytics/games/user-activity — registered users + review totals */
exports.getUserActivity = asyncHandler(async (req, res) => {
  const data = await analytics.getUserActivity();
  return sendSuccess(res, 200, 'User activity', { data });
});

/** GET /analytics/games/wishlist-analysis — placeholder until wishlist model exists */
exports.getWishlistAnalysis = asyncHandler(async (req, res) => {
  const data = await analytics.getWishlistAnalysis();
  return sendSuccess(res, 200, 'Wishlist analysis', { data });
});

/** GET /analytics/games/review-analysis — per-game review stats */
exports.getReviewAnalysis = asyncHandler(async (req, res) => {
  const data = await analytics.getReviewAnalysis();
  return sendSuccess(res, 200, 'Review analysis', { data });
});
