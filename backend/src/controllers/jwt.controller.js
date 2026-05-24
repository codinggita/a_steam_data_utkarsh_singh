/**
 * jwt.controller.js — JWT playground routes (verify/refresh/revoke) for learning HTTP auth.
 */
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { generateToken } = require('../services/auth.service');
const User = require('../models/User');
const analytics = require('../services/analytics.service');
const Game = require('../models/Game');

const revoked = new Set(); // In-memory "blacklist" — resets when the Node process restarts.

exports.getJwtProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) return sendError(res, 404, 'Not found', 'User not found');
  delete user.password;
  return sendSuccess(res, 200, 'JWT profile', { user });
});

exports.getJwtDashboard = asyncHandler(async (req, res) => {
  const [gamesCount, topRated] = await Promise.all([
    Game.countDocuments({ isArchived: false }),
    analytics.getTopRatedGames(5),
  ]);
  return sendSuccess(res, 200, 'Dashboard', { gamesCount, topRated, viewer: req.user });
});

exports.generateTokenManual = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  if (!userId) return sendError(res, 400, 'Bad request', 'userId required');
  const token = generateToken(userId, role || 'user');
  return sendSuccess(res, 200, 'Token generated (testing only)', { token });
});

exports.verifyToken = asyncHandler(async (req, res) => {
  const token = req.body.token;
  if (!token) return sendError(res, 400, 'Bad request', 'token required');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return sendSuccess(res, 200, 'Token valid', { decoded });
  } catch (e) {
    return sendError(res, 401, 'Invalid token', e.message);
  }
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const header = req.headers.authorization || '';
  const parts = header.split(' ');
  const old = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : req.body.token;
  if (!old) return sendError(res, 400, 'Bad request', 'Bearer token or body.token required');
  if (revoked.has(old)) return sendError(res, 401, 'Revoked', 'Token was revoked');
  const decoded = jwt.verify(old, process.env.JWT_SECRET);
  const token = generateToken(decoded.id, decoded.role);
  return sendSuccess(res, 200, 'New token', { token });
});

exports.revokeToken = asyncHandler(async (req, res) => {
  const header = req.headers.authorization || '';
  const parts = header.split(' ');
  const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : req.body.token;
  if (!token) return sendError(res, 400, 'Bad request', 'token required');
  revoked.add(token);
  return sendSuccess(res, 200, 'Token revoked (in-memory)', { revoked: true });
});

exports.getPrivateGames = asyncHandler(async (req, res) => {
  const games = await Game.find({ isArchived: false }).sort({ rating: -1 }).limit(20).lean();
  return sendSuccess(res, 200, 'Private games list', { games });
});

exports.getPrivateAnalytics = asyncHandler(async (req, res) => {
  const [genre, revenue] = await Promise.all([analytics.getGenreDistribution(), analytics.getRevenueAnalysis()]);
  return sendSuccess(res, 200, 'Private analytics', { genre, revenue });
});
