const mongoose = require("mongoose");

const memeTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    tags: {
        type: [String],
        default: [],
    },
    image: {
        type: String,
        required: true,
    },
    imagePublicId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        default: "",
    },
    texts: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
    },
    look: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    size: {
        type: Number,
        default: 14,
    },
    textPositions: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
    },
    allCaps: {
        type: Boolean,
        default: false,
    },
    shrinkAbove: {
        type: Boolean,
        default: false,
    },
    textAlignment: {
        type: String,
        enum: ["left", "center", "right"],
        default: "center",
    },
}, { timestamps: true });

module.exports = mongoose.model("memeTemplate", memeTemplateSchema);
