const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const authMiddleware = require("../middleware/authMiddleware")


//GET /api/categories
router.get("/categories", authMiddleware, async (req, res) => {
    try {
        const db = req.db;

        const categories = await db
            .collection("categories")
            .find({})
            .toArray();

        return res.status(200).json({
            message: "Lấy danh sách categories thành công",
            categories
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

//POST /api/categories
// router.post("/categories", authMiddleware, async (req, res) => {
//     try {
//         const user = req.user;
//         const db = req.db;

//         const { name, icon, type } = req.body;

//         if (!name || !icon || !type) {
//             return res.status(400).json({ message: "Missing fields" });
//         }

//         if (type !== "income" && type !== "expense") {
//             return res.status(400).json({ message: "Type của transaction không hợp lệ" });
//         }

//         const newCategory = {
//             userId: new ObjectId(user._id),
//             name,
//             icon,
//             type,
//             isDefault: false,
//             createdAt: new Date().toISOString(),
//         }

//         const result = await db.collection("categories").insertOne(newCategory)

//         return res.status(201).json({
//             message: "Thêm category thành công",
//             categoryId: result.insertedId,
//             newCategory
//         });
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// });

// //PUT /api/categories/:categoryId
// router.put("/categories/:categoryId", authMiddleware, async (req, res) => {
//     try {
//         const user = req.user;
//         const db = req.db;
//         const { categoryId } = req.params;

//         const { name, icon, typex1 } = req.body;

//         if (!ObjectId.isValid(categoryId)) {
//             return res.status(400).json({ message: "categoryId không hợp lệ" });
//         }

//         if (!name && !icon && !type) {
//             return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
//         }

//         if (type && type !== "income" && type !== "expense") {
//             return res.status(400).json({ message: "Type của transaction không hợp lệ" });
//         }


//         let updateCategory = {
//             updatedAt: new Date().toISOString(),
//         };
//         if (name) updateCategory.name = name;
//         if (icon) updateCategory.icon = icon;
//         if (type) updateCategory.type = type;

//         const result = await db.collection("categories").updateOne(
//             {
//                 _id: new ObjectId(categoryId),
//                 userId: new ObjectId(user._id),
//             },
//             { $set: updateCategory }
//         );

//         if (result.matchedCount === 0) {
//             return res.status(404).json({ message: "Category không tồn tại" });
//         }

//         return res.status(201).json({
//             message: "Cập nhật category thành công",
//             result
//         });

//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// });

// //DELETE /api/categories/:categoryId
// router.delete("/categories/:categoryId", authMiddleware, async (req, res) => {
//     try {
//         const user = req.user;
//         const db = req.db;
//         const { categoryId } = req.params;

//         if (!ObjectId.isValid(categoryId)) {
//             return res.status(400).json({ message: "categoryId không hợp lệ" });
//         }

//         const categoryObjectId = new ObjectId(categoryId);

//         //lấy category
//         const category = await db.collection("categories").findOne({
//             _id: categoryObjectId,
//             userId: new ObjectId(user._id),
//             isDeleted: { $ne: true }
//         });

//         if (!category) {
//             return res.status(404).json({ message: "Category không tồn tại" });
//         }

//         //không cho xóa category mặc định
//         if (category.isDefault) {
//             return res.status(400).json({
//                 message: "Không thể xóa category mặc định"
//             });
//         }

//         //Lấy category mặc định để thế vô
//         const uncategorized = await db.collection("categories").findOne({
//             isDefault: true,
//             type: category.type,
//             name: "Default"
//         });

//         if (!uncategorized) {
//             return res.status(500).json({
//                 message: "Thiếu category mặc định (Uncategorized)"
//             });
//         }

//         //Chuyển transactions sang Uncategorized
//         await db.collection("transactions").updateMany(
//             {
//                 userId: new ObjectId(user._id),
//                 categoryId: categoryObjectId
//             },
//             {
//                 $set: {
//                     categoryId: uncategorized._id,
//                     updatedAt: new Date().toISOString()
//                 }
//             }
//         );

//         //Soft delete category
//         await db.collection("categories").updateOne(
//             { _id: categoryObjectId },
//             {
//                 $set: {
//                     isDeleted: true,
//                     deletedAt: new Date().toISOString()
//                 }
//             }
//         );

//         return res.status(200).json({
//             message: "Xóa category thành công"
//         });

//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// });

module.exports = router;
