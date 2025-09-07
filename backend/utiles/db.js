const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    const dbUrl = process.env.MODE === 'pro' ? process.env.MONGO_URI : process.env.DB_LOCAL_URL;

    if (!dbUrl) throw new Error("MongoDB connection string is missing in .env!");

    await mongoose.connect(dbUrl); // Mongoose 7+ doesn't need useNewUrlParser or useUnifiedTopology
    console.log(process.env.MODE === 'pro' ? 'Production database connected...' : 'Local database connected...');
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); // Stop server if DB fails
  }
};

module.exports = { dbConnect };
