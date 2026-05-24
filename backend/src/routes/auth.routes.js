/**
 * STEP 8 — auth.routes.js
 *
 * Mounted at: /api/v1/auth
 *
 * Public routes — register, login, logout (no JWT needed).
 * Protected routes — profile, change-password (authMiddleware reads Bearer token).
 *
 * authLimiter on register/login — stricter rate limit (10/15min) vs global 100/15min.
 * Route-level middleware: router.post('/login', authLimiter, handler)
 *   → authLimiter runs first, then controller if limit not exceeded.
 */
const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

// Public
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);

// Protected (JWT required)
router.get('/profile', authMiddleware, authController.getProfile);
router.patch('/profile', authMiddleware, authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
