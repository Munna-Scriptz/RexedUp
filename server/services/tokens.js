const jwt = require("jsonwebtoken")
const crypto = require("crypto");

// ════════════════════ Access Token ════════════════════
const generateAccToken = (data) => {
    return jwt.sign({
        _id: data._id,
        username: data.username,
        role: data.role,
    }, process.env.JWT_SEC, { expiresIn: "6h" });
};

// ════════════════════ Refresh Token ════════════════════
const generateRefToken = (data) => {
    return jwt.sign({
        _id: data._id,
        username: data.username,
        role: data.role,
    }, process.env.JWT_SEC, { expiresIn: "7d" });
};

// ════════════════════ Verify Token ════════════════════
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SEC);
};

// ════════════════════ Password Reset Token ════════════════════
const genResetToken = () => {
    const token = crypto.randomBytes(32).toString("hex");
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    return { token, hashToken };
};

// ════════════════════ Hash PAssword Reset Token ════════════════════
const hashResetToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = { generateAccToken, generateRefToken, verifyToken, genResetToken, hashResetToken }