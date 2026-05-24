/**
 * STEP 8 — search.routes.js
 *
 * Mounted at: /api/v1/search
 * GET /api/v1/search/games?q=keyword&page=1&limit=10
 *
 * Case-insensitive search on title, developer, tags (see game.service searchGames).
 */
const express = require('express');
const game = require('../controllers/game.controller');

const router = express.Router();

router.get('/games', game.searchGames);

module.exports = router;
