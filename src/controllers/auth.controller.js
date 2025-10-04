import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Reusable function to generate token and set cookie
const generateTokenAndSetCookie = (user, res) => {
  const token = jwt.sign(
    { userID: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

const register = asyncHandler(async (req, res) => {
  // 1. Get data from request
  const { username, email, password } = req.body;

  // 2. Validate data (simple validation for now)
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // 3. Check if user already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // 4. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Create user in DB
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  // 6. Generate token and set cookie
  generateTokenAndSetCookie(user, res);

  // 7. Prepare response (NEVER send the password)
  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  
  res.status(201).json({
    message: "User created successfully",
    user: createdUser,
  });
});


const login = asyncHandler(async (req, res) => {
  // 1. Get data
  const { email, password } = req.body;

  // 2. Validate
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // 3. Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 4. Compare password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 5. Generate token
  generateTokenAndSetCookie(user, res);

  // 6. Prepare response
  const loggedInUser = await User.findById(user._id).select("-password");

  res.status(200).json({
    message: "Login successful",
    user: loggedInUser,
  });
});

const me = asyncHandler(async (req, res) => {
  // 1. Get data
  const { id } = req.user;

  // 2. Prepare response
  const loggedInUser = await User.findById({id});
  // const loggedInUser = await User.findById(user._id).select("-password");

  res.status(200).json({
    message: "Login successful",
    user: loggedInUser,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiry date to the past
  });

  res.status(200).json({ message: "Logout successful" });
});

export { register, login, me,  logout };
