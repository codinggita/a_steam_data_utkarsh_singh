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

  // --- Step 1: Detect Duplicate appids ---
  console.log('Checking for duplicate appids...');
  const duplicateCheck = await rawCollection.aggregate([
    {
      $group: {
        _id: "$appid",
        count: { $sum: 1 },
        docs: { $push: "$_id" }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ]).toArray();

  if (duplicateCheck.length > 0) {
    console.log(`Found ${duplicateCheck.length} duplicate appid groups. Cleaning them up...`);
    for (const group of duplicateCheck) {
      const appid = group._id;
      // Keep the first document, delete the others
      const toKeep = group.docs[0];
      const toDelete = group.docs.slice(1);
      console.log(`Appid: ${appid} - keeping ${toKeep}, deleting ${toDelete.length} duplicates`);
      await rawCollection.deleteMany({ _id: { $in: toDelete } });
    }
    console.log('Duplicates clean up finished.');
  } else {
    console.log('No duplicate appids found.');
  }

  // --- Step 2: Migrate Documents ---
  console.log('Starting migration...');
  const totalDocs = await rawCollection.countDocuments({});
  console.log(`Total documents to process: ${totalDocs}`);

  const cursor = rawCollection.find({});
  let batch = [];
  let processedCount = 0;
  let successCount = 0;
  const batchSize = 1000;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    processedCount++;

    // Parse Appid
    const parsedAppid = parseInt(doc.appid, 10);
    if (isNaN(parsedAppid)) {
      console.warn(`[Skip] Document _id ${doc._id} has invalid appid: ${doc.appid}`);
      continue;
    }

    // Parse Price
    const parsedPrice = parseFloat(doc.price) || 0;

    // Parse Genres
    let parsedGenres = [];
    if (typeof doc.genres === 'string') {
      parsedGenres = doc.genres.split(';').map(g => g.trim()).filter(Boolean);
    } else if (Array.isArray(doc.genres)) {
      parsedGenres = doc.genres;
    }

    // Parse Tags/Categories
    let parsedTags = [];
    if (typeof doc.categories === 'string') {
      parsedTags = doc.categories.split(';').map(t => t.trim()).filter(Boolean);
    } else if (Array.isArray(doc.tags)) {
      parsedTags = doc.tags;
    }

    // Parse Release Date
    let parsedReleaseDate = null;
    if (doc.release_date) {
      const dateVal = new Date(doc.release_date);
      if (!isNaN(dateVal.getTime())) {
        parsedReleaseDate = dateVal;
      }
    }

    // Setup platforms
    const tagsLower = parsedTags.map(t => t.toLowerCase());
    const isWindows = true; // Default for almost all steam games
    const isMac = tagsLower.includes('mac') || tagsLower.includes('mac os x') || false;
    const isLinux = tagsLower.includes('linux') || tagsLower.includes('steamOS') || false;

    // Parse Recommendations / Rating
    // We map recommendations string (e.g. "125000") to downloads, and use a default rating or compute it
    const recommendations = parseInt(doc.recommendations, 10) || 0;

    // Construct the update object
    const updateFields = {
      appid: parsedAppid,
      title: doc.name || doc.title || 'Unknown Title',
      developer: doc.developer || 'Unknown',
      publisher: doc.publisher || 'Unknown',
      genres: parsedGenres,
      tags: parsedTags,
      platforms: {
        windows: isWindows,
        mac: isMac,
        linux: isLinux
      },
      releaseDate: parsedReleaseDate,
      price: parsedPrice,
      discount: parseInt(doc.discount, 10) || 0,
      rating: parseFloat(doc.rating) || (recommendations > 0 ? Math.min(10, 5 + Math.log10(recommendations)) : 0),
      downloads: parseInt(doc.downloads, 10) || recommendations, // Use recommendations as fallback for downloads
      isFreeToPlay: parsedPrice === 0 || doc.isFreeToPlay === true,
      isMultiplayer: tagsLower.includes('multi-player') || tagsLower.includes('multiplayer') || doc.isMultiplayer === true,
      isSingleplayer: tagsLower.includes('single-player') || tagsLower.includes('singleplayer') || doc.isSingleplayer === true,
      isCoop: tagsLower.includes('co-op') || tagsLower.includes('coop') || doc.isCoop === true,
      hasControllerSupport: tagsLower.includes('full controller support') || tagsLower.includes('partial controller support') || doc.hasControllerSupport === true,
      isVROnly: tagsLower.includes('vr only') || doc.isVROnly === true,
      isEarlyAccess: parsedGenres.map(g => g.toLowerCase()).includes('early access') || doc.isEarlyAccess === true,
      isArchived: false,
      screenshots: Array.isArray(doc.screenshots) ? doc.screenshots : [],
      trailers: Array.isArray(doc.trailers) ? doc.trailers : [],
      reviews: Array.isArray(doc.reviews) ? doc.reviews : [],
      updateHistory: Array.isArray(doc.updateHistory) ? doc.updateHistory : []
    };

    // We also want to remove deprecated fields from MongoDB
    const unsetFields = {
      name: "",
      release_year: "",
      release_date: "",
      categories: "",
      recommendations: ""
    };

    batch.push({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: updateFields,
          $unset: unsetFields
        }
      }
    });

    if (batch.length >= batchSize) {
      console.log(`Writing batch of ${batch.length}... (Progress: ${processedCount}/${totalDocs})`);
      const result = await rawCollection.bulkWrite(batch, { ordered: false });
      successCount += result.modifiedCount;
      batch = [];
    }
  }

  // Write remaining
  if (batch.length > 0) {
    console.log(`Writing remaining ${batch.length} documents...`);
    const result = await rawCollection.bulkWrite(batch, { ordered: false });
    successCount += result.modifiedCount;
  }

  console.log(`\nMigration completed successfully!`);
  console.log(`Processed: ${processedCount} documents.`);
  console.log(`Updated in database: ${successCount} documents.`);

  // --- Step 3: Create Unique Index ---
  console.log('Ensuring unique index on appid...');
  try {
    await rawCollection.createIndex({ appid: 1 }, { unique: true });
    console.log('Unique index on appid created successfully.');
  } catch (err) {
    console.error('Failed to create unique index on appid:', err.message);
  }

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Migration failed:', err.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
