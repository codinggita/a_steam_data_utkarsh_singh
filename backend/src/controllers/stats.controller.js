/**
 * STEP 7 — stats.controller.js
 *
 * Lightweight statistics for dashboard widgets (counts, averages, snapshots).
 * Unlike analytics.service (complex pipelines), some stats use simple find/count.
 *
 * All responses use sendSuccess with { success: true, message, data } format.
 */
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const Game = require('../models/Game');

const PUBLIC_MATCH = { isArchived: false };

/** GET /stats/games/count — total non-archived games */
exports.getTotalCount = asyncHandler(async (req, res) => {
  const total = await Game.countDocuments(PUBLIC_MATCH);
  return sendSuccess(res, 200, 'Total games', { total });
});

/** GET /stats/games/top-rated — top 5 by rating (snapshot, not full analytics pipeline) */
exports.getTopRatedStats = asyncHandler(async (req, res) => {
  const games = await Game.find(PUBLIC_MATCH)
    .sort({ rating: -1 })
    .limit(5)
    .select('appid title rating')
    .lean();
  return sendSuccess(res, 200, 'Top rated snapshot', { games });
});

/** GET /stats/games/most-downloaded — top 5 by downloads */
exports.getMostDownloadedStats = asyncHandler(async (req, res) => {
  const games = await Game.find(PUBLIC_MATCH)
    .sort({ downloads: -1 })
    .limit(5)
    .select('appid title downloads')
    .lean();
  return sendSuccess(res, 200, 'Most downloaded snapshot', { games });
});

/**
 * GET /stats/games/average-price
 * $avg in aggregation — computes mean price across all matched games.
 */
exports.getAveragePrice = asyncHandler(async (req, res) => {
  const agg = await Game.aggregate([
    { $match: PUBLIC_MATCH },
    { $group: { _id: null, avgPrice: { $avg: '$price' } } },
  ]);
  return sendSuccess(res, 200, 'Average price', { avgPrice: agg[0]?.avgPrice || 0 });
});

/** GET /stats/games/average-rating — $avg on rating field */
exports.getAverageRating = asyncHandler(async (req, res) => {
  const agg = await Game.aggregate([
    { $match: PUBLIC_MATCH },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } },
  ]);
  return sendSuccess(res, 200, 'Average rating', { avgRating: agg[0]?.avgRating || 0 });
});

/**
 * GET /stats/games/genre-count
 * $unwind splits genres array → $group counts per genre label.
 */
exports.getGenreCount = asyncHandler(async (req, res) => {
  const data = await Game.aggregate([
    { $match: PUBLIC_MATCH },
    { $unwind: '$genres' },
    { $group: { _id: '$genres', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return sendSuccess(res, 200, 'Genre counts', { data });
});

/**
 * GET /stats/games/platform-count
 * $cond inside $sum — if platforms.windows is true, add 1, else add 0.
 */
exports.getPlatformCount = asyncHandler(async (req, res) => {
  const data = await Game.aggregate([
    { $match: PUBLIC_MATCH },
    {
      $group: {
        _id: null,
        windows: { $sum: { $cond: ['$platforms.windows', 1, 0] } },
        mac: { $sum: { $cond: ['$platforms.mac', 1, 0] } },
        linux: { $sum: { $cond: ['$platforms.linux', 1, 0] } },
      },
    },
  ]);
  return sendSuccess(res, 200, 'Platform counts', {
    data: data[0] || { windows: 0, mac: 0, linux: 0 },
  });
});

/** GET /stats/games/free-to-play-count — countDocuments with boolean filter */
exports.getFreeToPlayCount = asyncHandler(async (req, res) => {
  const count = await Game.countDocuments({ ...PUBLIC_MATCH, isFreeToPlay: true });
  return sendSuccess(res, 200, 'Free-to-play count', { count });
});

/** GET /stats/games/multiplayer-count */
exports.getMultiplayerCount = asyncHandler(async (req, res) => {
  const count = await Game.countDocuments({ ...PUBLIC_MATCH, isMultiplayer: true });
  return sendSuccess(res, 200, 'Multiplayer count', { count });
});

/**
 * GET /stats/games/monthly-releases
 * $year + $month on releaseDate → group by calendar month → count releases.
 */
exports.getMonthlyReleases = asyncHandler(async (req, res) => {
  const data = await Game.aggregate([
    { $match: { ...PUBLIC_MATCH, releaseDate: { $exists: true } } },
    {
      $group: {
        _id: { y: { $year: '$releaseDate' }, m: { $month: '$releaseDate' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
  ]);
  return sendSuccess(res, 200, 'Monthly releases', { data });
});
