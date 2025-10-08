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
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });

  return token;
};

const register = asyncHandler(async (req, res) => {
  // 1. Get data from request
  const { email, password, role } = req.body;

  // 2. Validate data (simple validation for now)
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // 3. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // 4. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Create user in DB
    const user = await User.create({
    email,
    password: hashedPassword,
    role: "free", // Always start as free user
    subscription: {
      status: "none",
    },
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

// To change the role of user ["free", "pro"]
const upgradeToPremium = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  // In production, integrate with payment gateway here
  // For now, just upgrade the user
  
  const user = await User.findByIdAndUpdate(
    userId,
    {
      role: "premium",
      subscription: {
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        plan: "monthly",
      },
    },
    { new: true }
  ).select("-password");

  res.status(200).json({
    message: "Successfully upgraded to premium",
    user,
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
  // 1. Get data from the middleware
  const { userID } = req.user; // Assuming your JWT payload has an 'userID' field
  
  if (!userID) {
    return res.status(400).json({ message: "User ID not found in token" });
  }

  // 2. Find the user correctly
  const loggedInUser = await User.findById(userID).select("-password"); 

  if (!loggedInUser) {
    return res.status(404).json({ message: "User not found" });
  }
  
  // 3. Prepare and send the response
  res.status(200).json({
    message: "User fetched successfully",
    user: loggedInUser,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiry date to the past
    path: '/',
  });

  res.status(200).json({ message: "Logout successful" });
});

export { register, login, me,  logout, upgradeToPremium };
