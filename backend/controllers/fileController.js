const File = require("../models/fileModel");
const permission = require("../services/permissionService");

/* =========================
   Create file (multipart)
========================= */
const createFile = async (req, res) => {
  try {
    const { name, description, parent } = JSON.parse(req.body.metadata);

    if (!req.file) {
      return res.status(400).json({ message: "File not uploaded" });
    }

    if (!(await permission.canWrite(req.user.id, "folder", parent))) {
        return res.status(403).json({
            message: "You don't have permission to create files here",
        });
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
        message: "File with that name already exists in the specified parent folder",
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
      return res.status(404).json({ message: "File not found" });
    }

    if (!(await permission.canRead(req.user.id, "folder", file.parent))) {
        return res.status(403).json({
            message: "You don't have permission to read this file",
        });
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

    const old_file = await File.findById(req.params.id);

    if (!old_file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!(await permission.canWrite(req.user.id, "folder", old_file.parent))) {
        return res.status(403).json({
            message: "You don't have permission to create files here",
        });
    }

    const file = await File.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

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
    const old_file = await File.findById(req.params.id);

    if (!old_file) {
        return res.status(404).json({ message: "File not found" });
    }

    if (!(await permission.canWrite(req.user.id, "file", req.params.id))) {
        return res.status(403).json({
            message: "You don't have permission to delete this file",
        });
    }

    try {
        const file = await File.findByIdAndDelete(req.params.id);

        res.json({ message: "File deleted" });
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

        const all_files = await File.find(
        { parent: folderId },
        {
            data: 0, // Exclude file data
        }
        );

        // Filter files by read permission
        const userId = req.user.id;
        const files = all_files.filter(file => {
            return permission.canRead(userId, "file", file._id);
        });
        
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
            message: "Query parameter is required",
        });
        }

        const regex = new RegExp(query, "i");

        const all_files = await File.find(
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

        // Filter files by read permission
        const userId = req.user.id;
        const files = all_files.filter(file => {
            return permission.canRead(userId, "file", file._id);
        });
            
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
