const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    technologies: [{
        type: String,
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model('project', projectSchema)