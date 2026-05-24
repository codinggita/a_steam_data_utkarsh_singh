/**
 * STEP 5 — admin.middleware.js
 *
 * Role-based access control (RBAC) — only users with role 'admin' may proceed.
 *
 * HTTP status codes for auth vs authorization:
 *   401 Unauthorized — authentication failed or missing ("Who are you?")
 *   403 Forbidden    — authenticated but not allowed ("I know you, but you can't do this")
 *
 * Typical chain on admin routes:
 *   authMiddleware → adminMiddleware → controller
 *   (verify JWT)     (check role)      (do admin work)
 *
 * authMiddleware MUST run first so req.user exists before we check req.user.role.
 */
const { sendError } = require('../utils/apiResponse');

function adminMiddleware(req, res, next) {
  // Safety net: if someone mounted adminMiddleware without authMiddleware, req.user won't exist.
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized', 'Authentication required');
  }

  // req.user.role comes from JWT payload set in auth.middleware.js after jwt.verify().
  if (req.user.role !== 'admin') {
    // User is logged in but is a normal 'user' — block with 403, not 401.
    return sendError(res, 403, 'Forbidden', 'Admin access required');
  }

  // Role is admin → allow the request to reach the controller.
  next();
}

module.exports = adminMiddleware;
