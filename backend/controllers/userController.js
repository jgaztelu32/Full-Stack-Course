const User = require("../models/userModel");
const bcrypt = require("bcrypt");

/* =========================
   New user registration
========================= */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error("El usuario ya existe");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashed,
    });

    userId = user._id;

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

    const user = await User.findOne({ email });
    if (!user) {
    throw new Error("Credenciales inválidas");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
    throw new Error("Credenciales inválidas");
    }
    
    res.status(200).json({
      message: "Success",
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/* =========================
   Modify name
========================= */
const changeUserName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await User.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );

  res.status(200).json({ message: "Nombre actualizado correctamente" });
};

/* =========================
   Modify password
========================= */
const changeUserPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(
    id,
    { password: hashed },
    { new: true }
  );

  res.status(200).json({ message: "Contraseña actualizada correctamente" });
};

/* =========================
   Delete user
========================= */
const removeUser = async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.status(200).json({ message: "Usuario eliminado correctamente" });
};

module.exports = {
  registerUser,
  login,
  changeUserName,
  changeUserPassword,
  removeUser,
};
