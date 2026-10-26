import express from "express";

import {
  createLabReport,
  getPatientLabReports,
  getLaboratoryReports,
  getLabReportById,
} from "../controllers/labReportController.js";

import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

/*
|--------------------------------------------------------------------------
| Create Lab Report
|--------------------------------------------------------------------------
| Only laboratory users can create reports.
*/
router.post(
  "/",
  allowRoles("laboratory"),
  createLabReport
);

/*
|--------------------------------------------------------------------------
| Patient Lab Reports
|--------------------------------------------------------------------------
*/
router.get(
  "/patient",
  allowRoles("patient"),
  getPatientLabReports
);

/*
|--------------------------------------------------------------------------
| Laboratory Reports
|--------------------------------------------------------------------------
*/
router.get(
  "/laboratory",
  allowRoles("laboratory"),
  getLaboratoryReports
);

/*
|--------------------------------------------------------------------------
| Single Lab Report
|--------------------------------------------------------------------------
| Patient, laboratory, doctor and global admin
| can access an authorized report.
*/
router.get(
  "/:id",
  allowRoles(
    "patient",
    "laboratory",
    "doctor",
    "globalAdmin"
  ),
  getLabReportById
);

export default router;