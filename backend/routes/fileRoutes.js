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
router.post("/", upload.single("file"), createFile);

// Get files by folder
router.get("/folder/:folderId", getFilesByFolder);

// Search files by name/description
router.get("/search", searchFiles);

// Get file content
router.get("/:id", getFile);

// Update file (multipart)
router.put("/:id", upload.single("file"), updateFile);

// Delete file
router.delete("/:id", deleteFile);

module.exports = router;
