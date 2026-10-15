const cloudinary = require("cloudinary").v2;
const memeTemplateSchema = require("../models/memeTemplateSchema");
const AsyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const resHandler = require("../utils/resHandler");

const uploadTemplate = AsyncHandler(async (req, res) => {
    const { name, tags, imageDataUrl, text, texts, look, size, textPositions, allCaps, shrinkAbove, textAlignment } = req.body;

    if (typeof name !== "string" || !name.trim()) throw new AppError("Meme name is required", 400);
    if (name.trim().length > 100) throw new AppError("Meme name must be 100 characters or fewer", 400);
    if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) throw new AppError("Tags must be a list of text values", 400);
    if (typeof imageDataUrl !== "string" || !/^data:image\/(?:png|jpe?g|webp);base64,/.test(imageDataUrl)) {
        throw new AppError("Choose a PNG, JPG, or WebP meme image", 400);
    }
    if (imageDataUrl.length > 11_000_000) throw new AppError("Image must be smaller than 8 MB", 413);
    if (!Array.isArray(texts) || !texts.length) throw new AppError("Add at least one text layer", 400);
    if (!Array.isArray(textPositions) || textPositions.length !== texts.length) throw new AppError("Text positions do not match the text layers", 400);

    const imageResult = await cloudinary.uploader.upload(imageDataUrl, {
        asset_folder: "rexedup/meme-templates",
        folder: "meme-templates",
        resource_type: "image",
    });

    const template = await memeTemplateSchema.create({
        name: name.trim(),
        tags: [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))],
        image: imageResult.secure_url,
        imagePublicId: imageResult.public_id,
        text: typeof text === "string" ? text : "",
        texts,
        look: look && typeof look === "object" ? look : {},
        size: Number.isFinite(Number(size)) ? Number(size) : 14,
        textPositions,
        allCaps: Boolean(allCaps),
        shrinkAbove: Boolean(shrinkAbove),
        textAlignment: ["left", "center", "right"].includes(textAlignment) ? textAlignment : "center",
    });

    return resHandler.success(res, 201, "Meme template uploaded", template);
});

const getTemplates = AsyncHandler(async (req, res) => {
    const templates = await memeTemplateSchema.find().sort({ createdAt: -1 });
    return resHandler.success(res, 200, "Meme templates fetched", templates);
});

const updateTemplate = AsyncHandler(async (req, res) => {
    const { name, tags } = req.body;
    const updates = {};
    if (name !== undefined) {
        if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
            throw new AppError("Meme name must be between 1 and 100 characters", 400);
        }
        updates.name = name.trim();
    }
    if (tags !== undefined) {
        if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) {
            throw new AppError("Tags must be a list of text values", 400);
        }
        updates.tags = [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
    }
    if (!Object.keys(updates).length) throw new AppError("Provide a name or tags to update", 400);

    const template = await memeTemplateSchema.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!template) throw new AppError("Meme template not found", 404);
    return resHandler.success(res, 200, "Meme template updated", template);
});

const deleteTemplate = AsyncHandler(async (req, res) => {
    const template = await memeTemplateSchema.findById(req.params.id);
    if (!template) throw new AppError("Meme template not found", 404);

    await cloudinary.uploader.destroy(template.imagePublicId, { resource_type: "image" });
    await template.deleteOne();
    return resHandler.success(res, 200, "Meme template deleted");
});

module.exports = { uploadTemplate, getTemplates, updateTemplate, deleteTemplate };
