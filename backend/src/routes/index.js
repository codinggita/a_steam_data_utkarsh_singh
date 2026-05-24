/**
 * STEP 8 — routes/index.js (Master Router)
 *
 * express.Router() creates a mini-app you can mount with app.use().
 *
 * app.use('/api/v1/games', gameRoutes) means:
 *   - Every route inside game.routes.js is prefixed with /api/v1/games
 *   - gameRoutes GET '/' becomes GET /api/v1/games
 *   - gameRoutes GET '/:appid' becomes GET /api/v1/games/:appid
 *
 * router.use() vs route-level middleware:
 *   router.use(auth, admin)     → applies to ALL routes on this router (admin.routes.js)
 *   router.get('/x', auth, fn)  → auth runs ONLY for this one route
 *
 * Public routes — anyone can call (no JWT).
 * Protected routes — need auth middleware (JWT in Authorization header).
 * Admin routes — need auth + admin middleware (role must be 'admin').
 */
const express = require('express');
const { sendSuccess } = require('../utils/apiResponse');

const gameRoutes = require('./game.routes');
const filterRoutes = require('./filter.routes');
const authRoutes = require('./auth.routes');
const jwtRoutes = require('./jwt.routes');
const analyticsRoutes = require('./analytics.routes');
const statsRoutes = require('./stats.routes');
const searchRoutes = require('./search.routes');
const adminRoutes = require('./admin.routes');
const gameController = require('../controllers/game.controller');

const router = express.Router();

// ─── Health & system (public) ────────────────────────────────────────────────

/** GET /api/v1/health — uptime check for load balancers / monitoring */
router.get('/api/v1/health', (req, res) => {
  return sendSuccess(res, 200, 'Health', {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/** GET /api/v1/system/info — runtime info for debugging */
router.get('/api/v1/system/info', (req, res) => {
  return sendSuccess(res, 200, 'System info', {
    version: '1.0.0',
    node: process.version,
    environment: process.env.NODE_ENV || 'development',
  });
});

/** GET /api/v1/system/version */
router.get('/api/v1/system/version', (req, res) => {
  return sendSuccess(res, 200, 'Version', { version: '1.0.0' });
});

// ─── Misc public game utilities ──────────────────────────────────────────────

router.get('/api/v1/trending/games', gameController.getTopTrendingGames);

router.get('/api/v1/news/latest', (req, res) => {
  return sendSuccess(res, 200, 'Latest news (mock)', {
    items: [
      { id: 1, title: 'Steam backend is running', body: 'Placeholder news feed content.' },
    ],
  });
});

router.get('/api/v1/compare/games/:id1/:id2', gameController.compareGames);
router.get('/api/v1/recommendations/games/:appid', gameController.getRecommendations);

// ─── Mount feature routers at their base paths ───────────────────────────────

router.use('/api/v1/games', gameRoutes);
router.use('/api/v1/games/filter', filterRoutes);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/jwt', jwtRoutes);
router.use('/api/v1/analytics/games', analyticsRoutes);
router.use('/api/v1/stats/games', statsRoutes);
router.use('/api/v1/search', searchRoutes);
router.use('/api/v1/admin', adminRoutes);

module.exports = router;
