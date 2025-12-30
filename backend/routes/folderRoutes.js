const express = require("express");
const {
  createFolder,
  getFoldersByParent,
  deleteFolder,
} = require("../controllers/folderController");

const router = express.Router();

/* =========================
   Folder routes (protected)
========================= */
router.post("/", createFolder);
router.get("/:parentId", getFoldersByParent);
router.delete("/:id", deleteFolder);

module.exports = router;
