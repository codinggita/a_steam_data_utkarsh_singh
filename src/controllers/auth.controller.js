/**
 * STEP 7 — auth.controller.js
 *
 * Handles user-facing authentication HTTP endpoints.
 *
 * req.body — JSON from client (name, email, password on register/login).
 * req.user — set by auth.middleware on protected routes (JWT decoded payload).
 *
 * Validation happens HERE (controller) before calling auth.service (business logic).
 */
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { registerUser, loginUser, stripUser } = require('../services/auth.service');
const User = require('../models/User');

// Basic email pattern check — catches obvious typos before hitting the database.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /auth/register
 * req.body: { name, email, password, role? }
 * Validates input → registerUser service → returns user (no password) + JWT token.
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return sendError(res, 400, 'Validation error', 'Missing fields');
  }
  if (!EMAIL_RE.test(email)) {
    return sendError(res, 400, 'Validation error', 'Invalid email format');
  }
  if (String(password).length < 6) {
    return sendError(res, 400, 'Validation error', 'Password must be at least 6 characters');
  }

  const { user, token } = await registerUser(name, email, password, role);
  return sendSuccess(res, 201, 'Registered', { user, token });
});

/**
 * POST /auth/login
 * req.body: { email, password }
 * Returns same shape as register — user object + token for Authorization header.
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, 'Validation error', 'Missing email or password');
  }

  const { user, token } = await loginUser(email, password);
  return sendSuccess(res, 200, 'Logged in', { user, token });
});

/**
 * POST /auth/logout
 * JWT is stateless — server has no session to destroy. Client deletes the token locally.
 */
exports.logout = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, 'Logout — remove token on client', { done: true });
});

/**
 * GET /auth/profile (protected)
 * req.user comes from auth.middleware after jwt.verify — we load full user from DB.
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) return sendError(res, 404, 'Not found', 'User not found');
  delete user.password;
  return sendSuccess(res, 200, 'Profile', { user });
});

/**
 * PATCH /auth/profile (protected)
 * Only name and email — never change password on this route (use changePassword).
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return sendError(res, 404, 'Not found', 'User not found');

  if (email && email !== user.email) {
    const taken = await User.findOne({ email });
    if (taken) return sendError(res, 409, 'Conflict', 'Email already in use');
    user.email = email;
  }
  if (name) user.name = name;

  await user.save();
  return sendSuccess(res, 200, 'Profile updated', { user: stripUser(user) });
});

/**
 * POST /auth/change-password (protected)
 * Verify old password → set new password → pre-save hook hashes it automatically.
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return sendError(res, 400, 'Validation error', 'Missing passwords');
  }
  if (String(newPassword).length < 6) {
    return sendError(res, 400, 'Validation error', 'New password too short');
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!user) return sendError(res, 404, 'Not found', 'User not found');

  const ok = await user.comparePassword(oldPassword);
  if (!ok) return sendError(res, 400, 'Invalid old password', 'Old password does not match');

  user.password = newPassword;
  await user.save();
  return sendSuccess(res, 200, 'Password changed', { done: true });
});
