const express = require('express')
const router = express.Router()
const { signup, signin, logout, profile } = require('../controllers/authController')

// -------------------------- Post
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/logout', logout)
// -------------------------- Put

// -------------------------- Get
router.get('profile', profile)

// --------------------------



module.exports = router
