import mongoose from "mongoose";

import Prescription from "../models/Prescription.js";
import User from "../models/User.js";

// ========================================
// CREATE PRESCRIPTION - DOCTOR
// ========================================

const createPrescription = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      diagnosis,
      medicines,
      generalInstructions,
    } = req.body;

    if (!patientId || !diagnosis || !medicines) {
      return res.status(400).json({
        success: false,
        message:
          "Patient, diagnosis and medicines are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
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

    if (
      !Array.isArray(medicines) ||
      medicines.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one medicine is required",
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

    const prescription = await Prescription.create({
      patient: patientId,
      doctor: req.user.userId,
      appointment: appointmentId || null,
      diagnosis: diagnosis.trim(),
      medicines,
      generalInstructions:
        generalInstructions?.trim() || "",
    });

    const populatedPrescription =
      await Prescription.findById(prescription._id)
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
        );

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription: populatedPrescription,
    });
  } catch (error) {
    console.error(
      "Create prescription error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create prescription",
    });
  }
};

// ========================================
// GET PATIENT PRESCRIPTIONS
// ========================================

const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions =
      await Prescription.find({
        patient: req.user.userId,
      })
        .populate(
          "doctor",
          "firstName lastName email phone"
        )
        .populate(
          "appointment",
          "appointmentDate appointmentTime consultationType status"
        )
        .sort({ prescribedAt: -1 });

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    console.error(
      "Get patient prescriptions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load prescriptions",
    });
  }
};

// ========================================
// EXPORTS
// ========================================

export {
  createPrescription,
  getPatientPrescriptions,
};