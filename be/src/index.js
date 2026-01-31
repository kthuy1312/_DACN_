// src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectDB } = require("./db");
const { runSeed } = require("./config/seed");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

async function startServer() {
  const db = await connectDB();

  await runSeed(db);

  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  // routes
  app.get("/", (req, res) => {
    res.send("Smart Finance backend is running");
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
