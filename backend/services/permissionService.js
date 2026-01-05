const Permission = require("../models/permissionModel");
const Folder = require("../models/folderModel");
const File = require("../models/fileModel");

/* =========================
   Internal helpers
========================= */

// Check explicit permission on a resource
const checkExplicitPermission = async (
  userId,
  resourceType,
  resourceId,
  action
) => {
  const permission = await Permission.findOne({
    user: userId,
    resourceType,
    resource: resourceId,
  });

  if (!permission) return null;

  if (permission.isOwner) return true;

  return permission.permissions.includes(action);
};

// Get parent resource
const getParentResource = async (resourceType, resourceId) => {
  if (resourceType === "file") {
    const file = await File.findById(resourceId).select("parent");
    const folder = await Folder.findById(file.parent).select("parent");
    if (!folder) return null;
    return { type: "folder", id: folder.parent };
  }

  if (resourceType === "folder") {
    const folder = await Folder.findById(resourceId).select("parent");
    if (!folder || !folder.parent) return null;
    return { type: "folder", id: folder.parent };
  }

  return null;
};

// Recursive permission resolution
const resolvePermission = async (
  userId,
  resourceType,
  resourceId,
  action
) => {
  const explicit = await checkExplicitPermission(
    userId,
    resourceType,
    resourceId,
    action
  );

  // Explicit allow / deny
  if (explicit !== null) return explicit;

  // Try folder owner
  if( resourceType === "folder" ) {
    const folder = await Folder.findById(resourceId).select("userId");
    if (folder && folder.userId == userId) {
      return true;
    }
  }

  // Try parent
  const parent = await getParentResource(resourceType, resourceId);
  if (!parent) return false;

  return resolvePermission(userId, parent.type, parent.id, action);
};

/* =========================
   Public API
========================= */

const canRead = async (userId, resourceType, resourceId) => {
  return resolvePermission(userId, resourceType, resourceId, "read");
};

const canWrite = async (userId, resourceType, resourceId) => {
  return resolvePermission(userId, resourceType, resourceId, "write");
};

module.exports = {
  canRead,
  canWrite,
};
