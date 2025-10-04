const express = require("express");

// --- Middleware ---
const  auth  = require("../middleware/authMiddleware");

const {
  register,
  login,
  me,
  logout,
} = require("../controllers/auth.controller");

const route = express.Router();

route.post("/register", register);
route.post("/login", login);
route.get("/me", auth, me);
route.delete("/logout", logout);


module.exports = route;
