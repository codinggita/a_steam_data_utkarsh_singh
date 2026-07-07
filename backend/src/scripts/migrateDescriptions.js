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

  console.log('Updating descriptions for all games missing it...');

  const result = await rawCollection.updateMany(
    { description: { $exists: false } },
    [
      {
        $set: {
          description: {
            $concat: [
              "A premium ",
              {
                $cond: {
                  if: { $gt: [{ $size: { $ifNull: ["$genres", []] } }, 0] },
                  then: { $toLower: { $arrayElemAt: ["$genres", 0] } },
                  else: "interactive"
                }
              },
              " experience developed by ",
              { $ifNull: ["$developer", "Unknown Developer"] },
              " and published by ",
              { $ifNull: ["$publisher", "Unknown Publisher"] },
              ". Immerse yourself in this high-integrity registry entry featuring modern gaming parameters."
            ]
          }
        }
      }
    ]
  );

  console.log(`Updated ${result.modifiedCount} games with dynamic descriptions.`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Migration failed:', err.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
