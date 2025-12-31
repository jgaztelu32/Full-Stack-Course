const File = require("../models/fileModel");

/* =========================
   Create file (multipart)
========================= */
const createFile = async (req, res) => {
  try {
    const { name, description, parent } = JSON.parse(req.body.metadata);

    if (!req.file) {
      return res.status(400).json({ message: "Archivo no enviado" });
    }

    const file = await File.create({
      name,
      description,
      parent,
      size: req.file.size,
      data: req.file.buffer,
    });

    res.status(201).json({
      id: file._id,
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ya existe un archivo con ese nombre en la carpeta",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Get file
========================= */
const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    res.set("Content-Type", "application/octet-stream");
    res.set(
      "Content-Disposition",
      `attachment; filename="${file.name}"`
    );

    res.send(file.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Update file
========================= */
const updateFile = async (req, res) => {
  try {
    const updates = {};

    // Metadata optional
    if (req.body.metadata) {
      const metadata = JSON.parse(req.body.metadata);

      if (metadata.name) updates.name = metadata.name;
      if (metadata.description) updates.description = metadata.description;
      if (metadata.parent) updates.parent = metadata.parent;
    }

    // File is optional
    if (req.file) {
      updates.data = req.file.buffer;
      updates.size = req.file.size;
    }

    const file = await File.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    res.json({
      id: file._id,
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Delete file
========================= */
const deleteFile = async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    res.json({ message: "Archivo eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Get files by folder
========================= */
const getFilesByFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const files = await File.find(
      { parent: folderId },
      {
        data: 0, // Exclude file data
      }
    );

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Search files by name/description
========================= */
const searchFiles = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "El parámetro query es obligatorio",
      });
    }

    const regex = new RegExp(query, "i");

    const files = await File.find(
      {
        $or: [
          { name: regex },
          { description: regex },
        ],
      },
      {
        data: 0, // Exclude file data
      }
    );

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFile,
  getFile,
  updateFile,
  deleteFile,
  getFilesByFolder,
  searchFiles,
};
