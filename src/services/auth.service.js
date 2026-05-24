/**
 * STEP 6 — auth.service.js
 *
 * Authentication business logic: register, login, JWT creation.
 * Controllers validate HTTP input; this file talks to User model + jwt library.
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * generateToken — create a signed JWT the client sends back on protected requests.
 *
 * JWT payload = the data encoded inside the token (NOT encrypted — just base64).
 *   { id, role } — enough for auth middleware to know WHO and WHAT ROLE.
 *
 * jwt.sign(payload, secret, { expiresIn }) — "signing" means:
 *   Only someone with JWT_SECRET can create a valid token.
 *   If a user edits the payload, verification fails (tamper detection).
 *
 * expiresIn examples: '7d' (7 days), '1h' (1 hour), '30m' (30 minutes).
 */
function generateToken(userId, role) {
  const payload = { id: userId, role };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

/** Remove password hash before sending user object to the client — never leak secrets. */
function stripUser(userDoc) {
  const obj = userDoc.toObject ? userDoc.toObject() : userDoc;
  delete obj.password;
  return obj;
}

/**
 * registerUser — create account + return token.
 *
 * Flow:
 *   1) Check email uniqueness (findOne)
 *   2) User.create — password hashed automatically by pre-save hook in User model
 *   3) generateToken — client can immediately call protected routes
 */
async function registerUser(name, email, password, role = 'user') {
  const exists = await User.findOne({ email }).lean();
  if (exists) {
    const err = new Error('Email already registered');
    err.statusCode = 409; // 409 Conflict — duplicate resource
    throw err;
  }

  const safeRole = role === 'admin' ? 'user' : role;
  const user = await User.create({ name, email, password, role: safeRole });
  const token = generateToken(user._id, user.role);

  return { user: stripUser(user), token };
}

/**
 * loginUser — verify credentials + return token.
 *
 * Flow:
 *   1) findOne by email with .select('+password') — password is hidden by default in schema
 *   2) comparePassword — bcrypt compares plain text to stored hash
 *   3) generateToken on success
 */
async function loginUser(email, password) {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user._id, user.role);
  return { user: stripUser(user), token };
}

module.exports = { registerUser, loginUser, generateToken, stripUser };
