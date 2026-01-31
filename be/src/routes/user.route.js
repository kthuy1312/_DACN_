const express = require("express");
const { connectDB } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    const db = await connectDB();
    const users = await db.collection("users").find().toArray();
    res.json(users);
});

module.exports = router;
