import ApiError from '../utils/ApiError.js';

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const userRole = req.user.role || "free";
    
    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(403, "Access denied. Premium subscription required.");
    }

    next();
  };
};

export const requirePremium = requireRole(["premium"]);