/**
 * routeScanner.js
 *
 * Utility that dynamically inspects Express's active router stack at runtime.
 * Crawls through the master router and all mounted sub-routers (like /api/v1/games, etc.)
 * to extract live endpoints, HTTP methods, and routes.
 *
 * It then enriches these scanned routes with rich metadata defined in routesSpec.js.
 */

const routesSpec = require('../config/routesSpec');

/**
 * Clean and combine path segments, ensuring correct slashes
 */
function cleanPath(prefix, routePath) {
  const combined = `${prefix}/${routePath}`.replace(/\/+/g, '/');
  // Remove trailing slash if path is longer than "/"
  if (combined.length > 1 && combined.endsWith('/')) {
    return combined.slice(0, -1);
  }
  return combined;
}

/**
 * Extract the path prefix from an Express router layer regexp
 */
function getRouterPrefix(layer) {
  if (!layer.regexp) return '';
  if (layer.regexp.fast_slash) return '';

  const source = layer.regexp.source;
  
  // Typical Express mount regex: ^\/api\/v1\/games\/?(?=\/|$)
  // We want to capture the "api\/v1\/games" segment
  const match = source.match(/^\^\\\/([^\?\$]+)\\\/\?/);
  if (match && match[1]) {
    return '/' + match[1].replace(/\\/g, '');
  }

  // Fallback for other formats of express-path regexp
  const fallback = source.match(/^\^\\\/([^\?\$]+)/);
  if (fallback && fallback[1]) {
    let segment = fallback[1].replace(/\\/g, '');
    // Clean up trailing characters like '$' or regex anchors
    segment = segment.replace(/\$$/, '').replace(/\/\?$/, '');
    return '/' + segment;
  }

  return '';
}

/**
 * Crawl the router stack recursively
 */
function crawlRouter(router, prefix = '') {
  let routes = [];
  if (!router || !router.stack) return routes;

  router.stack.forEach((layer) => {
    if (layer.route) {
      // Direct route (e.g. router.get('/health', ...))
      const path = cleanPath(prefix, layer.route.path);
      const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());

      methods.forEach((method) => {
        // Avoid duplicates
        const alreadyExists = routes.some(r => r.path === path && r.method === method);
        if (!alreadyExists) {
          routes.push({ path, method });
        }
      });
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      // Mounted router (e.g. router.use('/api/v1/games', gameRouter))
      const routerPrefix = getRouterPrefix(layer);
      const combinedPrefix = cleanPath(prefix, routerPrefix);
      const subRoutes = crawlRouter(layer.handle, combinedPrefix);
      routes = routes.concat(subRoutes);
    }
  });

  return routes;
}

/**
 * Scan all active routes from the Express app, and merge them with detailed metadata
 * from routesSpec.js.
 *
 * @param {import('express').Application} app - Express application instance
 * @returns {Object} { total: number, sections: Object }
 */
function scanRoutes(app) {
  // 1. Crawl express router stack
  const liveRoutes = crawlRouter(app._router);

  // 2. Map scanned live routes to our detailed specification catalog
  const documentedRoutes = [];
  const undocumentedRoutes = [];

  liveRoutes.forEach((live) => {
    // Find matching documentation in routesSpec.js
    // Be robust with comparison (match path and method)
    const spec = routesSpec.find(s => {
      // Standardize paths for comparison (e.g. remove dynamic param name differences if needed)
      const cleanLivePath = live.path.toLowerCase().replace(/:\w+/g, ':param');
      const cleanSpecPath = s.path.toLowerCase().replace(/:\w+/g, ':param');
      return cleanLivePath === cleanSpecPath && s.method.toUpperCase() === live.method.toUpperCase();
    });

    if (spec) {
      documentedRoutes.push({
        ...spec,
        // Override with the exact live path case/parameters used in Express
        path: live.path,
        isLive: true
      });
    } else {
      // If it is registered but undocumented, still list it to ensure 100% dynamic route counting!
      // This enforces "Automatically register all routes" and "Show total number of routes".
      let section = 'Other Routes';
      if (live.path.startsWith('/api/v1/games/filter')) {
        section = 'Steam/Game Routes';
      } else if (live.path.startsWith('/api/v1/games/sort') || live.path.startsWith('/api/v1/games/genre') || live.path.startsWith('/api/v1/games/developer') || live.path.startsWith('/api/v1/games/publisher') || live.path.startsWith('/api/v1/games/platform') || live.path.startsWith('/api/v1/games/tag') || live.path.startsWith('/api/v1/games/release-year') || live.path.startsWith('/api/v1/games/rating') || live.path.startsWith('/api/v1/games/price') || live.path.startsWith('/api/v1/games/feature')) {
        section = 'Steam/Game Routes';
      } else if (live.path.startsWith('/api/v1/games')) {
        section = 'Steam/Game Routes';
      } else if (live.path.startsWith('/api/v1/auth')) {
        section = 'Auth Routes';
      } else if (live.path.startsWith('/api/v1/admin')) {
        section = 'Admin Routes';
      } else if (live.path.startsWith('/api/v1/analytics')) {
        section = 'Steam/Game Routes';
      } else if (live.path.startsWith('/api/v1/stats')) {
        section = 'Steam/Game Routes';
      } else if (live.path.startsWith('/api/v1/search')) {
        section = 'Steam/Game Routes';
      } else if (live.path.startsWith('/api/v1/jwt')) {
        section = 'User Routes';
      }

      undocumentedRoutes.push({
        section,
        name: `Dynamic Route (${live.method})`,
        method: live.method,
        path: live.path,
        description: 'Auto-registered live route from server stack.',
        isProtected: live.path.includes('/admin') || live.path.includes('/profile') || live.path.includes('/dashboard'),
        isAdmin: live.path.includes('/admin'),
        body: null,
        response: { success: true, message: 'Endpoint matched successfully', data: {} },
        statusCodes: [{ code: 200, description: 'Route matched successfully.' }],
        isLive: true,
        isUndocumented: true
      });
    }
  });

  // Combine both documented and dynamically discovered routes
  const allRoutes = [...documentedRoutes, ...undocumentedRoutes];

  // 3. Group routes by sections
  const sectionsMap = {};
  allRoutes.forEach((route) => {
    if (!sectionsMap[route.section]) {
      sectionsMap[route.section] = [];
    }
    sectionsMap[route.section].push(route);
  });

  // Sort sections and routes inside sections logically
  const orderedSections = {};
  const sectionPriority = [
    'Health Routes',
    'Auth Routes',
    'User Routes',
    'Steam/Game Routes',
    'Admin Routes',
    'Product Routes',
    'Other Routes'
  ];

  // Mount sections in designated order
  sectionPriority.forEach((secName) => {
    if (sectionsMap[secName]) {
      orderedSections[secName] = sectionsMap[secName].sort((a, b) => {
        // Sort GET first, then by path
        if (a.method === 'GET' && b.method !== 'GET') return -1;
        if (a.method !== 'GET' && b.method === 'GET') return 1;
        return a.path.localeCompare(b.path);
      });
    }
  });

  // Pick up any sections not listed in priority
  Object.keys(sectionsMap).forEach((secName) => {
    if (!orderedSections[secName]) {
      orderedSections[secName] = sectionsMap[secName];
    }
  });

  return {
    totalCount: allRoutes.length,
    sections: orderedSections
  };
}

module.exports = scanRoutes;
