/**
 * STEP 4 — pagination.js
 *
 * List endpoints use URL query strings like: GET /games?page=2&limit=10
 *
 * - `page` — which "window" of results you want (1-based, like a book page number).
 * - `limit` — how many items per page (page size).
 * - `skip` — how many matching documents MongoDB should skip before returning results.
 *
 * Why `skip`? MongoDB's .find().skip(n).limit(m) means:
 * "Skip the first n documents that match the filter, then return at most m."
 * That is the same idea as SQL OFFSET — it lets you jump to page 2, 3, etc.
 *
 * Example: page=3, limit=10 → skip = (3-1)*10 = 20 → you get items 21–30.
 */

/**
 * getPagination — reads `page` and `limit` from req.query (or any plain object shaped like query).
 * @param {object} query — typically `req.query` from Express
 * @returns {{ page: number, limit: number, skip: number }}
 */
function getPagination(query) {
  // parseInt(..., 10) forces base-10; || 1 handles missing/invalid → default page 1.
  const page = Math.max(1, parseInt(query.page, 10) || 1);

  // Default limit 10; clamp between 1 and 100 so someone cannot request a million rows at once.
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));

  // Core formula: first page skips 0; second page skips `limit`; third skips 2*limit; etc.
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

module.exports = { getPagination };
