/**
 * STEP 8 — jwt.routes.js
 *
 * Mounted at: /api/v1/jwt
 *
 * JWT playground + demo protected endpoints for learning token flows.
 *
 * Public: generate-token, verify-token, refresh-token (needs valid old token in header/body)
 * Protected: profile, dashboard, revoke-token, private-games, private-analytics
 */
const express = require('express');
const jwtController = require('../controllers/jwt.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/profile', authMiddleware, jwtController.getJwtProfile);
router.get('/dashboard', authMiddleware, jwtController.getJwtDashboard);

router.post('/generate-token', jwtController.generateTokenManual);
router.post('/verify-token', jwtController.verifyToken);
router.post('/refresh-token', jwtController.refreshToken);

router.delete('/revoke-token', authMiddleware, jwtController.revokeToken);
router.get('/private-games', authMiddleware, jwtController.getPrivateGames);
router.get('/private-analytics', authMiddleware, jwtController.getPrivateAnalytics);

module.exports = router;
