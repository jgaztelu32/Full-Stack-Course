const express = require("express");
const {
  registerUser,
  login,
  logout,
  changeUserName,
  changeUserPassword,
  removeUser,
} = require("../controllers/userController");

const router = express.Router();

/* =========================
   Auth
========================= */
router.post("/register", registerUser);
router.post("/login", login);
router.get("/:id/logout", logout);

/* =========================
   User management
========================= */
router.put("/:id/name", changeUserName);
router.put("/:id/password", changeUserPassword);
router.delete("/:id", removeUser);

module.exports = router;