/**
 * Quick MongoDB connection test — run: npm run test:db
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { getMongoUri } = require('../config/db');

try {
  const uri = getMongoUri();
  console.log('Connecting as user:', process.env.MONGO_USER || '(from MONGO_URI)');

  mongoose
    .connect(uri, { serverSelectionTimeoutMS: 15000 })
    .then(() => {
      console.log('SUCCESS: MongoDB connected!');
      console.log('Database:', mongoose.connection.name);
      return mongoose.disconnect();
    })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('FAILED:', err.message);
      if (err.message.includes('bad auth')) {
        console.error('\n=== FIX IN MONGODB ATLAS ===');
        console.error('1. cloud.mongodb.com → Database Access');
        console.error('2. Edit user:', process.env.MONGO_USER);
        console.error('3. Password → Edit → set EXACTLY: Steam2026 → Update User');
        console.error('4. Wait 1 minute, then run: npm run test:db');
      }
      process.exit(1);
    });
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
