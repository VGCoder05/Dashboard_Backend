const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // --- CORE IDENTITY & LOGIN ---
    username: {
      type: String,
      // required: [true, "Username is required."],
      trim: true,
      lowercase: true,
      // Regex to ensure username is simple: alphanumeric, underscores, hyphens
      match: [
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens.",
      ],
      minlength: [3, "Username must be at least 3 characters long."],
      maxlength: [20, "Username cannot be more than 20 characters long."],
    },
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
