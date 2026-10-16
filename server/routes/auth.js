const express = require('express')
const router = express.Router()
const { signup, signin, logout, profile } = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

// -------------------------- Post
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/logout', logout)
// -------------------------- Put

// -------------------------- Get
router.get('/profile', authMiddleware, profile)

// --------------------------



module.exports = router
