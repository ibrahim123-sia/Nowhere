const mongoose = require("mongoose");

let cached = global._mongooseConnection;

const connectDB = async () => {
  if (cached) {
    return cached;
  }
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );
    cached = await mongoose.connect(process.env.MONGODB_URI);
    global._mongooseConnection = cached;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;