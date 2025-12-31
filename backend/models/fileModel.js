const mongoose = require("mongoose");

/* =========================
   Schema
========================= */
const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 128,
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
      required: true,
      index: true,
    },

    size: {
      type: Number,
      required: true,
    },

    data: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "files",
  }
);

/* =========================
   Indexes
========================= */
// Avoid duplicates in the same folder
fileSchema.index(
  { parent: 1, name: 1 },
  { unique: true }
);

// Partial search by name and description
fileSchema.index({
  name: "text",
  description: "text",
});


module.exports = mongoose.model("File", fileSchema);
