/**
 * User model — stores accounts. Passwords are hashed; we never store plain text.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // bcryptjs is pure JS; same API as bcrypt.

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false }, // select:false hides password unless .select('+password')
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true }
);

/**
 * pre('save') runs before a document is written — perfect for hashing a new password once.
 * We only re-hash when the password field was modified (e.g. register or change password).
 */
userSchema.pre('save', async function hashPasswordIfNeeded(next) {
  if (!this.isModified('password')) return next(); // Skip work on unrelated field updates.
  const salt = await bcrypt.genSalt(10); // Salt makes identical passwords produce different hashes.
  this.password = await bcrypt.hash(this.password, salt); // One-way transform — cannot "decode" back.
  next();
});

/**
 * Instance method — call on a loaded user: await user.comparePassword('typedPassword')
 * Returns true if the candidate matches the stored hash.
 */
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
