const mongoose = require("mongoose");

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not configured. Add it to server/.env before starting the API.",
    );
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
};
