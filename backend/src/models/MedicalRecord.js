import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    recordType: {
      type: String,
      enum: [
        "consultation",
        "diagnosis",
        "lab-report",
        "follow-up",
        "other",
      ],
      default: "consultation",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MedicalRecord = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);

export default MedicalRecord;