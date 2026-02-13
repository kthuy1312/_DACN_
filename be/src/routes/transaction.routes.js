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
        return res.status(201).json({
            message: "Thêm transaction thành công",
            transactionId: result.insertedId,
            transaction
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// GET    /api/transactions
router.get("/transactions", authMiddleware, async (req, res) => {
    try {
        const db = req.db;
        const user = req.user;

        const transaction = await db
            .collection("transactions")
            .find({ userId: new ObjectId(user._id) })
            .toArray();

        return res.status(200).json({
            message: `Lấy transaction của ${user.name} thành công `,
            transaction
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

// PUT    /api/transactions/:transactionId
router.put("/transactions/:transactionId", authMiddleware, async (req, res) => {
    try {
        const db = req.db
        const user = req.user
        const { transactionId } = req.params
        const { amount, type, categoryId, description, date } = req.body

        // validate transactionId
        if (!ObjectId.isValid(transactionId)) {
            return res.status(400).json({ message: "transactionId không hợp lệ" })
        }

        // không có gì để update
        if (
            amount === undefined &&
            type === undefined &&
            categoryId === undefined &&
            description === undefined &&
            date === undefined
        ) {
            return res
                .status(400)
                .json({ message: "Không có dữ liệu để cập nhật" })
        }

        // object update
        const updateTransaction = {
            updatedAt: new Date().toISOString(),
        }

        // amount
        if (amount !== undefined) {
            const amountNumber = Number(amount)
            if (isNaN(amountNumber) || amountNumber <= 0) {
                return res.status(400).json({ message: "Amount không hợp lệ" })
            }
            updateTransaction.amount = amountNumber
        }

        // type
        if (type) {
            if (type !== "income" && type !== "expense") {
                return res.status(400).json({ message: "Type không hợp lệ" })
            }
            updateTransaction.type = type
        }

        // description
        if (description !== undefined) {
            updateTransaction.description = description
        }

        // category
        if (categoryId) {
            if (!ObjectId.isValid(categoryId)) {
                return res
                    .status(400)
                    .json({ message: "CategoryId không hợp lệ" })
            }

            const category = await db.collection("categories").findOne({
                _id: new ObjectId(categoryId),
            })

            if (!category) {
                return res
                    .status(400)
                    .json({ message: "Category không tồn tại" })
            }

            updateTransaction.categoryId = category._id
            updateTransaction.categoryName = category.name
            updateTransaction.categoryIcon = category.icon
        }

        // date -> update createdAt
        if (date) {
            const parsedDate = new Date(date)
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: "Date không hợp lệ" })
            }
            updateTransaction.createdAt = parsedDate.toISOString()
        }

        // update DB
        const result = await db.collection("transactions").updateOne(
            {
                _id: new ObjectId(transactionId),
                userId: new ObjectId(user._id),
            },
            { $set: updateTransaction }
        )

        if (result.matchedCount === 0) {
            return res
                .status(404)
                .json({ message: "Transaction không tồn tại" })
        }

        return res.status(200).json({
            message: "Cập nhật transaction thành công",
        })
    } catch (err) {
        console.error("UPDATE TRANSACTION ERROR:", err)
        return res.status(500).json({ message: "Server error" })
    }
})



// DELETE /api/transactions/:id
router.delete("/transactions/:transactionId", authMiddleware, async (req, res) => {
    try {

        const db = req.db;
        const user = req.user;
        const { transactionId } = req.params;

        if (!ObjectId.isValid(transactionId)) {
            return res.status(400).json({ message: "transactionId không hợp lệ" });
        }

        const result = await db.collection("transactions").deleteOne(
            {
                _id: new ObjectId(transactionId),
                userId: new ObjectId(user._id),
            }
        );

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Transaction không tồn tại" });
        }

        return res.status(200).json({
            message: "Xóa transaction thành công",
            result
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

module.exports = router;
