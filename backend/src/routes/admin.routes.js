/**
 * STEP 8 — admin.routes.js
 *
 * Mounted at: /api/v1/admin
 *
 * router.use(auth, adminMw) — router-level middleware:
 *   EVERY route below this line requires JWT + role 'admin'.
 *   Cleaner than repeating auth, admin on each route individually.
 *
 * 401 if no/invalid token; 403 if logged in as normal user.
 */
const express = require('express');
const auth = require('../middlewares/auth.middleware');
const adminMw = require('../middlewares/admin.middleware');
const ctrl = require('../controllers/admin.controller');

const router = express.Router();

router.use(auth, adminMw);

router.get('/games', ctrl.getAdminGamesList);
router.get('/analytics', ctrl.getAdminAnalytics);
router.get('/reports', ctrl.getAdminReports);
router.get('/dashboard', ctrl.getAdminDashboard);

module.exports = router;
