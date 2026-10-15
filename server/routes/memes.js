const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleCheckMiddleware = require("../middlewares/roleCheckMiddleware");
const { uploadTemplate, getTemplates, updateTemplate, deleteTemplate } = require("../controllers/memeTemplateController");

const router = express.Router();
const adminOnly = [authMiddleware, roleCheckMiddleware("admin")];

router.get("/templates", getTemplates);
router.post("/templates", ...adminOnly, uploadTemplate);
router.patch("/templates/:id", ...adminOnly, updateTemplate);
router.delete("/templates/:id", ...adminOnly, deleteTemplate);

module.exports = router;
