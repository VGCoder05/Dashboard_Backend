const express = require("express");
const cookieParser = require('cookie-parser');
const connectDB = require("./db/db")
const cors = require("cors");
const serverless = require("serverless-http");

// --- Routes ---
const authRoutes = require("./routes/auth.routes")

// --- Middleware ---
const errorHandler = require("./middleware/errorMiddleware")

const app = express()
connectDB();


app.use(cors({
  origin: process.env.CORS_ORIGIN?.trim(), // Your frontend URL from .env
  credentials: true
}));
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());

// --- ROUTES ---
// --- For Authentication ---
app.use("/auth", authRoutes);

// --- ERROR HANDLER MIDDLEWARE ---
app.use(errorHandler);

module.exports = serverless(app);
