/**
 * STEP 4 — apiResponse.js
 *
 * Every endpoint should speak the same JSON "language" so your React (or mobile) app
 * can always check `response.success` instead of guessing field names per route.
 *
 * Success shape: { success: true, message: "...", data: { ... } }
 * Error shape:   { success: false, message: "...", error: "..." }
 */

/**
 * sendSuccess — sets HTTP status AND returns the standard success envelope.
 * @param {import('express').Response} res — Express response object (where we call .json)
 * @param {number} statusCode — HTTP code (200 OK, 201 Created, etc.)
 * @param {string} message — human-readable short description for UI or logs
 * @param {*} data — any JSON-serializable payload (object, array, null)
 */
function sendSuccess(res, statusCode, message, data = null) {
  return res.status(statusCode).json({
    success: true, // Client can branch: if (body.success) { ... }
    message, // Same key every time — predictable for beginners and UI copy.
    data, // Put lists, single records, or metadata here — keep errors out of `data`.
  });
}

/**
 * sendError — same idea, but for failures (validation, auth, not found, server bugs).
 * @param {string|Error} error — string message OR Error object (we normalize to string)
 */
function sendError(res, statusCode, message, error = '') {
  return res.status(statusCode).json({
    success: false,
    message, // High-level explanation ("Unauthorized", "Validation error")
    error:
      typeof error === 'string'
        ? error
        : error?.message || 'Error', // If an Error object was passed, surface .message
  });
}

module.exports = { sendSuccess, sendError };
