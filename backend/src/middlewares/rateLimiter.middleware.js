/**
 * STEP 5 — rateLimiter.middleware.js
 *
 * Rate limiting = cap how many requests one client (usually by IP) can make in a time window.
 *
 * Why it matters:
 *   - Stops brute-force password guessing on /login
 *   - Reduces accidental infinite loops from buggy frontends
 *   - Makes denial-of-service attacks harder (not impossible, but slower)
 *
 * express-rate-limit tracks request counts per IP in memory (resets when server restarts).
 * When limit exceeded → HTTP 429 Too Many Requests (automatic from the library).
 *
 * Two limiters:
 *   generalLimiter — applied globally in server.js (100 req / 15 min)
 *   authLimiter    — applied only on /auth/register and /auth/login (10 req / 15 min)
 */
const rateLimit = require('express-rate-limit');

// 15 minutes in milliseconds: 15 * 60 seconds * 1000 ms = 900000
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

/**
 * generalLimiter — protects the whole API from runaway traffic.
 * max: 100 means each IP gets at most 100 requests per windowMs before 429 responses.
 */
const generalLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS, // Rolling time window; counter resets after this duration.
  max: process.env.NODE_ENV === 'development' ? 10000 : 100, // Higher limit for development
  standardHeaders: true, // Sends RateLimit-* headers (RFC draft) so clients know their quota.
  legacyHeaders: false, // Disable old X-RateLimit-* headers (cleaner, use standard ones).
  message: {
    success: false,
    message: 'Too many requests',
    error: 'Rate limit exceeded. Try again later.',
  },
});

/**
 * authLimiter — stricter limit for login/register (common brute-force targets).
 * 10 attempts per 15 minutes per IP — enough for real users, painful for attackers.
 */
const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  max: process.env.NODE_ENV === 'development' ? 1000 : 10, // Higher limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts',
    error: 'Too many login/register attempts. Try again in 15 minutes.',
  },
});

module.exports = { generalLimiter, authLimiter };
