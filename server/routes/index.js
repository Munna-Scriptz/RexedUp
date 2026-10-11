const express = require('express')
const errorHandler = require('../middlewares/errorHandler')
const router = express.Router()
const auth = require('./auth')

// ════════════════════ All Routes ════════════════════
router.use('/auth', auth)


// ════════════════════ Other Routes ════════════════════
router.get('/', (req, res) => { res.send("Hello world") })
router.use((req, res) => { res.status(404).send('404 Page Not Found') })
router.use(errorHandler);

module.exports = router