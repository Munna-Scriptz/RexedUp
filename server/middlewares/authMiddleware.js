const AppError = require("../utils/AppError")
const AsyncHandler = require("../utils/AsyncHandler")
const { verifyToken } = require("../services/tokens")

const authMiddleware = AsyncHandler(async (req, res, next) => {
    const token = req.cookies?.["X-AS-TOKEN"];

    if (!token) throw new AppError("No token provided", 401);

    const decoded = verifyToken(token);

    if (!decoded) throw new AppError("Invalid or expired token", 401);

    req.user = decoded;

    next();
});

module.exports = authMiddleware