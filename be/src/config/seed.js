// src/seed.js
const { ObjectId } = require("mongodb");
const { hashPassword } = require("../utils/password")

async function runSeed(db) {

    const userCount = await db.collection("users").countDocuments();
    if (userCount > 0) {
        console.log("🌱 Seed skipped (data exists)");
        return;
    }

    console.log("🌱 Running SmartFinance seed...");

    const pwd = "123456"
    const hashPwd = await hashPassword(pwd)

    /* ================= USER ================= */
    const user = {
        email: "admin@smartfinance.dev",
        name: "Admin",
        password: hashPwd,
        role: "Admin",
        avatar: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const { insertedId: userId } = await db.collection("users").insertOne(user);

    /* ================= CATEGORIES ================= */
    const categories = [
        { name: "Food", icon: "Utensils", type: "expense" },
        { name: "Transport", icon: "Bus", type: "expense" },
        { name: "Entertainment", icon: "Film", type: "expense" },
        { name: "Salary", icon: "Wallet", type: "income" },
        { name: "Default", icon: "CircleDollarSign", type: "income" },
        { name: "Default", icon: "CircleDollarSign", type: "expense" },
    ].map((c) => ({
        _id: new ObjectId(),
        name: c.name,
        icon: c.icon,
        type: c.type,
        isDefault: true,
        createdAt: new Date().toISOString(),
    }));

    await db.collection("categories").insertMany(categories);

    /* ================= TRANSACTIONS ================= */
    const transactions = [
        {
            categoryName: "Salary",
            type: "income",
            amount: 3000,
            description: "Monthly salary",
        },
        {
            categoryName: "Food",
            type: "expense",
            amount: 150,
            description: "Groceries",
        },
    ].map((t) => {
        const cat = categories.find((c) => c.name === t.categoryName);
        return {
            userId,
            categoryId: cat._id,
            categoryName: cat.name,
            categoryIcon: cat.icon,
            type: t.type,
            amount: t.amount,
            description: t.description,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };
    });

    await db.collection("transactions").insertMany(transactions);

    /* ================= BUDGET ================= */
    await db.collection("budgets").insertOne({
        userId,
        categoryId: categories[0]._id,
        limit: 500,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        createdAt: new Date().toISOString(),
    });

    /* ================= SAVING GOAL ================= */
    await db.collection("saving_goals").insertOne({
        userId,
        name: "Emergency Fund",
        targetAmount: 2000,
        currentAmount: 300,
        deadline: null,
        createdAt: new Date().toISOString(),
    });

    /* ================= AI INSIGHTS ================= */
    await db.collection("ai_insights").insertOne({
        userId,
        insights: [
            {
                message: "Your spending is under control. Keep it up!",
                type: "success",
                createdAt: new Date().toISOString(),
            },
        ],
        suggestions: [
            { message: "Set monthly budgets", icon: "Pin" },
            { message: "Review subscriptions", icon: "Lightbulb" },
        ],
        period: {
            from: new Date(new Date().setDate(1)).toISOString(),
            to: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
    });

    console.log("✅ Seed completed successfully");
}

module.exports = { runSeed };
