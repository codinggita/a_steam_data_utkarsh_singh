/**
 * STEP 10 — src/scripts/seedData.js
 *
 * Loads a JSON file of Steam games into MongoDB.
 *
 * HOW TO RUN (from backend/ folder):
 *   npm run seed
 *   — or —
 *   node src/scripts/seedData.js
 *
 * CUSTOM DATASET (your full 2021–2025 JSON file):
 *   node src/scripts/seedData.js "C:/path/to/steam-games.json"
 *
 * WHAT THIS SCRIPT DOES:
 *   1) Load .env (MONGO_URI from Atlas/local)
 *   2) Connect to MongoDB
 *   3) Read JSON file from disk with fs.readFileSync
 *   4) Game.deleteMany({}) — wipe existing games (dev repeatability)
 *   5) Game.insertMany(data) — bulk insert all games
 *   6) Log success and disconnect
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const fs = require('fs'); // Node built-in — read files from disk.
const path = require('path'); // Build cross-platform file paths safely.
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Game = require('../models/Game');

/** Default sample file — replace with your full dataset path via CLI argument. */
const DEFAULT_JSON = path.join(__dirname, '../../data/sample-games.json');

async function seed() {
  const fileArg = process.argv[2];
  const jsonPath = fileArg ? path.resolve(fileArg) : DEFAULT_JSON;

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`JSON file not found: ${jsonPath}`);
  }

  console.log('Connecting to MongoDB...');
  await connectDB();

  console.log(`Reading ${jsonPath} ...`);
  // readFileSync blocks until the entire file is read — fine for a one-off script.
  // 'utf8' means read as text (not binary) so JSON.parse can work.
  const rawText = fs.readFileSync(jsonPath, 'utf8');

  // JSON.parse converts the text string into JavaScript arrays/objects.
  const games = JSON.parse(rawText);

  if (!Array.isArray(games)) {
    throw new Error('JSON root must be an array of game objects [...]');
  }

  if (games.length === 0) {
    console.warn('Warning: JSON file is empty — nothing to insert.');
  }

  console.log(`Found ${games.length} games in file. Clearing games collection...`);
  // deleteMany({}) removes ALL documents in the games collection.
  // Why? So re-running seed gives a clean slate — no duplicate appid errors.
  // WARNING: Only do this in development — never blindly on production data.
  await Game.deleteMany({});

  console.log('Inserting games...');
  // insertMany sends all documents in one batch — much faster than create() in a loop.
  // Mongoose validates each document against the Game schema before insert.
  const inserted = await Game.insertMany(games, { ordered: false });
  // ordered:false — if one doc fails, others still insert (useful for large messy datasets).

  console.log(`✓ Seeded ${inserted.length} games into "${mongoose.connection.name}" database.`);
  console.log('Sample check: GET http://localhost:5000/api/v1/games?page=1&limit=5');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
  process.exit(0);
}

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore disconnect errors during failure cleanup
  }
  process.exit(1);
});
