/**
 * STEP 9 — server.js (Application Entry Point)
 *
 * WHY THIS FILE LIVES OUTSIDE src/:
 *   - Running `node server.js` from the project root is obvious and standard.
 *   - src/ holds reusable app code; server.js is the thin "start button".
 *   - package.json "main" and npm scripts point here: "start": "node server.js"
 *
 * WHAT app.listen(PORT) DOES:
 *   - Opens a TCP socket on PORT (e.g. 5000).
 *   - Clients can then send HTTP requests to http://localhost:5000/...
 *   - Until listen() runs, nothing is reachable — the app exists but isn't serving yet.
 *
 * WHAT PORT MEANS:
 *   - A number (0–65535) identifying which "door" on your machine receives HTTP traffic.
 *   - We read PORT from .env so dev/staging/prod can use different values without code changes.
 *
 * MIDDLEWARE ORDER MATTERS — requests flow top to bottom:
 *   1. cors()           — browser security headers first
 *   2. express.json()   — parse body BEFORE routes read req.body
 *   3. morgan('dev')    — log requests
 *   4. loggerMiddleware — our custom log line
 *   5. generalLimiter   — rate limit before hitting heavy route logic
 *   6. routes           — actual API handlers
 *   7. errorMiddleware  — MUST BE LAST — catches errors from everything above
 *
 * If errorMiddleware were registered before routes, route errors would never reach it.
 */

// Load .env FIRST — every file after this can read process.env.PORT, MONGO_URI, JWT_SECRET, etc.
require('dotenv').config();

const express = require('express'); // Web framework — creates app, routes, middleware pipeline.
const cors = require('cors'); // Allows React (localhost:3000) to call API (localhost:5000) from the browser.
const morgan = require('morgan'); // Auto-logs: GET /api/v1/games 200 12ms - 1234

const connectDB = require('./src/config/db'); // MongoDB connection (Step 2).
const routes = require('./src/routes'); // Master router — all /api/v1/* endpoints (Step 8).
const loggerMiddleware = require('./src/middlewares/logger.middleware'); // Custom logger (Step 5).
const { generalLimiter } = require('./src/middlewares/rateLimiter.middleware'); // 100 req/15min (Step 5).
const errorMiddleware = require('./src/middlewares/error.middleware'); // Global error catcher (Step 5).

const app = express(); // Single Express application instance for this process.

// ─── 1) CORS — must run early so preflight OPTIONS requests get correct headers ───
app.use(cors());

// ─── 2) JSON body parser — without this, req.body is undefined on POST/PUT/PATCH ───
app.use(express.json());

// ─── 3) Morgan — built-in HTTP request logging (method, URL, status, response time) ───
app.use(morgan('dev'));

// ─── 4) Custom logger — our readable [METHOD] /path — timestamp line ───
app.use(loggerMiddleware);

// ─── 5) Rate limiter — reject abusive IPs before they hit controllers/services ───
app.use(generalLimiter);

// ─── 6) All API routes — games, auth, analytics, stats, admin, health, etc. ───
app.use(routes);

// ─── 7) Error handler — FOUR parameters (err, req, res, next) — Express knows it's special ───
// Nothing should be registered AFTER this except maybe a 404 handler (we use routes for that).
app.use(errorMiddleware);

// PORT from .env, or 5000 if missing — never hardcode secrets or ports in production logic.
const PORT = process.env.PORT || 5000;

/**
 * Boot sequence:
 *   1) connectDB() — wait for MongoDB handshake
 *   2) app.listen() — only then accept HTTP connections
 *
 * Why connect first? If we listen before DB is ready, early requests could fail unpredictably.
 */
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
