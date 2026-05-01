const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("🔌 Connecting to Mongo...");

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("✅ MongoDB Connected...");
};

module.exports = connectDB;