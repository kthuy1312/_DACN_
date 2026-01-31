const express = require("express");

const router = express.Router();

router.get("/user", async (req, res) => {
    const db = req.db;
    const users = await db.collection("users").find().toArray();
    return res.status(200).json({ users });
});

module.exports = router;
