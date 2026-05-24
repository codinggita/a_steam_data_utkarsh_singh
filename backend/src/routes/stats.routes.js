/**
 * STEP 8 — stats.routes.js
 *
 * Mounted at: /api/v1/stats/games
 * Example: GET /api/v1/stats/games/count
 *
 * Lightweight stats for dashboard number cards — all public.
 */
const express = require('express');
const ctrl = require('../controllers/stats.controller');

const router = express.Router();

router.get('/count', ctrl.getTotalCount);
router.get('/top-rated', ctrl.getTopRatedStats);
router.get('/most-downloaded', ctrl.getMostDownloadedStats);
router.get('/average-price', ctrl.getAveragePrice);
router.get('/average-rating', ctrl.getAverageRating);
router.get('/genre-count', ctrl.getGenreCount);
router.get('/platform-count', ctrl.getPlatformCount);
router.get('/free-to-play-count', ctrl.getFreeToPlayCount);
router.get('/multiplayer-count', ctrl.getMultiplayerCount);
router.get('/monthly-releases', ctrl.getMonthlyReleases);

module.exports = router;
