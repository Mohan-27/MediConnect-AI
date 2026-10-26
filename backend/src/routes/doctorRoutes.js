import express from "express";

import {
  getDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  changeDoctorPassword,
} from "../controllers/doctorController.js";

import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Doctor Routes
|--------------------------------------------------------------------------
*/

router.get("/", getDoctors);

/*
|--------------------------------------------------------------------------
| Protected Doctor Profile Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/profile",
  protect,
  allowRoles("doctor"),
  getDoctorProfile
);

router.patch(
  "/profile",
  protect,
  allowRoles("doctor"),
  updateDoctorProfile
);

/*
|--------------------------------------------------------------------------
| Protected Doctor Security Routes
|--------------------------------------------------------------------------
*/

router.patch(
  "/change-password",
  protect,
  allowRoles("doctor"),
  changeDoctorPassword
);

/*
|--------------------------------------------------------------------------
| Public Doctor By ID
|--------------------------------------------------------------------------
*/

router.get("/:id", getDoctorById);

export default router;