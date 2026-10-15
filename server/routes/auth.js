const express = require('express')
const router = express.Router()
const { signup, signin, logout, profile } = require('../controllers/authController')
const { verifyToken } = require('../services/tokens')

const optionalAuthMiddleware = (req, res, next) => {
    const token = req.cookies?.["X-AS-TOKEN"];
    if (token) {
        try {
            req.user = verifyToken(token);
        } catch {
            req.user = null;
        }
    }
    next();
}

// -------------------------- Post
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/logout', logout)
// -------------------------- Put

// -------------------------- Get
router.get('/profile', optionalAuthMiddleware, profile)

// --------------------------



module.exports = router
