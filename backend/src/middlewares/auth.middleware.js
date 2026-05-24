/**
 * STEP 5 — auth.middleware.js
 *
 * Protects routes that require a logged-in user.
 * Clients prove identity by sending a JWT in the Authorization header.
 *
 * JWT flow (simplified):
 *   1) User logs in → server signs a token with JWT_SECRET
 *   2) Client stores token (memory, localStorage, etc.)
 *   3) Client sends: Authorization: Bearer <token> on protected requests
 *   4) This middleware verifies the token and attaches user info to req.user
 *   5) Controller reads req.user.id and req.user.role
 *
 * "Signing" = server creates a token only someone with JWT_SECRET can forge.
 * "Verify" = server checks signature + expiry; if tampered or expired → reject.
 */
const jwt = require('jsonwebtoken'); // Library to sign and verify JSON Web Tokens.
const { sendError } = require('../utils/apiResponse'); // Consistent { success: false, ... } errors.

function authMiddleware(req, res, next) {
  // Step 1 — Read the Authorization header (case-insensitive in HTTP, Express normalizes to lowercase keys).
  // Expected format: "Bearer eyJhbGciOiJIUzI1NiIs..."
  const authHeader = req.headers.authorization || '';

  // Step 2 — Split "Bearer <token>" into two parts; we need the token after the space.
  const parts = authHeader.split(' ');

  // Step 3 — Validate scheme: exactly 2 parts, first part must be "Bearer" (OAuth2-style convention).
  const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;

  // Step 4 — No token → 401 Unauthorized ("who are you?" — identity not provided).
  if (!token) {
    return sendError(res, 401, 'Unauthorized', 'No token provided');
  }

  try {
    // Step 5 — jwt.verify decodes AND checks:
    //   - signature matches JWT_SECRET (proves server issued it, not tampered)
    //   - token is not expired (exp claim from JWT_EXPIRES_IN at sign time)
    // Throws JsonWebTokenError or TokenExpiredError if invalid.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 6 — Attach safe user info to req so controllers don't re-verify the token.
    // decoded payload was { id, role } when we called jwt.sign() in auth.service.js.
    req.user = {
      id: decoded.id, // MongoDB user _id as string
      role: decoded.role, // 'user' or 'admin' — used by adminMiddleware later
    };

    // Step 7 — Token valid → continue to the route handler or next middleware.
    next();
  } catch (err) {
    // Invalid signature, malformed token, or expired → same 401 to client (don't leak internals).
    return sendError(res, 401, 'Unauthorized', 'Invalid or expired token');
  }
}

module.exports = authMiddleware;
