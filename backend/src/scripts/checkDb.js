require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const rawCollection = mongoose.connection.db.collection('games');
  
  const total = await rawCollection.countDocuments({});
  console.log('Total games:', total);

  // Recommendations check
  const nonZeroRecs = await rawCollection.countDocuments({ recommendations: { $ne: "0" } });
  console.log('Games with recommendations != "0":', nonZeroRecs);

  const sampleWithRecs = await rawCollection.find({ recommendations: { $ne: "0" } }).limit(5).toArray();
  console.log('\nSample games with recommendations != "0":');
  sampleWithRecs.forEach(g => {
    console.log(`- ${g.name} (appid: ${g.appid}): recommendations = ${g.recommendations}`);
  });

  await mongoose.disconnect();
}

run().catch(console.error);
