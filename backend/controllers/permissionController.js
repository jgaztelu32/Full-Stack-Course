const Permission = require("../models/permissionModel");
const permissionService = require("../services/permissionService");

/* =========================
   Create permission
   - Only users with WRITE permission on the resource
========================= */
const createPermission = async (req, res) => {
  try {
    const { userId, resourceType, resourceId, permissions } = req.body;

    if (!userId || !resourceType || !resourceId || !permissions?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check WRITE permission on the resource
    const canWrite = await permissionService.canWrite(
      req.user.id,
      resourceType,
      resourceId
    );

    const isOwner = await folderOwner(req.user.id, resourceType, resourceId);
    if (!canWrite && !isOwner) {
      return res.status(403).json({
        message: "You don't have permission to grant access to this resource",
      });
    }

    const permission = await Permission.create({
      user: userId,
      resourceType,
      resourceId,
      isOwner: (req.user.id === userId) && isOwner,
      permissions,
    });

    res.status(201).json(permission);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Permission already exists for this user and resource",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Update permission
   - Only users with WRITE permission
========================= */
const updatePermission = async (req, res) => {
  try {
    const { permissions } = req.body;

    if (!permissions?.length) {
      return res.status(400).json({ message: "Permissions are required" });
    }

    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    const canWrite = await permissionService.canWrite(
      req.user.id,
      permission.resourceType,
      permission.resourceId
    );

    const isOwner = await folderOwner(req.user.id, permission.resourceType, permission.resourceId);
    if (!canWrite && !isOwner) {
      return res.status(403).json({
        message: "You don't have permission to modify this permission",
      });
    }

    permission.permissions = permissions;
    await permission.save();

    res.json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Delete permission
   - Only users with WRITE permission
========================= */
const deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    const canWrite = await permissionService.canWrite(
      req.user.id,
      permission.resourceType,
      permission.resourceId
    );

    const isOwner = await folderOwner(req.user.id, permission.resourceType, permission.resourceId);
    if (!canWrite && !isOwner) {
      return res.status(403).json({
        message: "You don't have permission to revoke this access",
      });
    }

    await permission.deleteOne();

    res.json({ message: "Permission deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Get permissions by resource
========================= */
const getPermissionsByResource = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;

    const canWrite = await permissionService.canWrite(
      req.user.id,
      resourceType,
      resourceId
    );

    const isOwner = await folderOwner(req.user.id, resourceType, resourceId);
    if (!canWrite && !isOwner) {
      return res.status(403).json({
        message: "You don't have permission to view permissions for this resource",
      });
    }

    const permissions = await Permission.find({
      resourceType,
      resourceId,
    }).populate("user", "name email");

    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

folderOwner = async (userId, resourceType, resourceId) => {
  if (resourceType === "folder") {
    const folder = await require("../models/folderModel").findById(resourceId);
    return folder && folder.userId.toString() === userId;
  } else {
    const file = await require("../models/fileModel").findById(resourceId);
    if (!file) return false;
    const folder = await require("../models/folderModel").findById(file.parent);
    return folder && folder.userId.toString() === userId;
  }
};

module.exports = {
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionsByResource,
};
