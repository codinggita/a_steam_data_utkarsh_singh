/**
 * STEP 6 — analytics.service.js
 *
 * Aggregation pipelines = multi-step data processing inside MongoDB.
 * Documents flow through stages in order; each stage transforms the stream.
 *
 * Common stages (explained per function below):
 *   $match   — filter documents (like find WHERE)
 *   $group   — combine documents by a key; compute sums, averages, counts
 *   $sort    — order results
 *   $limit   — cap output count
 *   $project — reshape/select fields for the response
 *   $unwind  — split array fields into separate documents
 *   $facet   — run multiple sub-pipelines in parallel on same input
 */
const Game = require('../models/Game');
const User = require('../models/User');

const BASE_MATCH = { isArchived: false };

/**
 * getTopRatedGames
 *   $match — only non-archived games
 *   $sort rating:-1 — highest rating first (-1 = descending)
 *   $limit — return top N
 */
async function getTopRatedGames(limit = 10) {
  return Game.aggregate([
    { $match: BASE_MATCH },
    { $sort: { rating: -1 } },
    { $limit: limit },
  ]);
}

/**
 * getMostDownloadedGames — same pattern, sort by downloads instead of rating.
 */
async function getMostDownloadedGames(limit = 10) {
  return Game.aggregate([
    { $match: BASE_MATCH },
    { $sort: { downloads: -1 } },
    { $limit: limit },
  ]);
}

/**
 * getRevenueAnalysis — estimated revenue per developer.
 *
 *   $group _id:'$developer' — one output row per unique developer name
 *   $sum + $multiply — for each game: price * downloads, then sum across developer's games
 *   $project — rename _id to developer, hide internal _id field
 */
async function getRevenueAnalysis() {
  return Game.aggregate([
    { $match: BASE_MATCH },
    {
      $group: {
        _id: '$developer',
        estimatedRevenue: { $sum: { $multiply: ['$price', '$downloads'] } },
        games: { $sum: 1 },
      },
    },
    { $sort: { estimatedRevenue: -1 } },
    { $project: { developer: '$_id', estimatedRevenue: 1, games: 1, _id: 0 } },
  ]);
}

/**
 * getPlatformDistribution — count games per platform flag.
 *
 *   $facet — runs windows/mac/linux sub-pipelines on the same matched set
 *   Each sub-pipeline: $match platform true → $count
 */
async function getPlatformDistribution() {
  return Game.aggregate([
    { $match: BASE_MATCH },
    {
      $facet: {
        windows: [{ $match: { 'platforms.windows': true } }, { $count: 'count' }],
        mac: [{ $match: { 'platforms.mac': true } }, { $count: 'count' }],
        linux: [{ $match: { 'platforms.linux': true } }, { $count: 'count' }],
      },
    },
  ]);
}

/**
 * getGenreDistribution
 *   $unwind '$genres' — if genres:[Action,RPG], creates two docs (one per genre)
 *   $group by genre — count games per genre label
 */
async function getGenreDistribution() {
  return Game.aggregate([
    { $match: BASE_MATCH },
    { $unwind: '$genres' },
    { $group: { _id: '$genres', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

/**
 * getTrendingGames — blend rating + download popularity into a score.
 *
 *   $addFields — compute score = rating + (downloads / 1_000_000)
 *   $sort by score desc, $limit, then $project to remove internal score field
 */
async function getTrendingGames(limit = 10) {
  return Game.aggregate([
    { $match: BASE_MATCH },
    {
      $addFields: {
        score: { $add: ['$rating', { $divide: ['$downloads', 1000000] }] },
      },
    },
    { $sort: { score: -1 } },
    { $limit: limit },
    { $project: { score: 0 } },
  ]);
}

/**
 * getReleaseTrends — games released per year/month.
 *
 *   $year / $month — extract date parts from releaseDate
 *   $group by {y, m} — count releases in each month bucket
 */
async function getReleaseTrends() {
  return Game.aggregate([
    { $match: { ...BASE_MATCH, releaseDate: { $exists: true } } },
    {
      $group: {
        _id: {
          y: { $year: '$releaseDate' },
          m: { $month: '$releaseDate' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
  ]);
}

/** getUserActivity — combine User.countDocuments with review totals across games. */
async function getUserActivity() {
  const [registeredUsers, reviewAgg] = await Promise.all([
    User.countDocuments({}),
    Game.aggregate([
      { $match: BASE_MATCH },
      { $project: { n: { $size: { $ifNull: ['$reviews', []] } } } },
      { $group: { _id: null, totalReviews: { $sum: '$n' } } },
    ]),
  ]);

  return {
    registeredUsers,
    totalReviewsAcrossGames: reviewAgg[0]?.totalReviews || 0,
  };
}

/** getWishlistAnalysis — placeholder until a real Wishlist collection exists. */
async function getWishlistAnalysis() {
  return {
    note: 'Wishlist data not modeled — returning high-rated games as proxy interest.',
    proxyTopWishlisted: await getTopRatedGames(5),
  };
}

/**
 * getReviewAnalysis — per-game review stats.
 *   $unwind reviews — one row per review
 *   $group by appid — avg rating + count per game
 */
async function getReviewAnalysis() {
  return Game.aggregate([
    { $match: BASE_MATCH },
    { $unwind: { path: '$reviews', preserveNullAndEmptyArrays: false } },
    {
      $group: {
        _id: '$appid',
        avgReviewRating: { $avg: '$reviews.rating' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);
}

module.exports = {
  getTopRatedGames,
  getMostDownloadedGames,
  getRevenueAnalysis,
  getPlatformDistribution,
  getGenreDistribution,
  getTrendingGames,
  getReleaseTrends,
  getUserActivity,
  getWishlistAnalysis,
  getReviewAnalysis,
};
