const express = require("express");
const {
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionsByResource,
} = require("../controllers/permissionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   Permission routes
========================= */

// Create permission
router.post("/", protect, createPermission);

// Update permission
router.put("/:id", protect, updatePermission);

// Delete permission
router.delete("/:id", protect, deletePermission);

// Get permissions for a resource
router.get("/:resourceType/:resourceId", protect, getPermissionsByResource);

module.exports = router;