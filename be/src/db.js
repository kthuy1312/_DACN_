// src/db.js
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "foodDelivery";

if (!uri) {
  throw new Error("MONGODB_URI is not set in .env");
}

const client = new MongoClient(uri);

let dbInstance = null;

async function connectDB() {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db(dbName);
    console.log(" Connected to MongoDB:", dbName);
  }
  return dbInstance;
}

module.exports = { connectDB };
