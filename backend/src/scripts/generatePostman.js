/**
 * generatePostman.js
 *
 * Node script to automatically convert routesSpec.js and additional routes
 * into a complete, importable Postman Collection JSON file (v2.1.0).
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load routesSpec
const routesSpec = require('../config/routesSpec');

// Additional routes that are not in routesSpec.js
const additionalRoutes = [
  // ─── ANALYTICS ROUTES ──────────────────────────────────────────────────────
  {
    section: 'Analytics Routes',
    name: 'Top Rated Games Analytics',
    method: 'GET',
    path: '/api/v1/analytics/games/top-rated',
    description: 'Get analytics on the top-rated games in the catalog.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Analytics Routes',
    name: 'Most Downloaded Games Analytics',
    method: 'GET',
    path: '/api/v1/analytics/games/most-downloaded',
    description: 'Get analytics on the most-downloaded games in the catalog.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Analytics Routes',
    name: 'Revenue Analysis',
    method: 'GET',
    path: '/api/v1/analytics/games/revenue',
    description: 'Retrieve estimated revenue breakdown across the database games.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Analytics Routes',
    name: 'Platform Distribution Analytics',
    method: 'GET',
    path: '/api/v1/analytics/games/platform-distribution',
    description: 'Retrieve platform distribution breakdown (Windows, Mac, Linux).',
    isProtected: false,
    body: null,
  },
  {
    section: 'Analytics Routes',
    name: 'Genre Distribution Analytics',
    method: 'GET',
    path: '/api/v1/analytics/games/genre-distribution',
    description: 'Get genre popularity and representation breakdown.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Analytics Routes',
    name: 'Trending Games',
    method: 'GET',
    path: '/api/v1/analytics/games/trending',
    description: 'Get list of trending games with recent engagement metrics.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Analytics Routes',
    name: 'Release Trends',
    method: 'GET',
    path: '/api/v1/analytics/games/release-trends',
    description: 'Get statistics on release dates and volume by year/month.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Analytics Routes',
    name: 'User Activity Analytics',
    method: 'GET',
    path: '/api/v1/analytics/games/user-activity',
    description: 'Get overview of review rates, registration trends, and activity metrics.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Analytics Routes',
    name: 'Wishlist Analysis',
    method: 'GET',
    path: '/api/v1/analytics/games/wishlist-analysis',
    description: 'Analyze game additions and presence in wishlists.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Analytics Routes',
    name: 'Review Sentiment Analysis',
    method: 'GET',
    path: '/api/v1/analytics/games/review-analysis',
    description: 'Analyze review text sentiments and ratings breakdown.',
    isProtected: false,
    body: null,
  },

  // ─── STATS ROUTES ──────────────────────────────────────────────────────────
  {
    section: 'Stats Routes',
    name: 'Total Games Count',
    method: 'GET',
    path: '/api/v1/stats/games/count',
    description: 'Get the total number of games registered in the database.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Stats Routes',
    name: 'Top Rated Stats',
    method: 'GET',
    path: '/api/v1/stats/games/top-rated',
    description: 'Quick statistics overview of the highest-rated games.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Stats Routes',
    name: 'Most Downloaded Stats',
    method: 'GET',
    path: '/api/v1/stats/games/most-downloaded',
    description: 'Quick statistics overview of the most downloaded games.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Stats Routes',
    name: 'Average Game Price',
    method: 'GET',
    path: '/api/v1/stats/games/average-price',
    description: 'Calculate average game price across the entire catalog.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Stats Routes',
    name: 'Average Game Rating',
    method: 'GET',
    path: '/api/v1/stats/games/average-rating',
    description: 'Calculate average user ratings across the database.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Stats Routes',
    name: 'Genre Count Summary',
    method: 'GET',
    path: '/api/v1/stats/games/genre-count',
    description: 'Get counts of games grouped by individual genres.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Stats Routes',
    name: 'Platform Count Summary',
    method: 'GET',
    path: '/api/v1/stats/games/platform-count',
    description: 'Get counts of games grouped by supported platforms.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Stats Routes',
    name: 'Free to Play Games Count',
    method: 'GET',
    path: '/api/v1/stats/games/free-to-play-count',
    description: 'Count total number of free games in database.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Stats Routes',
    name: 'Multiplayer Games Count',
    method: 'GET',
    path: '/api/v1/stats/games/multiplayer-count',
    description: 'Count total number of multiplayer games.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Stats Routes',
    name: 'Monthly Releases Stats',
    method: 'GET',
    path: '/api/v1/stats/games/monthly-releases',
    description: 'Get release volume trends grouped by calendar months.',
    isProtected: false,
    body: null,
  },

  // ─── MISC GAME UTILITIES ───────────────────────────────────────────────────
  {
    section: 'Steam/Game Routes',
    name: 'Trending Games List',
    method: 'GET',
    path: '/api/v1/trending/games',
    description: 'Get list of trending games based on click/popularity algorithm.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Steam/Game Routes',
    name: 'Latest System News',
    method: 'GET',
    path: '/api/v1/news/latest',
    description: 'Retrieve news items from the platform feed.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Steam/Game Routes',
    name: 'Compare Games',
    method: 'GET',
    path: '/api/v1/compare/games/:id1/:id2',
    description: 'Compare metadata between two games side-by-side.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Steam/Game Routes',
    name: 'Get Recommendations for Game',
    method: 'GET',
    path: '/api/v1/recommendations/games/:appid',
    description: 'Get related recommendations based on a specific game.',
    isProtected: false,
    body: null,
  },
  {
    section: 'Steam/Game Routes',
    name: 'Check Game Existence',
    method: 'GET',
    path: '/api/v1/games/exists/:appid',
    description: 'Quick check if a game exists in database by application ID (appid).',
    isProtected: false,
    body: null,
  },
  {
    section: 'Steam/Game Routes',
    name: 'Soft Archive Game',
    method: 'PATCH',
    path: '/api/v1/games/:appid/archive',
    description: 'Soft-delete or archive a game (restoring is possible).',
    isProtected: true,
    body: null,
  },
  {
    section: 'Steam/Game Routes',
    name: 'Restore Archived Game',
    method: 'PATCH',
    path: '/api/v1/games/:appid/restore',
    description: 'Un-archive a previously soft-deleted game.',
    isProtected: true,
    body: null,
  },
  {
    section: 'Steam/Game Routes',
    name: 'Update Game reviews (PATCH)',
    method: 'PATCH',
    path: '/api/v1/games/:appid/reviews/:reviewId',
    description: 'Modify an existing user review for a specific game.',
    isProtected: true,
    body: {
      rating: 4,
      reviewText: 'Updated comment text.'
    },
  },
  {
    section: 'Steam/Game Routes',
    name: 'Delete Game review',
    method: 'DELETE',
    path: '/api/v1/games/:appid/reviews/:reviewId',
    description: 'Delete a submitted game review.',
    isProtected: true,
    body: null,
  }
];

// Combine all routes
const allRoutes = [...routesSpec, ...additionalRoutes];

// Group routes by section
const sectionsMap = {};
allRoutes.forEach(r => {
  const sec = r.section || 'General Routes';
  if (!sectionsMap[sec]) {
    sectionsMap[sec] = [];
  }
  // Avoid duplicating by method and path combination
  const alreadyExists = sectionsMap[sec].some(existing => existing.method === r.method && existing.path === r.path);
  if (!alreadyExists) {
    sectionsMap[sec].push(r);
  }
});

// Construct Postman Collection Item format
const items = Object.keys(sectionsMap).map(sectionName => {
  const folderItems = sectionsMap[sectionName].map(route => {
    // Headers
    const headers = [];
    if (route.method === 'POST' || route.method === 'PUT' || route.method === 'PATCH') {
      headers.push({
        key: 'Content-Type',
        value: 'application/json',
        type: 'text'
      });
    }
    if (route.isProtected) {
      headers.push({
        key: 'Authorization',
        value: 'Bearer {{token}}',
        type: 'text'
      });
    }

    // Body
    let body = null;
    if (route.body) {
      body = {
        mode: 'raw',
        raw: JSON.stringify(route.body, null, 2),
        options: {
          raw: {
            language: 'json'
          }
        }
      };
    }

    // URL Path parsing
    const rawPath = route.path;
    const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;
    const pathSegments = cleanPath.split('/').map(seg => {
      // replace express path params like :appid or :id1
      return seg;
    });

    // Check for variables in path segments
    const pathVariables = [];
    pathSegments.forEach(seg => {
      if (seg.startsWith(':')) {
        const varName = seg.slice(1);
        let defaultValue = '100001';
        if (varName === 'appid') defaultValue = '570'; // Default Dota 2 appid for testing
        if (varName === 'id') defaultValue = 'prod_90123';
        if (varName === 'id1') defaultValue = '10';
        if (varName === 'id2') defaultValue = '570';
        if (varName === 'reviewId') defaultValue = '64f89d8c9735d1001bc5ea77';
        if (varName === 'genre') defaultValue = 'Action';
        if (varName === 'developer') defaultValue = 'Valve';
        if (varName === 'publisher') defaultValue = 'Valve';
        if (varName === 'platform') defaultValue = 'windows';
        if (varName === 'tag') defaultValue = 'multiplayer';
        if (varName === 'year') defaultValue = '2013';
        if (varName === 'rating') defaultValue = '4';
        if (varName === 'price') defaultValue = '10';
        if (varName === 'feature') defaultValue = 'controller-support';

        pathVariables.push({
          key: varName,
          value: defaultValue,
          description: `Path parameter ${varName}`
        });
      }
    });

    const url = {
      raw: `{{baseUrl}}${rawPath}`,
      host: ['{{baseUrl}}'],
      path: pathSegments
    };

    if (pathVariables.length > 0) {
      url.variable = pathVariables;
    }

    return {
      name: route.name,
      request: {
        method: route.method,
        header: headers,
        body: body,
        url: url,
        description: route.description || ''
      },
      response: []
    };
  });

  return {
    name: sectionName,
    item: folderItems
  };
});

// Postman Collection JSON
const collection = {
  info: {
    _postman_id: crypto.randomUUID(),
    name: 'Steam Games API',
    description: 'Postman collection covering all authentication, games catalog, stats, and analytics endpoints of the Steam Games backend API.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  item: items,
  variable: [
    {
      key: 'baseUrl',
      value: 'http://localhost:5000',
      type: 'string'
    },
    {
      key: 'token',
      value: '',
      type: 'string',
      description: 'Paste your JWT token here after registering or logging in to test protected endpoints.'
    }
  ]
};

// Write output
const outputPath = path.join(__dirname, '../../Steam_Games_API_Postman_Collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf8');
console.log('Successfully generated Postman Collection at:', outputPath);
