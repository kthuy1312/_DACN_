const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const authMiddleware = require("../middleware/authMiddleware")

//tạo transaction
// POST /api/transactions
router.post("/transactions", authMiddleware, async (req, res) => {
    try {
        const db = req.db;
        const user = req.user;

        const { amount, type, categoryId, description } = req.body

        if (!user) {
            return res.status(401).json({ message: "Không có user" });
        }

        if (!amount || !description || !type || !categoryId) {
            return res.status(400).json({ message: "Missing fields" });
        }

        if (type !== "income" && type !== "expense") {
            return res.status(400).json({ message: "Type của transaction không hợp lệ" });
        }

        const amountNumber = Number(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            return res.status(400).json({ message: "Amount không hợp lệ" });
        }

        const category = await db.collection("categories").findOne({
            _id: new ObjectId(categoryId),
            userId: new ObjectId(user._id),
        });
        if (!category) {
            return res.status(400).json({ message: "CategoryId không hợp lệ" });
        }

        const transaction = {
            userId: new ObjectId(user._id),
            categoryId: new ObjectId(categoryId),
            categoryName: category.name,
            categoryIcon: category.icon,
            type,
            amount: amountNumber,
            description,
            createdAt: new Date().toISOString(),
        }
        const result = await db.collection("transactions").insertOne(transaction);
        res.json({
            message: "Thêm transaction thành công",
            transactionId: result.insertedId,
            transaction
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST   /api/transactions
// PUT    /api/transactions/:id
// DELETE /api/transactions/:id


module.exports = router;
