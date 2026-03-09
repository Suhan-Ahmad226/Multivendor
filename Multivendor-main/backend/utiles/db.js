const mongoose = require('mongoose');

// Support both MODE and mode env vars, defaulting to local development
const MODE = process.env.MODE || process.env.mode || 'dev';

const dbConnect = async () => {
  const primaryUrl =
    MODE === 'pro' ? process.env.MONGO_URI : process.env.DB_LOCAL_URL;

  const fallbackUrl = process.env.DB_LOCAL_URL || 'mongodb://127.0.0.1:27017/multivendor';

  try {
    const urlToUse = primaryUrl || fallbackUrl;
    await mongoose.connect(urlToUse); // Mongoose 7+ doesn't need useNewUrlParser or useUnifiedTopology

    console.log(
      MODE === 'pro'
        ? 'Production database connected...'
        : `Local database connected at ${urlToUse}...`
    );
  } catch (error) {
    if (MODE === 'pro') {
      console.error(
        'Primary production database connection error:',
        error.message
      );
      // Try falling back to local/dev DB so the app can still run
      try {
        await mongoose.connect(fallbackUrl);
        console.log(`Fallback local database connected at ${fallbackUrl}...`);
        return;
      } catch (fallbackError) {
        console.error(
          'Fallback database connection error:',
          fallbackError.message
        );
      }
    } else {
      console.error('Database connection error:', error.message);
    }

    process.exit(1); // Stop server if DB fails
  }
};

module.exports = { dbConnect };
