/**
 * db.js — MongoDB connection via MONGO_URI or separate user/password vars.
 */
const mongoose = require('mongoose');

function getMongoUri() {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI.trim();
  }

  const user = process.env.MONGO_USER;
  const pass = process.env.MONGO_PASSWORD;
  const cluster = process.env.MONGO_CLUSTER || 'cluster0.trkwqdl.mongodb.net';
  const db = process.env.MONGO_DB || 'steam_games_db';

  if (!user || !pass) {
    throw new Error('Set MONGO_URI or both MONGO_USER and MONGO_PASSWORD in .env');
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPass = encodeURIComponent(pass);

  return `mongodb+srv://${encodedUser}:${encodedPass}@${cluster}/${db}?retryWrites=true&w=majority&authSource=admin`;
}

async function connectDB() {
  const uri = getMongoUri();

  try {
    // Try connecting to the configured database
    console.log('Connecting to database...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.warn('Primary MongoDB connection failed:', err.message);
    if (err.message.includes('bad auth')) {
      console.warn('→ Authentication failed. Please check your username/password.');
    }
    
    // Fallback to local MongoDB in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.log('Attempting fallback to local MongoDB (mongodb://localhost:27017/steam_games_db)...');
      try {
        await mongoose.connect('mongodb://localhost:27017/steam_games_db', { serverSelectionTimeoutMS: 5000 });
        console.log('MongoDB connected (FALLBACK to local database)');
      } catch (localErr) {
        console.error('Local MongoDB connection failed:', localErr.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

module.exports = connectDB;
module.exports.getMongoUri = getMongoUri;
