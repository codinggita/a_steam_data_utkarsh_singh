/**
 * Game model — a "model" is a compiled schema you query (Game.find, Game.create).
 * A "schema" describes the shape + validation rules for documents in the games collection.
 */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 10 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const updateHistorySchema = new mongoose.Schema(
  {
    version: String,
    notes: String,
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const gameSchema = new mongoose.Schema(
  {
    appid: { type: Number, required: true, unique: true }, // Steam numeric id — unique index for fast lookup.
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    developer: { type: String, trim: true },
    publisher: { type: String, trim: true },
    genres: [{ type: String, trim: true }], // Array of strings for multi-label classification.
    tags: [{ type: String, trim: true }],
    platforms: {
      windows: { type: Boolean, default: false },
      mac: { type: Boolean, default: false },
      linux: { type: Boolean, default: false },
    },
    releaseDate: { type: Date },
    price: { type: Number, min: 0, default: 0 }, // USD — Number for math (averages, filters).
    discount: { type: Number, min: 0, max: 100, default: 0 }, // Percent 0–100.
    rating: { type: Number, min: 0, max: 10, default: 0 },
    downloads: { type: Number, min: 0, default: 0 },
    isFreeToPlay: { type: Boolean, default: false },
    isMultiplayer: { type: Boolean, default: false },
    isSingleplayer: { type: Boolean, default: false },
    isCoop: { type: Boolean, default: false },
    hasControllerSupport: { type: Boolean, default: false },
    isVROnly: { type: Boolean, default: false },
    isEarlyAccess: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false }, // Soft delete flag — hide without losing data.
    screenshots: [{ type: String }],
    trailers: [{ type: String }],
    systemRequirements: {
      minimum: String,
      recommended: String,
    },
    dlc: [{ type: String }],
    achievements: [{ type: String }],
    reviews: [reviewSchema],
    updateHistory: [updateHistorySchema],
  },
  { timestamps: true } // Auto-manages createdAt + updatedAt on the parent document.
);

module.exports = mongoose.model('Game', gameSchema);
