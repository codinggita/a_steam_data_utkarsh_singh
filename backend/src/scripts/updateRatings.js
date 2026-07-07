require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is missing in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('Connected.');

  const db = mongoose.connection.db;
  const rawCollection = db.collection('games');

  console.log('Generating realistic ratings and downloads for all 65,521 games...');

  const cursor = rawCollection.find({});
  let batch = [];
  let processedCount = 0;
  let successCount = 0;
  const batchSize = 2000;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    processedCount++;

    // Generate a realistic rating between 5.5 and 9.6
    const rating = parseFloat((5.5 + Math.random() * 4.1).toFixed(1));

    // Generate realistic downloads between 500 and 1,500,000
    // We use a logarithmic distribution so most games have fewer downloads and some have massive hits
    const exponent = 2.5 + Math.random() * 3.7; // Exponent between 2.5 and 6.2
    const downloads = Math.floor(Math.pow(10, exponent));

    batch.push({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: {
            rating: rating,
            downloads: downloads
          }
        }
      }
    });

    if (batch.length >= batchSize) {
      console.log(`Updating batch of ${batch.length}... (Progress: ${processedCount}/65521)`);
      const result = await rawCollection.bulkWrite(batch, { ordered: false });
      successCount += result.modifiedCount;
      batch = [];
    }
  }

  if (batch.length > 0) {
    console.log(`Updating remaining ${batch.length} documents...`);
    const result = await rawCollection.bulkWrite(batch, { ordered: false });
    successCount += result.modifiedCount;
  }

  console.log(`\nSuccessfully updated ${successCount} games with realistic ratings and downloads.`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Failed to update ratings:', err.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
