const {
  createUser,
  updateUserName,
  updateUserPassword,
  deleteUser,
  loginUser,
  logoutUser,
} = require("../models/userModel");

/* =========================
   New user registration
========================= */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const userId = await createUser(name, email, password);

    res.status(201).json({
      message: "Usuario creado correctamente",
      userId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =========================
   Login
========================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    res.status(200).json({
      message: "Login correcto",
      user,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/* =========================
   Logout
========================= */
const logout = async (req, res) => {
  const result = await logoutUser();
  res.status(200).json(result);
};

/* =========================
   Modify name
========================= */
const changeUserName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await updateUserName(id, name);
  res.status(200).json({ message: "Nombre actualizado correctamente" });
};

/* =========================
   Modify password
========================= */
const changeUserPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  await updateUserPassword(id, password);
  res.status(200).json({ message: "Contraseña actualizada correctamente" });
};

/* =========================
   Delete user
========================= */
const removeUser = async (req, res) => {
  const { id } = req.params;

  await deleteUser(id);
  res.status(200).json({ message: "Usuario eliminado correctamente" });
};

module.exports = {
  registerUser,
  login,
  logout,
  changeUserName,
  changeUserPassword,
  removeUser,
};
