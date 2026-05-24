/**
 * admin.controller.js — privileged read-only views for operators.
 */
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { getPagination } = require('../utils/pagination');
const gameService = require('../services/game.service');
const analytics = require('../services/analytics.service');
const User = require('../models/User');

exports.getAdminGamesList = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.listGamesAdmin(page, limit);
  return sendSuccess(res, 200, 'Admin games', result);
});

exports.getAdminAnalytics = asyncHandler(async (req, res) => {
  const [revenue, genres, platforms, users] = await Promise.all([
    analytics.getRevenueAnalysis(),
    analytics.getGenreDistribution(),
    analytics.getPlatformDistribution(),
    User.countDocuments({}),
  ]);
  return sendSuccess(res, 200, 'Admin analytics', { revenue, genres, platforms, users });
});

exports.getAdminReports = asyncHandler(async (req, res) => {
  const reports = {
    generatedAt: new Date().toISOString(),
    note: 'Placeholder report bundle — extend with real reporting queries.',
    topRated: await analytics.getTopRatedGames(10),
    trending: await analytics.getTrendingGames(10),
  };
  return sendSuccess(res, 200, 'Admin reports', { reports });
});

exports.getAdminDashboard = asyncHandler(async (req, res) => {
  const Game = require('../models/Game');
  const [totalGames, totalUsers, topRated] = await Promise.all([
    Game.countDocuments({}),
    User.countDocuments({}),
    analytics.getTopRatedGames(5),
  ]);
  return sendSuccess(res, 200, 'Admin dashboard', { totalGames, totalUsers, topRated });
});
