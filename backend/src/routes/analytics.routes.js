/**
 * STEP 8 — analytics.routes.js
 *
 * Mounted at: /api/v1/analytics/games
 * Example: GET /api/v1/analytics/games/top-rated?limit=10
 *
 * All public — aggregation dashboards for charts and reports.
 */
const express = require('express');
const ctrl = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/top-rated', ctrl.getTopRatedGames);
router.get('/most-downloaded', ctrl.getMostDownloadedGames);
router.get('/revenue', ctrl.getRevenueAnalysis);
router.get('/platform-distribution', ctrl.getPlatformDistribution);
router.get('/genre-distribution', ctrl.getGenreDistribution);
router.get('/trending', ctrl.getTrendingGames);
router.get('/release-trends', ctrl.getReleaseTrends);
router.get('/user-activity', ctrl.getUserActivity);
router.get('/wishlist-analysis', ctrl.getWishlistAnalysis);
router.get('/review-analysis', ctrl.getReviewAnalysis);

module.exports = router;
