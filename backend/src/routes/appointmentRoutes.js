import express from "express";

import {
  createAppointment,
  getPatientAppointments,
  getAppointmentById,
  cancelAppointment,
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
  getDoctorPatients,
} from "../controllers/appointmentController.js";

import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

/*
|--------------------------------------------------------------------------
| Patient Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  allowRoles("patient"),
  createAppointment
);

router.get(
  "/patient",
  allowRoles("patient"),
  getPatientAppointments
);

/*
|--------------------------------------------------------------------------
| Doctor Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/doctor",
  allowRoles("doctor"),
  getDoctorAppointments
);

router.get(
  "/doctor/patients",
  allowRoles("doctor"),
  getDoctorPatients
);

router.patch(
  "/:id/status",
  allowRoles("doctor"),
  updateDoctorAppointmentStatus
);
/*
|--------------------------------------------------------------------------
| Patient Appointment By ID
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  allowRoles("patient"),
  getAppointmentById
);

router.patch(
  "/:id/cancel",
  allowRoles("patient"),
  cancelAppointment
);

export default router;