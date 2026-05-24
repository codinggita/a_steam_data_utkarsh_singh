/**
 * STEP 8 — game.routes.js
 *
 * Mounted at: /api/v1/games (see routes/index.js)
 *
 * express.Router() — groups related routes into one file.
 * Export router → index.js mounts it with router.use('/api/v1/games', gameRoutes).
 *
 * ROUTE ORDER MATTERS:
 *   Static paths like /random, /sort/price-desc MUST come BEFORE /:appid
 *   Otherwise Express treats "random" as an appid value.
 *
 * Middleware chains (left to right):
 *   auth, admin, handler  → JWT check, then admin role check, then controller
 *   auth, handler         → JWT only (archive/restore/reviews)
 *   handler               → public (no login required)
 */
const express = require('express');
const game = require('../controllers/game.controller');
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');

const router = express.Router();

// ─── List & discovery (public) ───────────────────────────────────────────────

/** GET /api/v1/games — list with ?genre=&sort=&page=&limit= filters */
router.get('/', game.getAllGames);

/** GET /api/v1/games/random */
router.get('/random', game.getRandomGame);

// ─── Sort presets (public) ───────────────────────────────────────────────────

router.get('/sort/price-desc', game.sortByPriceDesc);
router.get('/sort/rating-desc', game.sortByRatingDesc);
router.get('/sort/downloads-desc', game.sortByDownloadsDesc);
router.get('/sort/releaseDate-desc', game.sortByReleaseDateDesc);
router.get('/sort/popularity-desc', game.sortByPopularityDesc);

// ─── Filter by path segment (public) ─────────────────────────────────────────

router.get('/genre/:genre', game.getGamesByGenre);
router.get('/developer/:developer', game.getGamesByDeveloper);
router.get('/publisher/:publisher', game.getGamesByPublisher);
router.get('/platform/:platform', game.getGamesByPlatform);
router.get('/tag/:tag', game.getGamesByTag);
router.get('/release-year/:year', game.getGamesByYear);
router.get('/rating/:rating', game.getGamesByRating);
router.get('/price/:price', game.getGamesByPrice);
router.get('/feature/:feature', game.getGamesByFeature);

/** GET /api/v1/games/exists/:appid */
router.get('/exists/:appid', game.checkGameExists);

// ─── Single game sub-resources (public reads) ────────────────────────────────

router.get('/:appid/summary', game.getGameSummary);
router.get('/:appid/history', game.getUpdateHistory);
router.get('/:appid/related', game.getRelatedGames);
router.get('/:appid/screenshots', game.getScreenshots);
router.get('/:appid/trailers', game.getTrailers);
router.get('/:appid/reviews', game.getReviews);
router.get('/:appid/system-requirements', game.getSystemRequirements);
router.get('/:appid/dlc', game.getDLC);
router.get('/:appid/achievements', game.getAchievements);
router.get('/:appid/updates', game.getUpdates);

// ─── Reviews (protected — auth required) ─────────────────────────────────────

router.post('/:appid/reviews', auth, game.addReview);
router.patch('/:appid/reviews/:reviewId', auth, game.updateReview);
router.delete('/:appid/reviews/:reviewId', auth, game.deleteReview);

// ─── CRUD (admin — auth + admin role) ────────────────────────────────────────

router.post('/', auth, admin, game.createGame);
router.put('/:appid', auth, admin, game.replaceGame);
router.patch('/:appid', auth, admin, game.updateGame);
router.delete('/:appid', auth, admin, game.deleteGame);

// ─── Soft delete (protected — any logged-in user) ────────────────────────────

router.patch('/:appid/archive', auth, game.archiveGame);
router.patch('/:appid/restore', auth, game.restoreGame);

/** GET /api/v1/games/:appid — must stay near bottom so it doesn't swallow static paths */
router.get('/:appid', game.getGameById);

module.exports = router;
