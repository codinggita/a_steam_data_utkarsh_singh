/**
 * routesSpec.js
 *
 * This file serves as the single source of truth for the API Route Catalog (Swagger/OpenAPI ready).
 * It catalogs descriptions, expected request bodies, example responses, and HTTP status codes
 * for all routes inside the Node.js + Express backend.
 */

const routesSpec = [
  // ─── HEALTH & SYSTEM ROUTES ────────────────────────────────────────────────
  {
    section: 'Health Routes',
    name: 'Check Backend Health',
    method: 'GET',
    path: '/api/v1/health',
    description: 'Uptime check for load balancers, deployment status, and system monitoring.',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'Health',
      data: {
        status: 'ok',
        uptime: 120.45,
        timestamp: '2026-05-24T14:30:00.000Z'
      }
    },
    statusCodes: [
      { code: 200, description: 'Backend is healthy and responsive.' },
      { code: 500, description: 'Internal server error or database connection failure.' }
    ]
  },
  {
    section: 'Health Routes',
    name: 'System Runtime Info',
    method: 'GET',
    path: '/api/v1/system/info',
    description: 'Retrieve detailed system environment, Node.js version, and configuration variables.',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'System info',
      data: {
        version: '1.0.0',
        node: 'v20.11.0',
        environment: 'development'
      }
    },
    statusCodes: [
      { code: 200, description: 'Uptime system metadata returned.' }
    ]
  },
  {
    section: 'Health Routes',
    name: 'System Version Check',
    method: 'GET',
    path: '/api/v1/system/version',
    description: 'Check active deployment API version.',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'Version',
      data: {
        version: '1.0.0'
      }
    },
    statusCodes: [
      { code: 200, description: 'Current API version returned.' }
    ]
  },

  // ─── AUTHENTICATION ROUTES ────────────────────────────────────────────────
  {
    section: 'Auth Routes',
    name: 'Register User Account',
    method: 'POST',
    path: '/api/v1/auth/register',
    description: 'Register a new user account with secure password hashing.',
    isProtected: false,
    body: {
      username: 'gamer123',
      email: 'gamer123@example.com',
      password: 'SecurePassword123'
    },
    response: {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: '64f89d8c9735d1001bc5ea2a',
          username: 'gamer123',
          email: 'gamer123@example.com',
          role: 'user'
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    },
    statusCodes: [
      { code: 201, description: 'User account created and logged in successfully.' },
      { code: 400, description: 'Validation error (missing fields or duplicate username/email).' },
      { code: 429, description: 'Too many requests. Stricter authentication rate limits hit.' }
    ]
  },
  {
    section: 'Auth Routes',
    name: 'User Login',
    method: 'POST',
    path: '/api/v1/auth/login',
    description: 'Authenticate user credentials and retrieve a JSON Web Token (JWT).',
    isProtected: false,
    body: {
      email: 'gamer123@example.com',
      password: 'SecurePassword123'
    },
    response: {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: '64f89d8c9735d1001bc5ea2a',
          username: 'gamer123',
          email: 'gamer123@example.com',
          role: 'user'
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    },
    statusCodes: [
      { code: 200, description: 'Authentication successful. Returns authorization token.' },
      { code: 401, description: 'Invalid email or password.' },
      { code: 429, description: 'Stricter authentication rate limit exceeded.' }
    ]
  },
  {
    section: 'Auth Routes',
    name: 'User Logout',
    method: 'POST',
    path: '/api/v1/auth/logout',
    description: 'Logout user and invalidate the session (client-side token removal).',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'Logged out successfully',
      data: null
    },
    statusCodes: [
      { code: 200, description: 'Logout confirmation message returned.' }
    ]
  },

  // ─── USER ROUTES ──────────────────────────────────────────────────────────
  {
    section: 'User Routes',
    name: 'Fetch User Profile',
    method: 'GET',
    path: '/api/v1/auth/profile',
    description: 'Retrieve detailed information of the currently authenticated user.',
    isProtected: true,
    body: null,
    response: {
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: '64f89d8c9735d1001bc5ea2a',
          username: 'gamer123',
          email: 'gamer123@example.com',
          role: 'user',
          createdAt: '2026-05-24T00:00:00.000Z'
        }
      }
    },
    statusCodes: [
      { code: 200, description: 'User profile retrieved.' },
      { code: 401, description: 'Missing, malformed, or expired Authorization JWT.' }
    ]
  },
  {
    section: 'User Routes',
    name: 'Update User Profile',
    method: 'PATCH',
    path: '/api/v1/auth/profile',
    description: 'Modify specific fields of the logged-in user profile (e.g. username).',
    isProtected: true,
    body: {
      username: 'pro_gamer_99'
    },
    response: {
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: '64f89d8c9735d1001bc5ea2a',
          username: 'pro_gamer_99',
          email: 'gamer123@example.com',
          role: 'user'
        }
      }
    },
    statusCodes: [
      { code: 200, description: 'Profile successfully updated.' },
      { code: 400, description: 'Validation fails or username is already taken.' },
      { code: 401, description: 'Unauthorized access token.' }
    ]
  },
  {
    section: 'User Routes',
    name: 'Change Password',
    method: 'POST',
    path: '/api/v1/auth/change-password',
    description: 'Change the password of the active logged-in session securely.',
    isProtected: true,
    body: {
      currentPassword: 'OldPassword123',
      newPassword: 'NewSuperPassword789'
    },
    response: {
      success: true,
      message: 'Password changed successfully',
      data: null
    },
    statusCodes: [
      { code: 200, description: 'Password changed successfully.' },
      { code: 400, description: 'Current password mismatch or validation issues on new password.' },
      { code: 401, description: 'Unauthorized access.' }
    ]
  },
  {
    section: 'User Routes',
    name: 'JWT Profile Playground',
    method: 'GET',
    path: '/api/v1/jwt/profile',
    description: 'Retrieve profile details via standard JWT token payload demonstration.',
    isProtected: true,
    body: null,
    response: {
      success: true,
      message: 'JWT Profile parsed',
      data: {
        tokenPayload: {
          id: '64f89d8c9735d1001bc5ea2a',
          role: 'user',
          iat: 1779957000,
          exp: 1780561800
        }
      }
    },
    statusCodes: [
      { code: 200, description: 'JWT signature verified and parsed.' }
    ]
  },
  {
    section: 'User Routes',
    name: 'JWT Dashboard Playground',
    method: 'GET',
    path: '/api/v1/jwt/dashboard',
    description: 'Access protected dashboard statistics using JWT verification.',
    isProtected: true,
    body: null,
    response: {
      success: true,
      message: 'Welcome to the JWT Playground Dashboard',
      data: {
        authorizedStatus: 'active',
        allowedScopes: ['read', 'write']
      }
    },
    statusCodes: [
      { code: 200, description: 'Verified session dashboard access.' }
    ]
  },

  // ─── STEAM & GAME CATALOG ROUTES ──────────────────────────────────────────
  {
    section: 'Steam/Game Routes',
    name: 'Fetch All Games',
    method: 'GET',
    path: '/api/v1/games',
    description: 'Fetch lists of Steam games with dynamic search, pagination, genres, platforms, and sort parameters.',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'Fetched games successfully',
      data: {
        games: [
          {
            _id: '64f89d8c9735d1001bc5ea3f',
            appid: 10,
            name: 'Counter-Strike',
            developer: 'Valve',
            publisher: 'Valve',
            platforms: ['windows', 'mac', 'linux'],
            price: 9.99,
            genres: ['Action', 'FPS']
          }
        ],
        pagination: {
          total: 100,
          page: 1,
          limit: 10,
          totalPages: 10
        }
      }
    },
    statusCodes: [
      { code: 200, description: 'List of games returned matching query filters.' }
    ]
  },
  {
    section: 'Steam/Game Routes',
    name: 'Fetch Game by ID',
    method: 'GET',
    path: '/api/v1/games/:appid',
    description: 'Retrieve comprehensive details of a single Steam game by its application ID (appid).',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'Game details retrieved successfully',
      data: {
        game: {
          appid: 570,
          name: 'Dota 2',
          developer: 'Valve',
          publisher: 'Valve',
          price: 0.0,
          releaseDate: '2013-07-09T00:00:00.000Z',
          rating: 4.3,
          downloads: 12000000
        }
      }
    },
    statusCodes: [
      { code: 200, description: 'Game details returned.' },
      { code: 404, description: 'No game found with that appid.' }
    ]
  },
  {
    section: 'Steam/Game Routes',
    name: 'Search Games',
    method: 'GET',
    path: '/api/v1/search/games',
    description: 'Perform a case-insensitive fuzzy match across titles, developers, and tags using query query string `?q=keyword`.',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'Search completed',
      data: {
        results: [
          { appid: 570, name: 'Dota 2', rating: 4.3 }
        ]
      }
    },
    statusCodes: [
      { code: 200, description: 'Fuzzy search results array returned.' }
    ]
  },
  {
    section: 'Steam/Game Routes',
    name: 'Filter: Free to Play',
    method: 'GET',
    path: '/api/v1/games/filter/free-to-play',
    description: 'Quick preset query returning only games with a cost of 0.',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'Filtered Free to Play games',
      data: { count: 24, games: [{ name: 'Dota 2', price: 0 }] }
    },
    statusCodes: [
      { code: 200, description: 'Filter preset returned.' }
    ]
  },
  {
    section: 'Steam/Game Routes',
    name: 'Filter: VR Only',
    method: 'GET',
    path: '/api/v1/games/filter/vr-only',
    description: 'Fetch games that exclusively support Virtual Reality headsets.',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'VR games filter applied',
      data: { games: [{ name: 'Half-Life: Alyx' }] }
    },
    statusCodes: [
      { code: 200, description: 'VR games fetched.' }
    ]
  },
  {
    section: 'Steam/Game Routes',
    name: 'Get Random Game Recommendation',
    method: 'GET',
    path: '/api/v1/games/random',
    description: 'Pick a random game from the database (ideal for "Surprise me" UI widgets).',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'Random game picked',
      data: { name: 'Portal 2', appid: 620 }
    },
    statusCodes: [
      { code: 200, description: 'Random game returned.' }
    ]
  },
  {
    section: 'Steam/Game Routes',
    name: 'Submit Game Review',
    method: 'POST',
    path: '/api/v1/games/:appid/reviews',
    description: 'Add a review rating and text comment to a specific game. Updates average game score.',
    isProtected: true,
    body: {
      rating: 5,
      reviewText: 'Masterpiece of writing and puzzle design!'
    },
    response: {
      success: true,
      message: 'Review added successfully',
      data: {
        review: {
          id: '64f89d8c9735d1001bc5ea77',
          username: 'gamer123',
          rating: 5,
          reviewText: 'Masterpiece of writing and puzzle design!',
          createdAt: '2026-05-24T14:30:00.000Z'
        }
      }
    },
    statusCodes: [
      { code: 201, description: 'Review submitted.' },
      { code: 400, description: 'Validation failed (rating outside 1-5 range).' },
      { code: 401, description: 'Authorization header missing.' },
      { code: 404, description: 'Game does not exist.' }
    ]
  },

  // ─── ADMIN ROUTES ─────────────────────────────────────────────────────────
  {
    section: 'Admin Routes',
    name: 'Access Dashboard Metrics',
    method: 'GET',
    path: '/api/v1/admin/dashboard',
    description: 'Fetch administrative database metrics, total active users, and system server status.',
    isProtected: true,
    isAdmin: true,
    body: null,
    response: {
      success: true,
      message: 'Admin dashboard details retrieved',
      data: {
        userCount: 412,
        gameCount: 15430,
        activeConnections: 12,
        serverLoad: 'low'
      }
    },
    statusCodes: [
      { code: 200, description: 'Metrics retrieved.' },
      { code: 401, description: 'Missing admin login credentials.' },
      { code: 403, description: 'Forbidden. User is logged in but does not hold "admin" credentials.' }
    ]
  },
  {
    section: 'Admin Routes',
    name: 'Create Game Entry',
    method: 'POST',
    path: '/api/v1/games',
    description: 'Register a new game entry in the database catalog (Admins only).',
    isProtected: true,
    isAdmin: true,
    body: {
      appid: 999999,
      name: 'Indie Space Explorer',
      developer: 'CosmoDevs',
      publisher: 'IndieGalaxy',
      platforms: ['windows'],
      price: 14.99,
      genres: ['Adventure', 'Indie']
    },
    response: {
      success: true,
      message: 'Game created successfully',
      data: {
        game: {
          _id: '64f89d8c9735d1001bc5ea99',
          appid: 999999,
          name: 'Indie Space Explorer',
          price: 14.99
        }
      }
    },
    statusCodes: [
      { code: 201, description: 'Entry successfully added.' },
      { code: 400, description: 'Missing required field or duplicate appid.' },
      { code: 403, description: 'Forbidden admin access.' }
    ]
  },
  {
    section: 'Admin Routes',
    name: 'Delete Game Entry',
    method: 'DELETE',
    path: '/api/v1/games/:appid',
    description: 'Permanently remove a game from the active database.',
    isProtected: true,
    isAdmin: true,
    body: null,
    response: {
      success: true,
      message: 'Game deleted successfully',
      data: null
    },
    statusCodes: [
      { code: 200, description: 'Game deleted from MongoDB.' },
      { code: 404, description: 'Game with the specified appid not found.' }
    ]
  },

  // ─── PRODUCT & STORE METADATA ROUTES ──────────────────────────────────────
  {
    section: 'Product Routes',
    name: 'Fetch Store Products',
    method: 'GET',
    path: '/api/v1/products',
    description: 'Retrieve merchandise products, including gaming controllers, mousepads, posters, and virtual physical keys.',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'Digital & physical products retrieved successfully',
      data: {
        products: [
          {
            id: 'prod_90123',
            name: 'Steam-Ready Controller (V2)',
            category: 'Hardware',
            price: 59.99,
            stock: 45,
            image: '/assets/merch/controller.png'
          },
          {
            id: 'prod_90124',
            name: 'Dota 2 Collector Poster',
            category: 'Art',
            price: 15.0,
            stock: 120,
            image: '/assets/merch/dota_poster.png'
          }
        ]
      }
    },
    statusCodes: [
      { code: 200, description: 'List of store items returned.' }
    ]
  },
  {
    section: 'Product Routes',
    name: 'Fetch Product Details',
    method: 'GET',
    path: '/api/v1/products/:id',
    description: 'Retrieve inventory count and specification details of a specific store product.',
    isProtected: false,
    body: null,
    response: {
      success: true,
      message: 'Product retrieved',
      data: {
        product: {
          id: 'prod_90123',
          name: 'Steam-Ready Controller (V2)',
          price: 59.99,
          stock: 45,
          weight: '450g',
          features: ['Wireless bluetooth support', 'Haptic motors']
        }
      }
    },
    statusCodes: [
      { code: 200, description: 'Inventory metadata returned.' },
      { code: 404, description: 'Product item ID not registered.' }
    ]
  }
];

module.exports = routesSpec;
