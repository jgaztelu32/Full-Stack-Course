const express = require("express");
const multer = require("multer");

const {
  createFile,
  getFile,
  updateFile,
  deleteFile,
} = require("../controllers/fileController");

const router = express.Router();
const upload = multer();

/* =========================
   File routes
========================= */

/**
 * Subir archivo (multipart)
 * metadata: JSON (name, description, parent)
 * file: archivo binario
 */
router.post("/", upload.single("file"), createFile);

/**
 * Obtener archivo
 */
router.get("/:id", getFile);

/**
 * Actualizar metadata
 */
router.put("/:id", upload.single("file"), updateFile);

/**
 * Eliminar archivo
 */
router.delete("/:id", deleteFile);

module.exports = router;
