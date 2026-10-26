import mongoose from "mongoose";

import LabReport from "../models/LabReport.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

/*
|--------------------------------------------------------------------------
| Create Lab Report
|--------------------------------------------------------------------------
| Laboratory staff can create a report for a patient.
*/
const createLabReport = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentId,
      testName,
      testType,
      result,
      normalRange,
      remarks,
      reportDate,
    } = req.body;

    if (!patientId || !testName) {
      return res.status(400).json({
        success: false,
        message: "Patient and test name are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    if (
      doctorId &&
      !mongoose.Types.ObjectId.isValid(doctorId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    if (
      appointmentId &&
      !mongoose.Types.ObjectId.isValid(appointmentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const patient = await User.findOne({
      _id: patientId,
      role: "patient",
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    let doctor = null;

    if (doctorId) {
      doctor = await User.findOne({
        _id: doctorId,
        role: "doctor",
        isActive: true,
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }
    }

    let appointment = null;

    if (appointmentId) {
      appointment = await Appointment.findOne({
        _id: appointmentId,
        patient: patientId,
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message:
            "Appointment not found for this patient",
        });
      }
    }

    const labReport = await LabReport.create({
      patient: patientId,
      laboratory: req.user.userId,
      doctor: doctorId || null,
      appointment: appointmentId || null,
      testName: testName.trim(),
      testType: testType?.trim() || "",
      result: result?.trim() || "",
      normalRange: normalRange?.trim() || "",
      remarks: remarks?.trim() || "",
      reportDate: reportDate || new Date(),
    });

    const populatedReport = await LabReport.findById(
      labReport._id
    )
      .populate(
        "patient",
        "firstName lastName email phone"
      )
      .populate(
        "laboratory",
        "firstName lastName email phone"
      )
      .populate(
        "doctor",
        "firstName lastName email phone"
      )
      .populate(
        "appointment",
        "appointmentDate appointmentTime consultationType status"
      );

    return res.status(201).json({
      success: true,
      message: "Lab report created successfully",
      report: populatedReport,
    });
  } catch (error) {
    console.error(
      "Create lab report error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create lab report",
    });
  }
};


/*
|--------------------------------------------------------------------------
| Get Patient Lab Reports
|--------------------------------------------------------------------------
| Patient can view only their own reports.
*/
const getPatientLabReports = async (req, res) => {
  try {
    const reports = await LabReport.find({
      patient: req.user.userId,
    })
      .populate(
        "laboratory",
        "firstName lastName email phone"
      )
      .populate(
        "doctor",
        "firstName lastName email phone"
      )
      .populate(
        "appointment",
        "appointmentDate appointmentTime consultationType status"
      )
      .sort({
        reportDate: -1,
      });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error(
      "Get patient lab reports error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load lab reports",
    });
  }
};


/*
|--------------------------------------------------------------------------
| Get Lab Reports Created By Laboratory
|--------------------------------------------------------------------------
*/
const getLaboratoryReports = async (req, res) => {
  try {
    const reports = await LabReport.find({
      laboratory: req.user.userId,
    })
      .populate(
        "patient",
        "firstName lastName email phone"
      )
      .populate(
        "doctor",
        "firstName lastName email phone"
      )
      .populate(
        "appointment",
        "appointmentDate appointmentTime consultationType status"
      )
      .sort({
        reportDate: -1,
      });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error(
      "Get laboratory reports error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load laboratory reports",
    });
  }
};


/*
|--------------------------------------------------------------------------
| Get Single Lab Report
|--------------------------------------------------------------------------
*/
const getLabReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lab report ID",
      });
    }

    const report = await LabReport.findById(id)
      .populate(
        "patient",
        "firstName lastName email phone"
      )
      .populate(
        "laboratory",
        "firstName lastName email phone"
      )
      .populate(
        "doctor",
        "firstName lastName email phone"
      )
      .populate(
        "appointment",
        "appointmentDate appointmentTime consultationType status"
      );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Lab report not found",
      });
    }

    const isPatient =
      req.user.role === "patient" &&
      report.patient?._id?.toString() ===
        req.user.userId;

    const isLaboratory =
      req.user.role === "laboratory" &&
      report.laboratory?._id?.toString() ===
        req.user.userId;

    const isDoctor =
      req.user.role === "doctor" &&
      report.doctor?._id?.toString() ===
        req.user.userId;

    const isAdmin =
      req.user.role === "globalAdmin";

    if (
      !isPatient &&
      !isLaboratory &&
      !isDoctor &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this lab report",
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error(
      "Get lab report error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load lab report",
    });
  }
};


export {
  createLabReport,
  getPatientLabReports,
  getLaboratoryReports,
  getLabReportById,
};