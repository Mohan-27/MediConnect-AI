import mongoose from "mongoose";

import MedicalRecord from "../models/MedicalRecord.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";


// =====================================================
// CREATE MEDICAL RECORD
// Doctor only
// =====================================================

const createMedicalRecord = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      recordType,
      title,
      description,
      notes,
    } = req.body;

    // Basic validation
    if (!patientId || !title) {
      return res.status(400).json({
        success: false,
        message: "Patient and title are required",
      });
    }

    // Validate patient ID
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    // Validate appointment ID if provided
    if (
      appointmentId &&
      !mongoose.Types.ObjectId.isValid(appointmentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    // Check patient
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

    // Check appointment if provided
    if (appointmentId) {
      const appointment = await Appointment.findOne({
        _id: appointmentId,
        patient: patientId,
        doctor: req.user.userId,
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message:
            "Appointment not found for this patient and doctor",
        });
      }
    }

    // Create record
    const medicalRecord = await MedicalRecord.create({
      patient: patientId,
      doctor: req.user.userId,
      appointment: appointmentId || null,
      recordType: recordType || "consultation",
      title: title.trim(),
      description: description?.trim() || "",
      notes: notes?.trim() || "",
    });

    // Return populated record
    const populatedRecord =
      await MedicalRecord.findById(
        medicalRecord._id
      )
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
      message: "Medical record created successfully",
      record: populatedRecord,
    });
  } catch (error) {
    console.error(
      "Create medical record error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create medical record",
    });
  }
};


// =====================================================
// GET DOCTOR'S MEDICAL RECORDS
// =====================================================

const getDoctorMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      doctor: req.user.userId,
    })
      .populate(
        "patient",
        "firstName lastName email phone"
      )
      .populate(
        "appointment",
        "appointmentDate appointmentTime consultationType status"
      )
      .sort({
        recordedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    console.error(
      "Get doctor medical records error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch medical records",
    });
  }
};


// =====================================================
// GET PATIENT MEDICAL RECORDS
// Patient only
// =====================================================

const getPatientMedicalRecords = async (
  req,
  res
) => {
  try {
    const records = await MedicalRecord.find({
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
      .sort({
        recordedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    console.error(
      "Get patient medical records error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch medical records",
    });
  }
};


// =====================================================
// GET SINGLE MEDICAL RECORD
// =====================================================

const getMedicalRecordById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medical record ID",
      });
    }

    const record =
      await MedicalRecord.findById(id)
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

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    // Security check:
    // Only the doctor who created it OR
    // the patient who owns it can access it.

    const userId = req.user.userId;

    const isDoctor =
      record.doctor?._id?.toString() === userId;

    const isPatient =
      record.patient?._id?.toString() === userId;

    if (!isDoctor && !isPatient) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this medical record",
      });
    }

    return res.status(200).json({
      success: true,
      record,
    });
  } catch (error) {
    console.error(
      "Get medical record error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch medical record",
    });
  }
};


export {
  createMedicalRecord,
  getDoctorMedicalRecords,
  getPatientMedicalRecords,
  getMedicalRecordById,
};