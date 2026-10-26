import express from "express";

import {
  createPrescription,
  getPatientPrescriptions,
} from "../controllers/prescriptionController.js";

import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// All prescription routes require authentication
router.use(protect);

// ========================================
// DOCTOR
// Create prescription
// ========================================

router.post(
  "/",
  allowRoles("doctor"),
  createPrescription
);

// ========================================
// PATIENT
// Get logged-in patient's prescriptions
// ========================================

router.get(
  "/patient",
  allowRoles("patient"),
  getPatientPrescriptions
);

export default router;