// ════════════════════ Imports ════════════════════
require('dotenv').config({ quiet: true })
const express = require("express")
const cors = require("cors")
const cookieParser = require('cookie-parser')
const db = require('./db')
const router = require("./routes")
const app = express()

// ════════════════════ Database Connection ════════════════════
db()

// ════════════════════ Middlewares ════════════════════
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ════════════════════ Routes ════════════════════
app.use(router)

// ════════════════════ Server Listener ════════════════════
if (process.env.NODE_ENV !== "production") {
    app.listen(8000, () => {
        console.log('Server Is Running')
    })
}

module.exports = app