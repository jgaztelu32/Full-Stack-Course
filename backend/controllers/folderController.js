const Folder = require("../models/folderModel");

/* =========================
   Create folder
========================= */
const createFolder = async (req, res) => {
  try {
    const { name, description, parent, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId es obligatorio" });
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
        message: "Ya existe una carpeta con ese nombre en este nivel",
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
    const { userId } = req.query; /* We'll use it when implementing user-specific folder access */

    const query = parentId === "root"
      ? { parent: null }
      : { parent: parentId };

    const folders = await Folder.find(query).sort({ name: 1 });

    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo carpetas",
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
        message: "La carpeta no existe",
      });
    }

    await deleteFolderRecursive(id);

    res.status(200).json({
      message: "Carpeta eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error eliminando la carpeta",
      error: error.message,
    });
  }
};

module.exports = {
  createFolder,
  getFoldersByParent,
  deleteFolder,
};
