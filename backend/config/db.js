const { MongoClient } = require('mongodb');

let client;
let db;

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(); // uses database from connection string
    console.log('MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
  }
};

module.exports = { connectDB, getDB, closeDB };