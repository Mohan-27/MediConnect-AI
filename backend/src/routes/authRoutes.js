import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected authentication test
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication verified successfully",
    user: req.user,
  });
});

// Patient-only test route
router.get(
  "/patient-test",
  protect,
  allowRoles("patient"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Patient authorization verified successfully",
      user: req.user,
    });
  }
);

export default router;