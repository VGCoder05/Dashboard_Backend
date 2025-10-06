import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { requirePremium } from '../middleware/roleAuth.js';

const router = express.Router();

// Check if user has premium access
router.get('/check-access', auth, (req, res) => {
  res.json({
    hasPremiumAccess: req.user.role === 'premium',
    role: req.user.role,
    subscription: req.user.subscription,
  });
});

// Premium-only content
router.get('/content', auth, requirePremium, (req, res) => {
  res.json({
    message: "Premium content",
    data: {
      // Your premium content here
      features: ["Advanced Analytics", "Priority Support", "Custom Reports"],
    },
  });
});

export default router;