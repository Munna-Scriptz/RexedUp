const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    totalMemes: {
        type: Number,
        default: 0
    }
})


module.exports = mongoose.model("category", categorySchema);