const express = require("express");
const {
  registerUser,
  login,
  changeUserName,
  changeUserPassword,
  removeUser,
  whoami
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   Auth
========================= */
router.post("/register", registerUser);
router.post("/login", login);
router.post("/whoami", protect, whoami);

/* =========================
   User management
========================= */
router.put("/:id/name", protect, changeUserName);
router.put("/:id/password", protect, changeUserPassword);
router.delete("/:id", protect, removeUser);

module.exports = router;