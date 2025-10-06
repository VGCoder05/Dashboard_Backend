require('dotenv').config();
const express = require("express");
const cookieParser = require('cookie-parser');
const connectDB = require("./db/db")
const cors = require("cors");
// const serverless = require("serverless-http");

// --- Routes ---
const authRoutes = require("./routes/auth.routes")

// --- Middleware ---
const errorHandler = require("./middleware/errorMiddleware")

const app = express()
connectDB();

// --- CORS Configuration ---
let allowedOrigins = [];
if (process.env.CORS_ORIGIN) {
  allowedOrigins = process.env.CORS_ORIGIN
    .split(',') 
    .map(url => url.trim()) 
    .filter(url => url !== ''); 
}

console.log("allowedOrigins: ", allowedOrigins);


app.use(cors({
  origin: (origin, callback) => {
    // Check if the requesting origin is in your whitelist
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true
}));


app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());

// --- ROUTES ---
// --- For Authentication ---
app.use("/auth", authRoutes);

// --- ERROR HANDLER MIDDLEWARE ---
app.use(errorHandler);

module.exports = app;
