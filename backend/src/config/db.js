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
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    if (err.message.includes('bad auth')) {
      console.error('→ Wrong username/password in Atlas. Reset password in Database Access to match .env');
    }
    process.exit(1);
  }
}

module.exports = connectDB;
module.exports.getMongoUri = getMongoUri;
