const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // --- CORE IDENTITY & LOGIN ---
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      // A standard, robust regex for email validation
      match: [/\S+@\S+\.\S+/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
      // You have to explicitly ask for it, e.g., User.findOne().select('+password')
      // select: false,
    },

  },
  {
    timestamps: true, // createdAt, updatedAt
    // This enables virtuals to be included when you convert a document to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
