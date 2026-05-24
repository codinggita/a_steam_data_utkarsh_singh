/**
 * homepageRenderer.js
 *
 * Generates a premium, high-end, responsive HTML landing page for the developer API.
 * Uses slate-dark aesthetic with dynamic glowing chips, micro-animations,
 * instant client-side searching, filtering, and interactive collapsible payload viewers.
 */

function renderHtmlHomepage(scanResult, dbState, uptimeSeconds) {
  // Dynamic calculation of database state badge
  let dbBadgeColor = '#ef5350'; // Red
  let dbBadgeText = 'Disconnected';
  let dbPulseClass = 'pulse-red';
  
  if (dbState === 1) {
    dbBadgeColor = '#26a69a'; // Teal/Green
    dbBadgeText = 'Connected';
    dbPulseClass = 'pulse-green';
  } else if (dbState === 2) {
    dbBadgeColor = '#ffb300'; // Amber
    dbBadgeText = 'Connecting';
    dbPulseClass = 'pulse-amber';
  }

  // Convert uptime to human-readable format
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  const uptimeText = `${hours}h ${minutes}m ${seconds}s`;

  // Render sections
  let sectionsHtml = '';
  
  Object.keys(scanResult.sections).forEach((sectionName) => {
    const routes = scanResult.sections[sectionName];
    
    sectionsHtml += `
      <div class="route-section" data-section="${sectionName}">
        <h2 class="section-title">${sectionName} <span class="section-count">${routes.length}</span></h2>
        <div class="cards-grid">
    `;

    routes.forEach((route, idx) => {
      const cardId = `card-${sectionName.replace(/\s+/g, '-').toLowerCase()}-${idx}`;
      
      // Determine HTTP Method badge color
      let methodColorClass = 'method-get';
      if (route.method === 'POST') methodColorClass = 'method-post';
      else if (route.method === 'PUT') methodColorClass = 'method-put';
      else if (route.method === 'PATCH') methodColorClass = 'method-patch';
      else if (route.method === 'DELETE') methodColorClass = 'method-delete';

      // Security Badges
      let securityBadges = '';
      if (route.isAdmin) {
        securityBadges = `<span class="badge badge-admin"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/></svg> Admin Only</span>`;
      } else if (route.isProtected) {
        securityBadges = `<span class="badge badge-protected"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg> Token Required</span>`;
      } else {
        securityBadges = `<span class="badge badge-public"><svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> Public</span>`;
      }

      // Check if clickable link for GET routes
      const isGet = route.method === 'GET';
      const isDynamicPath = route.path.includes(':');
      let linkHtml = '';

      if (isGet) {
        if (isDynamicPath) {
          // Dynamic path needs mock param filled to click
          // e.g. /api/v1/games/:appid -> /api/v1/games/10
          let mockUrl = route.path;
          if (route.path.includes(':appid')) mockUrl = route.path.replace(':appid', '10');
          else if (route.path.includes(':genre')) mockUrl = route.path.replace(':genre', 'Action');
          else if (route.path.includes(':developer')) mockUrl = route.path.replace(':developer', 'Valve');
          else if (route.path.includes(':publisher')) mockUrl = route.path.replace(':publisher', 'Valve');
          else if (route.path.includes(':platform')) mockUrl = route.path.replace(':platform', 'windows');
          else if (route.path.includes(':tag')) mockUrl = route.path.replace(':tag', 'Multiplayer');
          else if (route.path.includes(':year')) mockUrl = route.path.replace(':year', '2020');
          else if (route.path.includes(':rating')) mockUrl = route.path.replace(':rating', '4.0');
          else if (route.path.includes(':price')) mockUrl = route.path.replace(':price', 'free');
          else if (route.path.includes(':feature')) mockUrl = route.path.replace(':feature', 'coop');
          else if (route.path.includes(':id1') && route.path.includes(':id2')) mockUrl = route.path.replace(':id1', '10').replace(':id2', '20');
          else if (route.path.includes(':id')) mockUrl = route.path.replace(':id', 'prod_90123');
          else if (route.path.includes(':reviewId')) mockUrl = route.path.replace(':reviewId', 'rev123');

          linkHtml = `<a href="${mockUrl}" target="_blank" class="test-link" title="Open demo GET query in new tab"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg> Open Demo</a>`;
        } else {
          // Static path direct click
          linkHtml = `<a href="${route.path}" target="_blank" class="test-link" title="Open query in new tab"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg> Test Route</a>`;
        }
      }

      // Expected Request Body
      let requestBodyHtml = '';
      if (route.body) {
        requestBodyHtml = `
          <div class="payload-block">
            <div class="payload-header">
              <span>Expected Request Body (JSON)</span>
              <button class="copy-btn" onclick="copyText('${cardId}-body-code')">Copy Payload</button>
            </div>
            <pre><code id="${cardId}-body-code" class="json-code">${JSON.stringify(route.body, null, 2)}</code></pre>
          </div>
        `;
      }

      // Response payload
      let responsePayloadHtml = '';
      if (route.response) {
        responsePayloadHtml = `
          <div class="payload-block">
            <div class="payload-header">
              <span>Response Example</span>
              <button class="copy-btn" onclick="copyText('${cardId}-res-code')">Copy JSON</button>
            </div>
            <pre><code id="${cardId}-res-code" class="json-code">${JSON.stringify(route.response, null, 2)}</code></pre>
          </div>
        `;
      }

      // Status Codes list
      let statusCodesHtml = '';
      if (route.statusCodes && route.statusCodes.length > 0) {
        statusCodesHtml = `
          <div class="status-codes-block">
            <div class="block-title">Status Codes</div>
            <table class="status-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${route.statusCodes.map(sc => `
                  <tr>
                    <td><span class="status-badge status-${sc.code.toString().charAt(0)}xx">${sc.code}</span></td>
                    <td>${sc.description}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }

      sectionsHtml += `
        <div class="route-card" data-search="${route.name.toLowerCase()} ${route.path.toLowerCase()} ${route.description.toLowerCase()}">
          <div class="card-summary" onclick="toggleCard('${cardId}')">
            <div class="method-path-group">
              <span class="method-badge ${methodColorClass}">${route.method}</span>
              <span class="path-text" title="Click to copy path" onclick="copyPath(event, '${route.path}')">${route.path}</span>
            </div>
            <div class="card-meta">
              <span class="route-name">${route.name}</span>
              <div class="badges-group">
                ${securityBadges}
                ${linkHtml}
              </div>
              <span class="accordion-arrow">
                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
              </span>
            </div>
          </div>
          
          <div id="${cardId}" class="card-details-wrapper">
            <div class="card-details">
              <div class="route-desc">${route.description}</div>
              
              <div class="payloads-grid">
                ${requestBodyHtml}
                ${responsePayloadHtml}
              </div>
              
              ${statusCodesHtml}
            </div>
          </div>
        </div>
      `;
    });

    sectionsHtml += `
        </div>
      </div>
    `;
  });

  // Master Template
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Steam Games Backend API Portal</title>
  <!-- Google Fonts Outfit & Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg-color: #0c1017;
      --bg-surface: rgba(22, 28, 38, 0.7);
      --bg-surface-hover: rgba(29, 37, 51, 0.85);
      --border-color: rgba(255, 255, 255, 0.05);
      --text-main: #f0f4f9;
      --text-muted: #8b9bb4;
      --primary: #00ffcc;
      --primary-glow: rgba(0, 255, 204, 0.15);
      
      --color-get: #00e676;
      --color-post: #2979ff;
      --color-put: #ff9100;
      --color-patch: #00e5ff;
      --color-delete: #ff1744;
      
      --bg-get: rgba(0, 230, 118, 0.08);
      --bg-post: rgba(41, 121, 255, 0.08);
      --bg-put: rgba(255, 145, 0, 0.08);
      --bg-patch: rgba(0, 229, 255, 0.08);
      --bg-delete: rgba(255, 23, 68, 0.08);
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: 'Inter', system-ui, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      line-height: 1.5;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(0, 255, 204, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(160, 0, 255, 0.04) 0%, transparent 45%);
    }
    
    header {
      background: rgba(12, 16, 23, 0.7);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 1.25rem 2rem;
    }
    
    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .logo-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .logo-group svg {
      color: var(--primary);
      filter: drop-shadow(0 0 8px var(--primary));
    }
    
    .logo-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, #8b9bb4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    
    .db-status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.03);
      padding: 0.4rem 0.8rem;
      border-radius: 50px;
      border: 1px solid var(--border-color);
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-muted);
    }
    
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }
    
    .pulse-green {
      background-color: #26a69a;
      box-shadow: 0 0 8px #26a69a;
      animation: pulse 1.8s infinite;
    }
    
    .pulse-red {
      background-color: #ef5350;
      box-shadow: 0 0 8px #ef5350;
      animation: pulse 1.8s infinite;
    }

    .pulse-amber {
      background-color: #ffb300;
      box-shadow: 0 0 8px #ffb300;
      animation: pulse 1.8s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.6; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.6; }
    }
    
    main {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2.5rem 2rem 5rem 2rem;
    }
    
    /* Stats Row */
    .hero-panel {
      background: var(--bg-surface);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 2.5rem;
      margin-bottom: 2.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
    
    .hero-header h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--primary) 0%, #9c27b0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero-subtitle {
      color: var(--text-muted);
      font-size: 1.1rem;
      font-weight: 400;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .stat-card {
      background: rgba(255, 255, 255, 0.015);
      border: 1px solid var(--border-color);
      padding: 1.25rem;
      border-radius: 12px;
      transition: all 0.3s ease;
    }
    
    .stat-card:hover {
      border-color: rgba(0, 255, 204, 0.2);
      transform: translateY(-2px);
    }
    
    .stat-label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    
    .stat-value {
      font-family: 'Outfit', sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: #fff;
    }
    
    /* Interactive Filter Bar */
    .filter-sticky-bar {
      background: rgba(12, 16, 23, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 300px;
    }
    
    .search-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      color: #fff;
      transition: all 0.25s ease;
    }
    
    .search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 10px var(--primary-glow);
      background: rgba(255, 255, 255, 0.04);
    }
    
    .search-wrapper svg {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }
    
    .tabs-wrapper {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    
    .tab-btn {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 0.6rem 1rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .tab-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
    
    .tab-btn.active {
      background: var(--primary);
      border-color: var(--primary);
      color: #0c1017;
      font-weight: 600;
      box-shadow: 0 0 12px var(--primary-glow);
    }
    
    /* Route Sections */
    .route-section {
      margin-bottom: 3.5rem;
      transition: all 0.3s ease;
    }
    
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #fff;
    }
    
    .section-count {
      font-size: 0.9rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color);
      padding: 0.2rem 0.6rem;
      border-radius: 30px;
      color: var(--text-muted);
      font-weight: 500;
    }
    
    .cards-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    /* Route Card */
    .route-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .route-card:hover {
      background: var(--bg-surface-hover);
      border-color: rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }
    
    .card-summary {
      padding: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .method-path-group {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      min-width: 250px;
    }
    
    .method-badge {
      font-family: 'Outfit', sans-serif;
      font-size: 0.8rem;
      font-weight: 800;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      letter-spacing: 0.5px;
      min-width: 75px;
      text-align: center;
    }
    
    .method-get { background: var(--bg-get); color: var(--color-get); border: 1px solid rgba(0, 230, 118, 0.25); }
    .method-post { background: var(--bg-post); color: var(--color-post); border: 1px solid rgba(41, 121, 255, 0.25); }
    .method-put { background: var(--bg-put); color: var(--color-put); border: 1px solid rgba(255, 145, 0, 0.25); }
    .method-patch { background: var(--bg-patch); color: var(--color-patch); border: 1px solid rgba(0, 229, 255, 0.25); }
    .method-delete { background: var(--bg-delete); color: var(--color-delete); border: 1px solid rgba(255, 23, 68, 0.25); }
    
    .path-text {
      font-family: 'Fira Code', monospace;
      font-size: 0.95rem;
      color: #fff;
      font-weight: 500;
      position: relative;
    }
    
    .path-text:hover {
      text-decoration: underline;
      text-decoration-style: dashed;
      text-underline-offset: 4px;
    }
    
    .card-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .route-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-muted);
    }
    
    .badges-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
    }
    
    .badge-public { background: rgba(0, 230, 118, 0.05); color: #00e676; border: 1px solid rgba(0, 230, 118, 0.15); }
    .badge-protected { background: rgba(255, 145, 0, 0.05); color: #ff9100; border: 1px solid rgba(255, 145, 0, 0.15); }
    .badge-admin { background: rgba(255, 23, 68, 0.05); color: #ff1744; border: 1px solid rgba(255, 23, 68, 0.15); }
    
    .test-link {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(0, 255, 204, 0.05);
      color: var(--primary);
      border: 1px solid rgba(0, 255, 204, 0.15);
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    
    .test-link:hover {
      background: var(--primary);
      color: #0c1017;
      box-shadow: 0 0 8px var(--primary-glow);
    }
    
    .accordion-arrow {
      color: var(--text-muted);
      transition: transform 0.25s ease;
      display: flex;
      align-items: center;
    }
    
    .route-card.expanded .accordion-arrow {
      transform: rotate(180deg);
      color: var(--primary);
    }
    
    /* Expanded Details Wrapper */
    .card-details-wrapper {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .card-details {
      padding: 1.5rem;
      border-top: 1px solid var(--border-color);
      background: rgba(0, 0, 0, 0.15);
    }
    
    .route-desc {
      font-size: 0.95rem;
      color: var(--text-main);
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }
    
    .payloads-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .payload-block {
      background: #080c10;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .payload-header {
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--border-color);
      padding: 0.6rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    
    .copy-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      border-radius: 4px;
      padding: 0.25rem 0.6rem;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .copy-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }
    
    pre {
      padding: 1rem;
      overflow-x: auto;
      margin: 0;
    }
    
    .json-code {
      font-family: 'Fira Code', monospace;
      font-size: 0.85rem;
      color: #76ff03; /* Cool Terminal Green */
      line-height: 1.5;
    }
    
    /* Table styling for Status Codes */
    .status-codes-block {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background: #080c10;
      overflow: hidden;
    }
    
    .status-codes-block .block-title {
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--border-color);
      padding: 0.6rem 1rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    
    .status-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.85rem;
    }
    
    .status-table th {
      padding: 0.6rem 1rem;
      color: var(--text-muted);
      font-weight: 600;
      border-bottom: 1px solid var(--border-color);
    }
    
    .status-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.02);
    }
    
    .status-table tr:last-child td {
      border-bottom: none;
    }
    
    .status-badge {
      font-family: 'Outfit', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
    }
    
    .status-2xx { background: rgba(0, 230, 118, 0.1); color: #00e676; }
    .status-4xx { background: rgba(255, 145, 0, 0.1); color: #ff9100; }
    .status-5xx { background: rgba(255, 23, 68, 0.1); color: #ff1744; }
    
    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--primary);
      color: #0c1017;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 8px 24px rgba(0, 255, 204, 0.3);
      opacity: 0;
      transform: translateY(1rem);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1000;
      pointer-events: none;
    }
    
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Empty Search State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      display: none;
    }
    
    .empty-state svg {
      color: var(--text-muted);
      margin-bottom: 1rem;
    }
    
    .empty-state h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    
    .empty-state p {
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    
    footer {
      border-top: 1px solid var(--border-color);
      padding: 2.5rem 2rem;
      background: rgba(12, 16, 23, 0.5);
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    
    footer a {
      color: var(--primary);
      text-decoration: none;
    }
    
    footer a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      header {
        padding: 1rem;
      }
      .logo-title {
        font-size: 1.25rem;
      }
      main {
        padding: 1.5rem 1rem 4rem 1rem;
      }
      .hero-panel {
        padding: 1.5rem;
      }
      .card-summary {
        padding: 1rem;
      }
      .badges-group {
        width: 100%;
        margin-top: 0.5rem;
      }
    }
  </style>
</head>
<body>

  <!-- Header Banner -->
  <header>
    <div class="header-container">
      <div class="logo-group">
        <!-- SVG Game Controller Logo -->
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
        <span class="logo-title">STEAM DATABASE ENGINE</span>
      </div>
      
      <div class="db-status-badge">
        <span class="pulse-dot ${dbPulseClass}"></span>
        MongoDB State: <strong>${dbBadgeText}</strong>
      </div>
    </div>
  </header>

  <main>
    <!-- Hero / Status Section -->
    <div class="hero-panel">
      <div class="hero-header">
        <h1>Backend API is running successfully 🚀</h1>
      </div>
      <p class="hero-subtitle">
        Steam-style metadata REST API endpoints. Explore the route documentation catalog below.
      </p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Server Status</div>
          <div class="stat-value" style="color: var(--primary);">ACTIVE</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Active Routes</div>
          <div class="stat-value" id="stats-total-routes">${scanResult.totalCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Node.js Version</div>
          <div class="stat-value">${process.version}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">System Uptime</div>
          <div class="stat-value" style="font-size: 1.35rem; padding-top: 0.4rem;">${uptimeText}</div>
        </div>
      </div>
    </div>

    <!-- Filter Sticky Control Bar -->
    <div class="filter-sticky-bar">
      <div class="search-wrapper">
        <!-- SVG magnifying glass -->
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="text" id="route-search" class="search-input" placeholder="Search routes by path, name, or keywords..." oninput="onSearchChange()">
      </div>
      
      <div class="tabs-wrapper">
        <button class="tab-btn active" onclick="filterSection('ALL', this)">All Routes</button>
        <button class="tab-btn" onclick="filterSection('Health Routes', this)">Health</button>
        <button class="tab-btn" onclick="filterSection('Auth Routes', this)">Auth</button>
        <button class="tab-btn" onclick="filterSection('User Routes', this)">User</button>
        <button class="tab-btn" onclick="filterSection('Steam/Game Routes', this)">Steam/Games</button>
        <button class="tab-btn" onclick="filterSection('Admin Routes', this)">Admin</button>
        <button class="tab-btn" onclick="filterSection('Product Routes', this)">Products</button>
      </div>
    </div>

    <!-- Empty search state -->
    <div id="empty-state" class="empty-state">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <h3>No routes matched your query</h3>
      <p>Try searching for other terms or selecting a different section tab.</p>
    </div>

    <!-- Routes Cards Listing -->
    <div id="routes-container">
      ${sectionsHtml}
    </div>
  </main>

  <footer>
    <p>Steam Database Backend API &copy; 2026. Made with ❤️ for pairs and learning. | JSON Format: <a href="?format=json">/?format=json</a></p>
  </footer>

  <!-- Toast Notification element -->
  <div id="toast" class="toast">Path copied to clipboard!</div>

  <!-- Interactive JavaScript Logic -->
  <script>
    // Toggle Accordion functionality on Route Cards
    function toggleCard(cardId) {
      const wrapper = document.getElementById(cardId);
      const card = wrapper.parentElement;
      
      if (card.classList.contains('expanded')) {
        wrapper.style.maxHeight = '0px';
        card.classList.remove('expanded');
      } else {
        // Close other expanded cards in the same grid for cleaner view
        const parentGrid = card.parentElement;
        const expandedCards = parentGrid.querySelectorAll('.route-card.expanded');
        expandedCards.forEach(c => {
          if (c !== card) {
            c.querySelector('.card-details-wrapper').style.maxHeight = '0px';
            c.classList.remove('expanded');
          }
        });
        
        // Measure real contents height
        const contentHeight = wrapper.querySelector('.card-details').scrollHeight;
        wrapper.style.maxHeight = contentHeight + 40 + 'px'; // Allow buffer space
        card.classList.add('expanded');
      }
    }
    
    // Copy path utility
    function copyPath(event, path) {
      event.stopPropagation(); // Avoid triggering accordion toggle
      navigator.clipboard.writeText(path).then(() => {
        showToast('Path copied to clipboard!');
      });
    }

    // Copy block text
    function copyText(elemId) {
      const codeElement = document.getElementById(elemId);
      navigator.clipboard.writeText(codeElement.innerText).then(() => {
        showToast('JSON Copied!');
      });
    }
    
    // Toast alert show/hide
    let toastTimeout;
    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.innerText = message;
      toast.classList.add('show');
      
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    }
    
    // Global filter and search state
    let activeSection = 'ALL';
    
    function filterSection(sectionName, btnElement) {
      // 1. Update active tab styling
      const tabs = document.querySelectorAll('.tab-btn');
      tabs.forEach(t => t.classList.remove('active'));
      btnElement.classList.add('active');
      
      activeSection = sectionName;
      applyFilters();
    }
    
    function onSearchChange() {
      applyFilters();
    }
    
    function applyFilters() {
      const query = document.getElementById('route-search').value.toLowerCase().trim();
      const sections = document.querySelectorAll('.route-section');
      let totalVisibleCards = 0;
      
      sections.forEach(section => {
        const sectionName = section.getAttribute('data-section');
        const cards = section.querySelectorAll('.route-card');
        let visibleCardsInSection = 0;
        
        // 1. Check if section should be shown based on active tab
        const sectionMatchesTab = (activeSection === 'ALL' || activeSection === sectionName);
        
        cards.forEach(card => {
          const cardSearchText = card.getAttribute('data-search');
          const matchesSearch = !query || cardSearchText.includes(query);
          
          if (sectionMatchesTab && matchesSearch) {
            card.style.display = 'block';
            visibleCardsInSection++;
            totalVisibleCards++;
          } else {
            card.style.display = 'none';
          }
        });
        
        // 2. Hide entire section if no cards are visible in it
        if (visibleCardsInSection > 0) {
          section.style.display = 'block';
          section.querySelector('.section-count').innerText = visibleCardsInSection;
        } else {
          section.style.display = 'none';
        }
      });
      
      // 3. Show/hide empty state
      const emptyState = document.getElementById('empty-state');
      if (totalVisibleCards === 0) {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
      }
      
      // 4. Update the active route stats counter
      document.getElementById('stats-total-routes').innerText = totalVisibleCards;
    }
  </script>
</body>
</html>
  `;
}

module.exports = renderHtmlHomepage;
