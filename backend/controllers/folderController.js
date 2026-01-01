const Folder = require("../models/folderModel");
const permission = require("../services/permissionService");

/* =========================
   Create folder
========================= */
const createFolder = async (req, res) => {
  try {
    const { name, description, parent, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId es obligatorio" });
    }

    if (!(await permission.canWrite(userId, "folder", parent))) {
        return res.status(403).json({
            message: "You don't have permission to create folders here",
        });
    }

    const folder = await Folder.create({
      name,
      description,
      parent: parent || null,
      userId,
    });

    res.status(201).json(folder);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Folder with that name already exists in the specified parent folder",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

/* =========================
   List folders by parent
========================= */
const getFoldersByParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    const userId = req.user.id;

    const query = parentId === "root"
      ? { parent: null }
      : { parent: parentId };

    const all_folders = await Folder.find(query).sort({ name: 1 });

    const folders = all_folders.filter(folder => {
      return permission.canRead(userId, "folder", folder._id);
    });

    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({
      message: "Error getting folders. Internal error.",
      error: error.message,
    });
  }
};

/* =========================
   Delete folder (recursive)
========================= */
const deleteFolderRecursive = async (folderId) => {
    const children = await Folder.find({ parent: folderId });

    for (const child of children) {
        await deleteFolderRecursive(child._id);
    }

    await Folder.findByIdAndDelete(folderId);
};

const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;

        const folder = await Folder.findById(id);
        if (!folder) {
            return res.status(404).json({
                message: "Folder not found",
            });
        }

        if (!(await permission.canWrite(req.user.id, "folder", id))) {
            return res.status(403).json({
                message: "You don't have permission to delete this folder",
            });
        }

        await deleteFolderRecursive(id);

        res.status(200).json({
            message: "Folder deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting folder. Internal error.",
            error: error.message,
        });
    }
};

module.exports = {
  createFolder,
  getFoldersByParent,
  deleteFolder,
};
