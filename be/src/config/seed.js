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
        email: "1@gmail.com",
        name: "1111",
        password: hashPwd,
        role: "Client",
        avatar: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const { insertedId: userId } = await db.collection("users").insertOne(user);

    /* ================= CATEGORIES ================= */
    const categories = [
        { name: "Food", icon: "Utensils" },
        { name: "Transportation", icon: "Car" },
        { name: "Entertainment", icon: "Film" },
        { name: "Utilities", icon: "Lightbulb" },
        { name: "Healthcare", icon: "HeartPulse" },
        { name: "Shopping", icon: "ShoppingBag" },

        { name: "Income", icon: "DollarSign" },
        { name: "Salary", icon: "Briefcase" },
        { name: "Freelance", icon: "Laptop" },

        { name: "Subscription", icon: "CreditCard" },
        { name: "Travel", icon: "Plane" },
        { name: "Rent", icon: "Home" },
        { name: "Insurance", icon: "Shield" },
        { name: "Education", icon: "GraduationCap" },
        { name: "Fitness", icon: "Dumbbell" },
        { name: "Dining", icon: "Pizza" },
        { name: "Gas", icon: "Fuel" },
        { name: "Groceries", icon: "ShoppingCart" },
        { name: "Other", icon: "Tag" }
    ].map((c) => ({
        _id: new ObjectId(),
        name: c.name,
        icon: c.icon,
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
