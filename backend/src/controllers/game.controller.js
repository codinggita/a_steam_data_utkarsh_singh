/**
 * STEP 7 — game.controller.js
 *
 * Controllers = the HTTP layer. They receive the request, call services, send JSON back.
 *
 * Three ways Express gives you data from the client:
 *   req.query  — URL search params after ?  e.g. GET /games?genre=action&page=2
 *   req.params — path placeholders         e.g. GET /games/:appid  → req.params.appid
 *   req.body   — JSON body (POST/PUT/PATCH) parsed by express.json() middleware
 *
 * Every handler is wrapped in asyncHandler (Step 4) so errors reach error middleware.
 * Responses use sendSuccess / sendError (Step 4) for consistent JSON shape.
 */
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { getPagination } = require('../utils/pagination');
const gameService = require('../services/game.service');

/**
 * buildFilters — turn ?genre=action&minPrice=10&maxPrice=50 into a MongoDB filter object.
 * Controllers build the filter; game.service runs find() with it.
 */
function buildFilters(query) {
  const f = {};
  if (query.genre) f.genres = new RegExp(query.genre, 'i');
  if (query.developer) f.developer = new RegExp(query.developer, 'i');
  if (query.publisher) f.publisher = new RegExp(query.publisher, 'i');
  if (query.tag) f.tags = new RegExp(query.tag, 'i');
  if (query.platform) {
    const p = String(query.platform).toLowerCase();
    if (['windows', 'mac', 'linux'].includes(p)) f[`platforms.${p}`] = true;
  }
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    f.price = {};
    if (query.minPrice !== undefined) f.price.$gte = Number(query.minPrice); // $gte = greater-or-equal numeric filter.
    if (query.maxPrice !== undefined) f.price.$lte = Number(query.maxPrice); // $lte = less-or-equal.
  }
  if (query.rating !== undefined) f.rating = { $gte: Number(query.rating) };
  if (query.releaseYear) {
    const y = Number(query.releaseYear);
    f.releaseDate = { $gte: new Date(Date.UTC(y, 0, 1)), $lt: new Date(Date.UTC(y + 1, 0, 1)) };
  }
  if (query.discount !== undefined) f.discount = { $gte: Number(query.discount) };
  if (query.multiplayer === 'true') f.isMultiplayer = true;
  if (query.freeToPlay === 'true') f.isFreeToPlay = true;
  return f;
}

/** buildSort — map ?sort=rating to Mongo sort object { rating: -1 }. */
function buildSort(sortKey) {
  const key = (sortKey || 'title').toLowerCase();
  const map = {
    rating: { rating: -1 },
    price: { price: 1 },
    downloads: { downloads: -1 },
    releasedate: { releaseDate: -1 },
    popularity: { rating: -1, downloads: -1 },
    title: { title: 1 },
  };
  return map[key] || { title: 1 };
}

// ─── Core CRUD ───────────────────────────────────────────────────────────────

exports.getAllGames = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query); // req.query from URL: ?page=1&limit=10
  const filters = buildFilters(req.query);
  const sort = buildSort(req.query.sort);
  const { games, totalCount, totalPages, currentPage } = await gameService.getAllGames(filters, sort, page, limit);
  return sendSuccess(res, 200, 'Games fetched', { games, totalCount, totalPages, currentPage, limit });
});

// ─── Single game & nested resources (req.params.appid) ───────────────────────

exports.getGameById = asyncHandler(async (req, res) => {
  const game = await gameService.getGameById(req.params.appid);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'Game fetched', { game });
});

exports.createGame = asyncHandler(async (req, res) => {
  const game = await gameService.createGame(req.body);
  return sendSuccess(res, 201, 'Game created', { game });
});

exports.updateGame = asyncHandler(async (req, res) => {
  const game = await gameService.updateGame(req.params.appid, req.body);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'Game updated', { game });
});

exports.replaceGame = asyncHandler(async (req, res) => {
  const game = await gameService.replaceGame(req.params.appid, req.body);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'Game replaced', { game });
});

exports.deleteGame = asyncHandler(async (req, res) => {
  const game = await gameService.deleteGame(req.params.appid);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'Game deleted', { game });
});

exports.checkGameExists = asyncHandler(async (req, res) => {
  const exists = await gameService.checkGameExists(req.params.appid);
  return sendSuccess(res, 200, 'Checked', { exists });
});

exports.getGameSummary = asyncHandler(async (req, res) => {
  const summary = await gameService.getGameSummary(req.params.appid);
  if (!summary) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'Summary', { summary });
});

exports.getUpdateHistory = asyncHandler(async (req, res) => {
  const history = await gameService.getUpdateHistory(req.params.appid);
  return sendSuccess(res, 200, 'Update history', { history });
});

exports.archiveGame = asyncHandler(async (req, res) => {
  const game = await gameService.archiveGame(req.params.appid);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'Game archived', { game });
});

exports.restoreGame = asyncHandler(async (req, res) => {
  const game = await gameService.restoreGame(req.params.appid);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'Game restored', { game });
});

exports.getRelatedGames = asyncHandler(async (req, res) => {
  const { limit } = getPagination(req.query);
  const games = await gameService.getRelatedGames(req.params.appid, limit);
  return sendSuccess(res, 200, 'Related games', { games });
});

exports.getScreenshots = asyncHandler(async (req, res) => {
  const game = await gameService.getGameById(req.params.appid);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'Screenshots', { screenshots: game.screenshots || [] });
});

exports.getTrailers = asyncHandler(async (req, res) => {
  const game = await gameService.getGameById(req.params.appid);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'Trailers', { trailers: game.trailers || [] });
});

// ─── Reviews (req.body + req.user from auth middleware on POST) ──────────────

exports.getReviews = asyncHandler(async (req, res) => {
  const game = await gameService.getGameById(req.params.appid);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'Reviews', { reviews: game.reviews || [] });
});

exports.addReview = asyncHandler(async (req, res) => {
  const { text, rating } = req.body;
  const game = await gameService.addReview(req.params.appid, { userId: req.user.id, text, rating });
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 201, 'Review added', { game });
});

exports.updateReview = asyncHandler(async (req, res) => {
  const game = await gameService.updateReview(req.params.appid, req.params.reviewId, req.body);
  if (!game) return sendError(res, 404, 'Not found', 'Game or review not found');
  return sendSuccess(res, 200, 'Review updated', { game });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const game = await gameService.deleteReview(req.params.appid, req.params.reviewId);
  if (!game) return sendError(res, 404, 'Not found', 'Game or review not found');
  return sendSuccess(res, 200, 'Review deleted', { game });
});

exports.getSystemRequirements = asyncHandler(async (req, res) => {
  const game = await gameService.getGameById(req.params.appid);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'System requirements', { systemRequirements: game.systemRequirements || {} });
});

exports.getDLC = asyncHandler(async (req, res) => {
  const game = await gameService.getGameById(req.params.appid);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'DLC', { dlc: game.dlc || [] });
});

exports.getAchievements = asyncHandler(async (req, res) => {
  const game = await gameService.getGameById(req.params.appid);
  if (!game) return sendError(res, 404, 'Not found', 'Game not found');
  return sendSuccess(res, 200, 'Achievements', { achievements: game.achievements || [] });
});

exports.getUpdates = asyncHandler(async (req, res) => {
  const history = await gameService.getUpdateHistory(req.params.appid);
  return sendSuccess(res, 200, 'Updates', { updates: history });
});

// ─── List by path param (req.params.genre, .developer, etc.) ─────────────────

function listByField(field, paramName) {
  return asyncHandler(async (req, res) => {
    const { page, limit } = getPagination(req.query);
    const raw = req.params[paramName];
    const result = await gameService.getGamesByFilter(field, decodeURIComponent(raw), page, limit);
    return sendSuccess(res, 200, 'Games', result);
  });
}

exports.getGamesByGenre = listByField('genre', 'genre');
exports.getGamesByDeveloper = listByField('developer', 'developer');
exports.getGamesByPublisher = listByField('publisher', 'publisher');
exports.getGamesByPlatform = listByField('platform', 'platform');
exports.getGamesByTag = listByField('tag', 'tag');

exports.getGamesByYear = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getGamesByYear(req.params.year, page, limit);
  return sendSuccess(res, 200, 'Games by year', result);
});

exports.getGamesByRating = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getGamesByRating(req.params.rating, page, limit);
  return sendSuccess(res, 200, 'Games by rating', result);
});

exports.getGamesByPrice = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getGamesByPrice(req.params.price, page, limit);
  return sendSuccess(res, 200, 'Games by price', result);
});

exports.getGamesByFeature = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getGamesByFeature(req.params.feature, page, limit);
  return sendSuccess(res, 200, 'Games by feature', result);
});

// ─── Preset sort routes (req.query page/limit only) ──────────────────────────

function sortRoute(sortOption, label) {
  return asyncHandler(async (req, res) => {
    const { page, limit } = getPagination(req.query);
    const result = await gameService.getAllGames({}, sortOption, page, limit);
    return sendSuccess(res, 200, label, result);
  });
}

exports.sortByPriceDesc = sortRoute({ price: -1 }, 'Sorted by price desc');
exports.sortByRatingDesc = sortRoute({ rating: -1 }, 'Sorted by rating desc');
exports.sortByDownloadsDesc = sortRoute({ downloads: -1 }, 'Sorted by downloads desc');
exports.sortByReleaseDateDesc = sortRoute({ releaseDate: -1 }, 'Sorted by release date desc');
exports.sortByPopularityDesc = sortRoute({ rating: -1, downloads: -1 }, 'Sorted by popularity desc');

exports.getRandomGame = asyncHandler(async (req, res) => {
  const game = await gameService.getRandomGame();
  if (!game) return sendError(res, 404, 'Not found', 'No games in database');
  return sendSuccess(res, 200, 'Random game', { game });
});

// ─── Preset filter routes (used by /api/v1/games/filter/*) ───────────────────

exports.filterFreeToPlay = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ isFreeToPlay: true }, { downloads: -1 }, page, limit);
  return sendSuccess(res, 200, 'Free to play', result);
});

exports.filterPaid = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ isFreeToPlay: false, price: { $gt: 0 } }, { price: -1 }, page, limit);
  return sendSuccess(res, 200, 'Paid games', result);
});

exports.filterDiscounted = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ discount: { $gt: 0 } }, { discount: -1 }, page, limit);
  return sendSuccess(res, 200, 'Discounted games', result);
});

exports.filterEarlyAccess = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ isEarlyAccess: true }, { rating: -1 }, page, limit);
  return sendSuccess(res, 200, 'Early access', result);
});

exports.filterVROnly = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ isVROnly: true }, { rating: -1 }, page, limit);
  return sendSuccess(res, 200, 'VR only', result);
});

exports.filterControllerSupport = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ hasControllerSupport: true }, { rating: -1 }, page, limit);
  return sendSuccess(res, 200, 'Controller support', result);
});

exports.filterMultiplayer = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ isMultiplayer: true }, { downloads: -1 }, page, limit);
  return sendSuccess(res, 200, 'Multiplayer', result);
});

exports.filterSingleplayer = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ isSingleplayer: true }, { rating: -1 }, page, limit);
  return sendSuccess(res, 200, 'Singleplayer', result);
});

exports.filterCoop = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ isCoop: true }, { rating: -1 }, page, limit);
  return sendSuccess(res, 200, 'Co-op', result);
});

exports.filterOpenWorld = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ tags: new RegExp('open world', 'i') }, { rating: -1 }, page, limit);
  return sendSuccess(res, 200, 'Open world', result);
});

exports.filterSurvival = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ tags: new RegExp('survival', 'i') }, { rating: -1 }, page, limit);
  return sendSuccess(res, 200, 'Survival', result);
});

exports.filterHorror = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ tags: new RegExp('horror', 'i') }, { rating: -1 }, page, limit);
  return sendSuccess(res, 200, 'Horror', result);
});

exports.filterAnime = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ tags: new RegExp('anime', 'i') }, { rating: -1 }, page, limit);
  return sendSuccess(res, 200, 'Anime', result);
});

exports.filterIndie = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ tags: new RegExp('indie', 'i') }, { rating: -1 }, page, limit);
  return sendSuccess(res, 200, 'Indie', result);
});

exports.filterTopRated = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const result = await gameService.getAllGames({ rating: { $gte: 8 } }, { rating: -1 }, page, limit);
  return sendSuccess(res, 200, 'Top rated', result);
});

// ─── Misc (compare, recommendations, search, trending) ─────────────────────

exports.compareGames = asyncHandler(async (req, res) => {
  const { id1, id2 } = req.params;
  const { a, b } = await gameService.compareGames(id1, id2);
  if (!a || !b) return sendError(res, 404, 'Not found', 'One or both games missing');
  return sendSuccess(res, 200, 'Comparison', { games: [a, b] });
});

exports.getRecommendations = asyncHandler(async (req, res) => {
  const games = await gameService.recommendSimilar(req.params.appid, 8);
  return sendSuccess(res, 200, 'Recommendations', { games });
});

exports.getTopTrendingGames = asyncHandler(async (req, res) => {
  const analytics = require('../services/analytics.service');
  const games = await analytics.getTrendingGames(10);
  return sendSuccess(res, 200, 'Trending games', { games });
});

exports.searchGames = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const q = req.query.q || '';
  const result = await gameService.searchGames(q, page, limit);
  return sendSuccess(res, 200, 'Search results', result);
});
