const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./controllers/config/db');
const port = process.env.PORT || 8000;
const userRoutes = require("./routes/userRoutes");
const folderRoutes = require("./routes/folderRoutes");
const fileRoutes = require("./routes/fileRoutes");
const { protect } = require("./middleware/authMiddleware");

const app = express();

connectDB();

/* =========================
   Middlewares
========================= */
app.use(express.json());

/* =========================
   Routes
========================= */
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);


/* =========================
   Server
========================= */
app.listen(port, () => console.log(`Server started on port ${port}`));