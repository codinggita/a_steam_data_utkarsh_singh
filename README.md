# Steam Games Backend API

A **beginner-friendly**, production-style REST API for a Steam-style games dashboard.

Built with **Node.js**, **Express**, **MongoDB (Mongoose)**, **JWT authentication**, and **bcrypt** password hashing.

This folder (`backend/`) is self-contained — all application code lives in `src/`, and `server.js` is the entry point.

---

## What This Project Does

- Stores and serves Steam-style game data (title, genres, price, ratings, platforms, etc.)
- Lets users **register**, **login**, and access **protected** routes with JWT tokens
- Provides **filtering**, **sorting**, **search**, **pagination**, **analytics**, and **stats** endpoints
- Supports **admin-only** routes for managing games

Every API response follows the same JSON shape:

```json
{ "success": true, "message": "...", "data": { ... } }
```

```json
{ "success": false, "message": "...", "error": "..." }
```

---

## Project Structure

```
backend/
├── server.js              ← Entry point (starts the server)
├── package.json           ← Dependencies and npm scripts
├── .env                   ← Secrets (never commit to git)
├── .gitignore
├── README.md
├── data/
│   └── sample-games.json  ← Sample dataset for seeding
└── src/
    ├── config/db.js       ← MongoDB connection
    ├── models/            ← Game & User schemas
    ├── controllers/     ← HTTP handlers (req → res)
    ├── services/        ← Business logic + database queries
    ├── routes/          ← URL → controller mapping
    ├── middlewares/     ← Auth, logging, errors, rate limits
    ├── utils/           ← asyncHandler, apiResponse, pagination
    └── scripts/
        └── seedData.js  ← Load JSON games into MongoDB
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) **18+**
- [MongoDB](https://www.mongodb.com/) — local install **or** [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster
- [Postman](https://www.postman.com/) (optional, for testing APIs)

---

## Step 1 — Install Dependencies

Open a terminal in the `backend/` folder:

```bash
cd backend
npm install
```

This installs:

| Package | Purpose |
|---------|---------|
| `express` | Web framework — handles HTTP requests |
| `mongoose` | Talk to MongoDB using JavaScript objects |
| `dotenv` | Load secrets from `.env` |
| `bcryptjs` | Hash passwords securely |
| `jsonwebtoken` | Create and verify JWT tokens |
| `cors` | Allow frontend on another domain to call this API |
| `express-rate-limit` | Limit requests per IP (abuse protection) |
| `morgan` | Log HTTP requests to the console |
| `nodemon` | Auto-restart server on file changes (dev only) |

---

## Step 2 — Configure `.env`

Create or edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/steam_games_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

| Variable | What it means |
|----------|---------------|
| `PORT` | Which port the server listens on (e.g. `5000` → `http://localhost:5000`) |
| `MONGO_URI` | Full MongoDB connection string (local or Atlas). Database name is usually at the end of the path (`/steam_games_db`) |
| `JWT_SECRET` | Secret key used to **sign** JWT tokens. Never share or commit this |
| `JWT_EXPIRES_IN` | How long tokens stay valid (`7d` = 7 days, `1h` = 1 hour) |
| `NODE_ENV` | `development` or `production` — affects error detail in responses |

**MongoDB Atlas checklist:**
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. **Database Access** → create a database user
3. **Network Access** → add your IP (or `0.0.0.0/0` for dev only)
4. **Connect** → copy the connection string → paste into `MONGO_URI`

---

## Step 3 — Seed the Database

Load sample games (or your full JSON dataset) into MongoDB:

```bash
npm run seed
```

This runs `node src/scripts/seedData.js`, which:
1. Connects to MongoDB
2. Reads `data/sample-games.json`
3. Deletes existing games (`deleteMany`)
4. Inserts all games (`insertMany`)

**Use your own dataset:**

```bash
node src/scripts/seedData.js "C:/path/to/your-steam-games.json"
```

The JSON file must be an **array** of game objects matching the `Game` model fields.

---

## Step 4 — Run the Server

**Development** (auto-restarts on file changes):

```bash
npm run dev
```

**Production:**

```bash
npm start
```

You should see:

```
MongoDB connected
Server running in development on port 5000
Health check: http://localhost:5000/api/v1/health
```

---

## npm Scripts

| Script | Command | What it does |
|--------|---------|--------------|
| `npm start` | `node server.js` | Run server in production mode |
| `npm run dev` | `nodemon server.js` | Run with auto-restart on save |
| `npm run seed` | `node src/scripts/seedData.js` | Load games JSON into MongoDB |

---

## All API Endpoints

Base URL: `http://localhost:5000`

Legend: **Public** = no token | **Auth** = Bearer JWT | **Admin** = JWT + role `admin`

---

### Health & System

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/health` | Public |
| GET | `/api/v1/system/info` | Public |
| GET | `/api/v1/system/version` | Public |

---

### Auth — `/api/v1/auth`

| Method | Path | Access |
|--------|------|--------|
| POST | `/api/v1/auth/register` | Public |
| POST | `/api/v1/auth/login` | Public |
| POST | `/api/v1/auth/logout` | Public |
| GET | `/api/v1/auth/profile` | Auth |
| PATCH | `/api/v1/auth/profile` | Auth |
| POST | `/api/v1/auth/change-password` | Auth |

---

### JWT Playground — `/api/v1/jwt`

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/jwt/profile` | Auth |
| GET | `/api/v1/jwt/dashboard` | Auth |
| POST | `/api/v1/jwt/generate-token` | Public (testing) |
| POST | `/api/v1/jwt/verify-token` | Public |
| POST | `/api/v1/jwt/refresh-token` | Bearer token required |
| DELETE | `/api/v1/jwt/revoke-token` | Auth |
| GET | `/api/v1/jwt/private-games` | Auth |
| GET | `/api/v1/jwt/private-analytics` | Auth |

---

### Games — `/api/v1/games`

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/games` | Public |
| GET | `/api/v1/games/random` | Public |
| GET | `/api/v1/games/exists/:appid` | Public |
| GET | `/api/v1/games/:appid` | Public |
| POST | `/api/v1/games` | Admin |
| PUT | `/api/v1/games/:appid` | Admin |
| PATCH | `/api/v1/games/:appid` | Admin |
| DELETE | `/api/v1/games/:appid` | Admin |
| PATCH | `/api/v1/games/:appid/archive` | Auth |
| PATCH | `/api/v1/games/:appid/restore` | Auth |

**List filters** (query params on `GET /api/v1/games`):

`?genre=action&developer=valve&platform=windows&tag=multiplayer&minPrice=0&maxPrice=50&rating=8&releaseYear=2024&discount=10&multiplayer=true&freeToPlay=true&sort=rating&page=1&limit=10`

**Sort options:** `rating`, `price`, `downloads`, `releaseDate`, `popularity`, `title`

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/games/sort/price-desc` | Public |
| GET | `/api/v1/games/sort/rating-desc` | Public |
| GET | `/api/v1/games/sort/downloads-desc` | Public |
| GET | `/api/v1/games/sort/releaseDate-desc` | Public |
| GET | `/api/v1/games/sort/popularity-desc` | Public |

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/games/genre/:genre` | Public |
| GET | `/api/v1/games/developer/:developer` | Public |
| GET | `/api/v1/games/publisher/:publisher` | Public |
| GET | `/api/v1/games/platform/:platform` | Public |
| GET | `/api/v1/games/tag/:tag` | Public |
| GET | `/api/v1/games/release-year/:year` | Public |
| GET | `/api/v1/games/rating/:rating` | Public |
| GET | `/api/v1/games/price/:price` | Public |
| GET | `/api/v1/games/feature/:feature` | Public |

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/games/:appid/summary` | Public |
| GET | `/api/v1/games/:appid/history` | Public |
| GET | `/api/v1/games/:appid/related` | Public |
| GET | `/api/v1/games/:appid/screenshots` | Public |
| GET | `/api/v1/games/:appid/trailers` | Public |
| GET | `/api/v1/games/:appid/reviews` | Public |
| POST | `/api/v1/games/:appid/reviews` | Auth |
| PATCH | `/api/v1/games/:appid/reviews/:reviewId` | Auth |
| DELETE | `/api/v1/games/:appid/reviews/:reviewId` | Auth |
| GET | `/api/v1/games/:appid/system-requirements` | Public |
| GET | `/api/v1/games/:appid/dlc` | Public |
| GET | `/api/v1/games/:appid/achievements` | Public |
| GET | `/api/v1/games/:appid/updates` | Public |

---

### Game Filters — `/api/v1/games/filter`

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/games/filter/free-to-play` | Public |
| GET | `/api/v1/games/filter/paid` | Public |
| GET | `/api/v1/games/filter/discounted` | Public |
| GET | `/api/v1/games/filter/early-access` | Public |
| GET | `/api/v1/games/filter/vr-only` | Public |
| GET | `/api/v1/games/filter/controller-support` | Public |
| GET | `/api/v1/games/filter/multiplayer` | Public |
| GET | `/api/v1/games/filter/singleplayer` | Public |
| GET | `/api/v1/games/filter/coop` | Public |
| GET | `/api/v1/games/filter/open-world` | Public |
| GET | `/api/v1/games/filter/survival` | Public |
| GET | `/api/v1/games/filter/horror` | Public |
| GET | `/api/v1/games/filter/anime` | Public |
| GET | `/api/v1/games/filter/indie` | Public |
| GET | `/api/v1/games/filter/top-rated` | Public |

All filter routes support `?page=1&limit=10`.

---

### Search — `/api/v1/search`

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/search/games?q=keyword&page=1&limit=10` | Public |

---

### Analytics — `/api/v1/analytics/games`

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/analytics/games/top-rated?limit=10` | Public |
| GET | `/api/v1/analytics/games/most-downloaded?limit=10` | Public |
| GET | `/api/v1/analytics/games/revenue` | Public |
| GET | `/api/v1/analytics/games/platform-distribution` | Public |
| GET | `/api/v1/analytics/games/genre-distribution` | Public |
| GET | `/api/v1/analytics/games/trending?limit=10` | Public |
| GET | `/api/v1/analytics/games/release-trends` | Public |
| GET | `/api/v1/analytics/games/user-activity` | Public |
| GET | `/api/v1/analytics/games/wishlist-analysis` | Public |
| GET | `/api/v1/analytics/games/review-analysis` | Public |

---

### Stats — `/api/v1/stats/games`

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/stats/games/count` | Public |
| GET | `/api/v1/stats/games/top-rated` | Public |
| GET | `/api/v1/stats/games/most-downloaded` | Public |
| GET | `/api/v1/stats/games/average-price` | Public |
| GET | `/api/v1/stats/games/average-rating` | Public |
| GET | `/api/v1/stats/games/genre-count` | Public |
| GET | `/api/v1/stats/games/platform-count` | Public |
| GET | `/api/v1/stats/games/free-to-play-count` | Public |
| GET | `/api/v1/stats/games/multiplayer-count` | Public |
| GET | `/api/v1/stats/games/monthly-releases` | Public |

---

### Admin — `/api/v1/admin` (Auth + Admin role)

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/admin/games` | Admin |
| GET | `/api/v1/admin/analytics` | Admin |
| GET | `/api/v1/admin/reports` | Admin |
| GET | `/api/v1/admin/dashboard` | Admin |

---

### Misc

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/trending/games` | Public |
| GET | `/api/v1/news/latest` | Public |
| GET | `/api/v1/compare/games/:id1/:id2` | Public |
| GET | `/api/v1/recommendations/games/:appid` | Public |

---

## Test with Postman (Step by Step)

### 1. Health check (no auth)

1. Open Postman → **New** → **HTTP Request**
2. Set method to **GET**
3. URL: `http://localhost:5000/api/v1/health`
4. Click **Send**
5. Expect: `{ "success": true, "data": { "status": "ok", ... } }`

### 2. List games (no auth)

1. **GET** `http://localhost:5000/api/v1/games?page=1&limit=5`
2. Click **Send** — you should see seeded games in `data.games`

### 3. Register a user

1. **POST** `http://localhost:5000/api/v1/auth/register`
2. **Body** tab → **raw** → **JSON**:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "secret12"
}
```

3. Click **Send**
4. Copy `data.token` from the response — you need this for protected routes

### 4. Login (alternative to register)

1. **POST** `http://localhost:5000/api/v1/auth/login`
2. Body:

```json
{
  "email": "test@example.com",
  "password": "secret12"
}
```

3. Copy the token from the response

### 5. Call a protected route

1. **GET** `http://localhost:5000/api/v1/auth/profile`
2. **Authorization** tab → Type: **Bearer Token**
3. Paste your token (Postman adds `Bearer` automatically)
4. Click **Send** — expect your user profile in `data.user`

### 6. Search games

1. **GET** `http://localhost:5000/api/v1/search/games?q=cosmic&page=1&limit=10`
2. No auth needed

### 7. Analytics

1. **GET** `http://localhost:5000/api/v1/analytics/games/top-rated?limit=5`
2. No auth needed

### 8. Add a review (auth required)

1. **POST** `http://localhost:5000/api/v1/games/100001/reviews`
2. **Authorization** → Bearer Token
3. Body:

```json
{
  "text": "Great game!",
  "rating": 9
}
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `MongoDB connection error` | Check `MONGO_URI` in `.env`; verify Atlas Network Access allows your IP |
| `E11000 duplicate key` on seed | Normal if re-seeding without delete — run `npm run seed` (it clears first) |
| `401 Unauthorized` | Add Bearer token in Authorization header |
| `403 Forbidden` on admin routes | User must have `role: "admin"` in the database |
| `Cannot GET /` | API lives under `/api/v1/*` — use `/api/v1/health` not `/` |
| Empty games list | Run `npm run seed` first |

---

## Security Notes

- Never commit `.env` to git (already in `.gitignore`)
- Change `JWT_SECRET` before any real deployment
- Rotate MongoDB passwords if they were ever shared publicly
- Rate limiting: 100 req/15min globally, 10 req/15min on login/register

---

## License

MIT — learning project.
