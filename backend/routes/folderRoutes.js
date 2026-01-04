const express = require("express");
const {
  createFolder,
  getCurrentFolderData,
  getFoldersByParent,
  deleteFolder,
} = require("../controllers/folderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   Folder routes (protected)
========================= */
router.post("/", protect, createFolder);
router.get("/current/:folderId", protect, getCurrentFolderData);
router.get("/:parentId", protect, getFoldersByParent);
router.delete("/:id", protect, deleteFolder);

module.exports = router;
