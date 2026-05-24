/**
 * STEP 5 — logger.middleware.js
 *
 * Middleware = a function Express runs BEFORE your route handler.
 * Signature: (req, res, next) => { ... }
 *
 * Flow for one request:
 *   Client → logger → rate limiter → route handler → response
 *
 * Each middleware can:
 *   - read/modify req or res
 *   - end the response (res.json, res.send)
 *   - call next() to pass control to the NEXT middleware/handler
 *
 * If you forget next(), the request hangs forever — the client waits with no reply.
 */

/**
 * loggerMiddleware — prints one line per incoming HTTP request to the server console.
 * Useful while learning: you can see exactly which routes are being hit and when.
 */
function loggerMiddleware(req, res, next) {
  // req.method = HTTP verb the client used: GET, POST, PUT, PATCH, DELETE, etc.
  const method = req.method;

  // req.url = path on this router (can be relative when routes are mounted).
  // req.originalUrl = full path + query string from the client's perspective (safer for logs).
  const path = req.originalUrl || req.url;

  // ISO timestamp = universal format like 2026-05-18T08:30:00.000Z (easy to sort/search in logs).
  const timestamp = new Date().toISOString();

  // Example output: [GET] /api/v1/games?page=1 — 2026-05-18T08:30:00.000Z
  console.log(`[${method}] ${path} — ${timestamp}`);

  // MUST call next() — tells Express "I'm done, run the next middleware or route handler."
  next();
}

module.exports = loggerMiddleware;
