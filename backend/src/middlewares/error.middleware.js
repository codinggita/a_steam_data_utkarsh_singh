/**
 * STEP 5 — error.middleware.js
 *
 * Global error handler — catches errors from anywhere in the app:
 *   - thrown in controllers/services
 *   - passed via next(err) from asyncHandler
 *   - Mongoose validation/cast/duplicate errors
 *
 * Express ONLY treats a function as an error handler if it has EXACTLY 4 parameters:
 *   (err, req, res, next)
 * Even if you don't use `next`, you must keep 4 args so Express recognizes it.
 *
 * Register this AFTER all routes in server.js — otherwise errors from routes won't reach it.
 */
const mongoose = require('mongoose');
const { sendError } = require('../utils/apiResponse');

function errorMiddleware(err, req, res, next) {
  // --- Mongoose ValidationError ---
  // Happens when schema rules fail: required field missing, number too small, etc.
  // err.errors is an object keyed by field name; each value has a .message string.
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors)
      .map((fieldError) => fieldError.message)
      .join(', ');
    return sendError(res, 400, 'Validation error', messages);
  }

  // --- Mongoose CastError ---
  // Happens when you pass invalid data type to a query, e.g. findById("not-an-object-id").
  // MongoDB expected a certain type (ObjectId, Number) but got something else.
  if (err instanceof mongoose.Error.CastError) {
    return sendError(res, 400, 'Invalid ID', err.message);
  }

  // --- MongoDB duplicate key (E11000) ---
  // Happens when unique index violated: duplicate email, duplicate appid, etc.
  // err.code === 11000 is MongoDB's standard duplicate key error code.
  if (err.code === 11000) {
    return sendError(res, 409, 'Duplicate key', 'A record with that unique field already exists');
  }

  // --- Custom errors from services ---
  // We can throw errors with err.statusCode = 404 or 409; use that if present.
  const statusCode = err.statusCode || 500;

  // Human-readable message for the client.
  const message = err.message || 'Internal server error';

  // In development, include stack trace in `error` field for debugging.
  // In production, hide stack traces — they reveal file paths and internals.
  const errorDetail =
    process.env.NODE_ENV === 'development' ? err.stack || message : message;

  return sendError(res, statusCode, message, errorDetail);
}

module.exports = errorMiddleware;
