/**
 * STEP 6 — game.service.js
 *
 * The SERVICE layer sits between controllers and the database.
 * Controllers handle HTTP (req/res); services handle business logic + Mongoose calls.
 *
 * Why separate services?
 *   - Controllers stay small and readable
 *   - Same logic can be reused from multiple routes
 *   - Easier to test database queries in isolation
 */
const Game = require('../models/Game'); // Mongoose model = compiled schema for the "games" collection.
const mongoose = require('mongoose'); // Used for ObjectId casting on embedded review subdocuments.

/**
 * BASE_FILTER — public APIs hide archived (soft-deleted) games.
 * Soft delete = set isArchived:true instead of removing the document from MongoDB.
 */
const BASE_FILTER = { isArchived: false };

/** Merge public filter with extra query conditions from controllers. */
function buildPublicQuery(extra = {}) {
  return { ...BASE_FILTER, ...extra };
}

/**
 * getAllGames — paginated list with dynamic filters and sort.
 *
 * MongoDB methods used:
 *   Game.find(filter)     — returns all documents matching filter (like SQL SELECT WHERE)
 *   .sort({ field: -1 })  — -1 = descending, 1 = ascending
 *   .skip(n)              — skip first n documents (pagination offset)
 *   .limit(m)             — return at most m documents
 *   .lean()               — plain JS objects (faster, no Mongoose document methods)
 *   Game.countDocuments()  — count matches without fetching full documents
 */
async function getAllGames(filters = {}, sortOption = {}, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const query = buildPublicQuery(filters);

  const [games, totalCount] = await Promise.all([
    Game.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
    Game.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCount / limit) || 1;
  return { games, totalCount, totalPages, currentPage: page };
}

/**
 * getGameById — fetch one game by Steam appid (NOT MongoDB _id).
 * We use appid because that is Steam's real-world identifier for a game.
 * findOne({ appid }) returns the first match or null — perfect for unique fields.
 */
async function getGameById(appid) {
  const id = Number(appid);
  return Game.findOne({ appid: id, ...BASE_FILTER }).lean();
}

/** Admin view — includes archived games (no isArchived filter). */
async function getGameByIdAdmin(appid) {
  return Game.findOne({ appid: Number(appid) }).lean();
}

/**
 * createGame — insert a new document.
 * Game.create(data) validates against the schema; throws ValidationError if rules fail.
 */
async function createGame(gameData) {
  return Game.create(gameData);
}

/**
 * updateGame — partial update (PATCH-style).
 *
 * findOneAndUpdate(filter, update, options):
 *   $set — only changes the fields you pass; leaves other fields untouched
 *   new: true — return the UPDATED document (default returns the old one)
 *   runValidators: true — run schema validation on the update (not just on create)
 */
async function updateGame(appid, updateData) {
  return Game.findOneAndUpdate(
    { appid: Number(appid) },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
}

/** replaceGame — full document replace (PUT-style). Overwrites the entire document shape. */
async function replaceGame(appid, fullDoc) {
  const id = Number(appid);
  const existing = await Game.findOne({ appid: id });
  if (!existing) return null;

  const { _id, __v, ...incoming } = fullDoc;
  const replacement = { ...incoming, appid: id };

  await Game.replaceOne({ appid: id }, replacement);
  return Game.findOne({ appid: id }).lean();
}

/**
 * deleteGame — HARD delete (permanent removal from collection).
 * findOneAndDelete finds and removes in one operation; returns the deleted doc.
 */
async function deleteGame(appid) {
  return Game.findOneAndDelete({ appid: Number(appid) }).lean();
}

/**
 * archiveGame — SOFT delete (better for production).
 * We only flip isArchived:true — data stays in DB for recovery/audit.
 */
async function archiveGame(appid) {
  return Game.findOneAndUpdate(
    { appid: Number(appid) },
    { $set: { isArchived: true } },
    { new: true, runValidators: true }
  ).lean();
}

/** restoreGame — undo soft delete. */
async function restoreGame(appid) {
  return Game.findOneAndUpdate(
    { appid: Number(appid) },
    { $set: { isArchived: false } },
    { new: true, runValidators: true }
  ).lean();
}

/** checkGameExists — Game.exists() is cheaper than findOne when you only need true/false. */
async function checkGameExists(appid) {
  const found = await Game.exists({ appid: Number(appid) });
  return !!found;
}

/** getGameSummary — return a small subset of fields for cards/previews. */
async function getGameSummary(appid) {
  const game = await getGameById(appid);
  if (!game) return null;
  const { title, rating, price, discount, downloads, genres, developer } = game;
  return { title, rating, price, discount, downloads, genres, developer };
}

/** getUpdateHistory — .select('updateHistory') fetches only that field (projection). */
async function getUpdateHistory(appid) {
  const game = await Game.findOne({ appid: Number(appid) }).select('updateHistory').lean();
  return game?.updateHistory || [];
}

/**
 * searchGames — case-insensitive text search using RegExp (regular expression).
 *
 * Regex in simple terms: a pattern that matches text flexibly.
 * Flag 'i' = case-insensitive ("action" matches "Action", "ACTION").
 * $or = match if ANY of the listed fields match the pattern.
 */
async function searchGames(query, page = 1, limit = 10) {
  if (!query || !query.trim()) {
    return getAllGames({}, { title: 1 }, page, limit);
  }

  const safe = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(safe, 'i');

  const filter = {
    ...BASE_FILTER,
    $or: [{ title: regex }, { developer: regex }, { tags: regex }],
  };

  const skip = (page - 1) * limit;
  const [games, totalCount] = await Promise.all([
    Game.find(filter).sort({ rating: -1 }).skip(skip).limit(limit).lean(),
    Game.countDocuments(filter),
  ]);

  return { games, totalCount, totalPages: Math.ceil(totalCount / limit) || 1, currentPage: page };
}

/**
 * getGamesByFilter — build filter objects dynamically in JavaScript.
 * The switch maps a field name (genre, developer, etc.) to the correct Mongo query shape.
 *
 * platforms.windows: true — dot notation queries nested object fields.
 */
async function getGamesByFilter(field, value, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  let filter = { ...BASE_FILTER };

  switch (field) {
    case 'genre':
      filter.genres = new RegExp(`^${value}$`, 'i');
      break;
    case 'developer':
      filter.developer = new RegExp(value, 'i');
      break;
    case 'publisher':
      filter.publisher = new RegExp(value, 'i');
      break;
    case 'tag':
      filter.tags = new RegExp(value, 'i');
      break;
    case 'platform': {
      const p = String(value).toLowerCase();
      if (['windows', 'mac', 'linux'].includes(p)) {
        filter[`platforms.${p}`] = true;
      }
      break;
    }
    default:
      filter = { ...BASE_FILTER };
  }

  const [games, totalCount] = await Promise.all([
    Game.find(filter).sort({ rating: -1 }).skip(skip).limit(limit).lean(),
    Game.countDocuments(filter),
  ]);

  return { games, totalCount, totalPages: Math.ceil(totalCount / limit) || 1, currentPage: page };
}

/** getGamesByYear — $gte (>=) and $lt (<) define a date range for one calendar year. */
async function getGamesByYear(year, page, limit) {
  const y = Number(year);
  const start = new Date(Date.UTC(y, 0, 1));
  const end = new Date(Date.UTC(y + 1, 0, 1));
  return getAllGames({ releaseDate: { $gte: start, $lt: end } }, { releaseDate: -1 }, page, limit);
}

async function getGamesByRating(rating, page, limit) {
  return getAllGames({ rating: { $gte: Number(rating) } }, { rating: -1 }, page, limit);
}

async function getGamesByPrice(price, page, limit) {
  return getAllGames({ price: Number(price) }, { price: 1 }, page, limit);
}

const FEATURE_MAP = {
  multiplayer: { isMultiplayer: true },
  singleplayer: { isSingleplayer: true },
  coop: { isCoop: true },
  'free-to-play': { isFreeToPlay: true },
  vr: { isVROnly: true },
  'early-access': { isEarlyAccess: true },
  'controller-support': { hasControllerSupport: true },
};

async function getGamesByFeature(featureKey, page, limit) {
  const key = String(featureKey).toLowerCase();
  const extra = FEATURE_MAP[key] || {};

  if (key === 'open-world') {
    return getAllGames({ tags: new RegExp('open world', 'i') }, { rating: -1 }, page, limit);
  }
  if (['survival', 'horror', 'anime', 'indie'].includes(key)) {
    return getAllGames({ tags: new RegExp(key, 'i') }, { rating: -1 }, page, limit);
  }
  return getAllGames(extra, { rating: -1 }, page, limit);
}

/**
 * getRelatedGames — find similar games by shared genres/tags.
 * $ne = not equal (exclude current game).
 * $in = field value must be in the provided array.
 */
async function getRelatedGames(appid, limit = 5) {
  const base = await Game.findOne({ appid: Number(appid) }).lean();
  if (!base) return [];

  const genreRegexList = (base.genres || []).map((g) => new RegExp(g, 'i'));
  const filter = {
    ...BASE_FILTER,
    appid: { $ne: Number(appid) },
    $or: [{ genres: { $in: genreRegexList } }, { tags: { $in: base.tags || [] } }],
  };

  return Game.find(filter).sort({ rating: -1 }).limit(limit).lean();
}

async function getRandomGame() {
  const count = await Game.countDocuments(BASE_FILTER);
  if (!count) return null;
  const skip = Math.floor(Math.random() * count);
  return Game.findOne(BASE_FILTER).skip(skip).lean();
}

/** addReview — $push appends a new object to the reviews array embedded in the game document. */
async function addReview(appid, { userId, text, rating }) {
  const review = { userId, text, rating, createdAt: new Date() };
  return Game.findOneAndUpdate(
    { appid: Number(appid) },
    { $push: { reviews: review } },
    { new: true, runValidators: true }
  ).lean();
}

/** updateReview — load document, find subdocument by _id, modify, save(). */
async function updateReview(appid, reviewId, patch) {
  const game = await Game.findOne({ appid: Number(appid) });
  if (!game) return null;

  const sub = game.reviews.id(new mongoose.Types.ObjectId(reviewId));
  if (!sub) return null;

  if (patch.text !== undefined) sub.text = patch.text;
  if (patch.rating !== undefined) sub.rating = patch.rating;
  await game.save();
  return game.toObject();
}

/** deleteReview — $pull removes array elements that match the condition. */
async function deleteReview(appid, reviewId) {
  return Game.findOneAndUpdate(
    { appid: Number(appid) },
    { $pull: { reviews: { _id: new mongoose.Types.ObjectId(reviewId) } } },
    { new: true }
  ).lean();
}

async function compareGames(id1, id2) {
  const [a, b] = await Promise.all([getGameById(id1), getGameById(id2)]);
  return { a, b };
}

async function recommendSimilar(appid, limit = 6) {
  return getRelatedGames(appid, limit);
}

/** listGamesAdmin — no isArchived filter; admins see everything. */
async function listGamesAdmin(page, limit) {
  const skip = (page - 1) * limit;
  const [games, totalCount] = await Promise.all([
    Game.find({}).sort({ appid: 1 }).skip(skip).limit(limit).lean(),
    Game.countDocuments({}),
  ]);
  return { games, totalCount, totalPages: Math.ceil(totalCount / limit) || 1, currentPage: page };
}

module.exports = {
  getAllGames,
  getGameById,
  getGameByIdAdmin,
  createGame,
  updateGame,
  replaceGame,
  deleteGame,
  archiveGame,
  restoreGame,
  checkGameExists,
  getGameSummary,
  getUpdateHistory,
  searchGames,
  getGamesByFilter,
  getGamesByYear,
  getGamesByRating,
  getGamesByPrice,
  getGamesByFeature,
  getRelatedGames,
  getRandomGame,
  addReview,
  updateReview,
  deleteReview,
  compareGames,
  recommendSimilar,
  listGamesAdmin,
};
