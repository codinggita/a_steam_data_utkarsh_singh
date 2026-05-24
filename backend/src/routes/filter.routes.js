/**
 * STEP 8 — filter.routes.js
 *
 * Mounted at: /api/v1/games/filter
 * So router.get('/free-to-play', ...) becomes GET /api/v1/games/filter/free-to-play
 *
 * Separate file keeps game.routes.js smaller — each preset filter is one line here.
 * All routes are public (no auth) — read-only curated lists for the UI.
 */
const express = require('express');
const game = require('../controllers/game.controller');

const router = express.Router();

router.get('/free-to-play', game.filterFreeToPlay);
router.get('/paid', game.filterPaid);
router.get('/discounted', game.filterDiscounted);
router.get('/early-access', game.filterEarlyAccess);
router.get('/vr-only', game.filterVROnly);
router.get('/controller-support', game.filterControllerSupport);
router.get('/multiplayer', game.filterMultiplayer);
router.get('/singleplayer', game.filterSingleplayer);
router.get('/coop', game.filterCoop);
router.get('/open-world', game.filterOpenWorld);
router.get('/survival', game.filterSurvival);
router.get('/horror', game.filterHorror);
router.get('/anime', game.filterAnime);
router.get('/indie', game.filterIndie);
router.get('/top-rated', game.filterTopRated);

module.exports = router;
