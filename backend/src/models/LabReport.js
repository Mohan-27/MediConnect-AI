import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    laboratory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    testName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    testType: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    result: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    normalRange: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    reportDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["available", "reviewed"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const LabReport = mongoose.model(
  "LabReport",
  labReportSchema
);

export default LabReport;