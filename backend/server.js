const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const port = process.env.PORT || 8000;
const userRoutes = require("./routes/userRoutes");

const app = express();

/* =========================
   Middlewares
========================= */
app.use(express.json());

/* =========================
   Routes
========================= */
app.use("/api/users", userRoutes);

/* =========================
   Server
========================= */
app.listen(port, () => console.log(`Server started on port ${port}`));