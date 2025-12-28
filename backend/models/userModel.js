const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/* =========================
   Schema
========================= */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

/* =========================
   Model
========================= */
const User = mongoose.model("User", userSchema);

/* =========================
   Create user
========================= */
const createUser = async (name, email, password) => {
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

  return user._id;
};

/* =========================
   Modify name
========================= */
const updateUserName = async (id, name) => {
  return User.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
};

/* =========================
   Modify password
========================= */
const updateUserPassword = async (id, password) => {
  const hashed = await bcrypt.hash(password, 10);

  return User.findByIdAndUpdate(
    id,
    { password: hashed },
    { new: true }
  );
};

/* =========================
   Delete user
========================= */
const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};

/* =========================
   Login
========================= */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new Error("Credenciales inválidas");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

/* =========================
   Logout
========================= */
const logoutUser = async () => {
  return { message: "Logout correcto" };
};

module.exports = {
  createUser,
  updateUserName,
  updateUserPassword,
  deleteUser,
  loginUser,
  logoutUser,
};
