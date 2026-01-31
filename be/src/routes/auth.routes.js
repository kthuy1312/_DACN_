// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../utils/password")


// POST /api/register
router.post("/register", async (req, res) => {
    try {
        const db = req.db;

        const { email, password, name } = req.body;

        //thiếu tt
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Missing fields" });
        }

        //đã tồn tại
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const user = {
            email,
            password: hashedPassword,
            name,
            role: "Client",
            avatar: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const result = await db.collection("users").insertOne(user);

        return res.status(201).json({
            message: "Register success",
            userId: result.insertedId,
            user
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// POST /api/login
router.post("/login", async (req, res) => {
    try {

        const db = req.db;

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        // Tìm user theo email
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return res.status(404).send("Invalid email/password");
        }

        // Check password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid email/password");
        }

        //tất cả đều ok
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login success",
            token,
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
        });

    } catch (err) {
        console.error("POST /api/login error:", err);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
