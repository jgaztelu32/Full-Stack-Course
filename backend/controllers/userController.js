const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* =========================
   New user registration
========================= */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error("User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashed,
    });

    const userId = user._id;
    const token = generateToken(userId);

    res.status(201).json({
      message: "User created successfully",
      userId,
      token,
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
    throw new Error("Invalid credentials");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
    throw new Error("Invalid credentials");
    }
    
    const token = generateToken(user._id);
    
    res.status(200).json({
      message: "Success",
      id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/* =========================
   Get user info
========================= */
const whoami = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
  });
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

  res.status(200).json({ message: "Name updated successfully" });
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

  res.status(200).json({ message: "Password updated successfully" });
};

/* =========================
   Delete user
========================= */
const removeUser = async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.status(200).json({ message: "User deleted successfully" });
};

/* =========================
   Generate JWT
========================= */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

module.exports = {
  registerUser,
  login,
  whoami,
  changeUserName,
  changeUserPassword,
  removeUser,
};
