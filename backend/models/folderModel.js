const mongoose = require("mongoose");

/* =========================
   Schema
========================= */
const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1024,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "folders",
  }
);

/* =========================
   Indexes
========================= */
// Avoid duplicates in the same folder
folderSchema.index(
  { parent: 1, name: 1 },
  { unique: true }
);

module.exports = mongoose.model("Folder", folderSchema);
