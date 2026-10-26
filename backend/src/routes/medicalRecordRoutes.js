import express from "express";

import {
  createMedicalRecord,
  getDoctorMedicalRecords,
  getPatientMedicalRecords,
  getMedicalRecordById,
} from "../controllers/medicalRecordController.js";

import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();


// All medical record routes require authentication
router.use(protect);


// =====================================================
// DOCTOR ROUTES
// =====================================================

// Create a medical record
router.post(
  "/",
  allowRoles("doctor"),
  createMedicalRecord
);

// Get records created by the logged-in doctor
router.get(
  "/doctor",
  allowRoles("doctor"),
  getDoctorMedicalRecords
);


// =====================================================
// PATIENT ROUTES
// =====================================================

// Get records belonging to logged-in patient
router.get(
  "/patient",
  allowRoles("patient"),
  getPatientMedicalRecords
);


// =====================================================
// COMMON ROUTE
// =====================================================

// Get one medical record
router.get(
  "/:id",
  allowRoles("doctor", "patient"),
  getMedicalRecordById
);


export default router;