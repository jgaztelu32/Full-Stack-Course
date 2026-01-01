const mongoose = require("mongoose");

/* =========================
   Schema
========================= */
const permissionSchema = new mongoose.Schema(
  {
    // User who owns the permission
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Type of protected resource
    // Currently supported: folder | file
    resourceType: {
      type: String,
      required: true,
      enum: ["folder", "file"],
      index: true,
    },

    // ID of the protected resource
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "resourceType",
      index: true,
    },

    // Allowed actions over the resource
    // write permission also implies delete
    permissions: {
      type: [
        {
          type: String,
          enum: ["read", "write"],
        },
      ],
      required: true,
      default: [],
    },

    // Indicates if the user is the owner of the resource
    // Owners have full access implicitly
    isOwner: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "permissions",
  }
);

/* =========================
   Indexes
========================= */

// Ensure a single permission entry per user and resource
permissionSchema.index(
  { user: 1, resourceType: 1, resource: 1 },
  { unique: true }
);

// Fast lookup by resource
permissionSchema.index({ resourceType: 1, resource: 1 });

// Fast lookup by user
permissionSchema.index({ user: 1 });

module.exports = mongoose.model("Permission", permissionSchema);
