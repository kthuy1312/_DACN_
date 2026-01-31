const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await req.db
            .collection("users")
            .findOne({ _id: new ObjectId(decoded.userId) });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};


module.exports = authMiddleware;
