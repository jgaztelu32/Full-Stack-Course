const express = require("express");
const multer = require("multer");

const {
  createFile,
  getFile,
  updateFile,
  deleteFile,
  getFilesByFolder,
  searchFiles,
} = require("../controllers/fileController");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();
const upload = multer();

/* =========================
   File routes
========================= */

/**
 * Upload file (multipart)
 * metadata: JSON (name, description, parent)
 * file: binary file
 */
router.post("/", protect, upload.single("file"), createFile);

// Get files by folder
router.get("/folder/:folderId", protect, getFilesByFolder);

// Search files by name/description
router.get("/search", protect, searchFiles);

// Get file content
router.get("/:id", protect, getFile);

// Update file (multipart)
router.put("/:id", protect, upload.single("file"), updateFile);

// Delete file
router.delete("/:id", protect, deleteFile);

module.exports = router;
