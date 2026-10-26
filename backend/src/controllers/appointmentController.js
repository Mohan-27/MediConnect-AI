import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      consultationType,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    if (
      !doctorId ||
      !consultationType ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor, consultation type, date and time are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    if (!["online", "in-person"].includes(consultationType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation type",
      });
    }

    const doctor = await User.findOne({
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

    const selectedDate = new Date(appointmentDate);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date",
      });
    }

    if (selectedDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment date cannot be in the past",
      });
    }

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: selectedDate,
      appointmentTime,
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: "This appointment slot is already booked",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.userId,
      doctor: doctorId,
      consultationType,
      appointmentDate: selectedDate,
      appointmentTime,
      reason: reason || "",
    });

    const populatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate(
        "patient",
        "firstName lastName email phone role"
      )
      .populate(
        "doctor",
        "firstName lastName email phone role"
      );

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
    });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.userId,
    })
      .populate(
        "doctor",
        "firstName lastName email phone role"
      )
      .sort({
        appointmentDate: 1,
        appointmentTime: 1,
      });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get patient appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patient: req.user.userId,
    })
      .populate(
        "doctor",
        "firstName lastName email phone role"
      )
      .populate(
        "patient",
        "firstName lastName email phone role"
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patient: req.user.userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: `Appointment is already ${appointment.status}`,
      });
    }

    appointment.status = "cancelled";

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
    });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.userId,
    })
      .populate(
        "patient",
        "firstName lastName email phone role"
      )
      .sort({
        appointmentDate: 1,
        appointmentTime: 1,
      });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get doctor appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor appointments",
    });
  }
};

const updateDoctorAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const allowedStatuses = [
      "confirmed",
      "completed",
      "rejected",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      doctor: req.user.userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = status;

    await appointment.save();

    const updatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate(
        "patient",
        "firstName lastName email phone role"
      )
      .populate(
        "doctor",
        "firstName lastName email phone role"
      );

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error(
      "Update doctor appointment status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
    });
  }
};

const getDoctorPatients = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.userId,
    })
      .populate(
        "patient",
        "firstName lastName email phone preferredLanguage"
      )
      .sort({
        appointmentDate: -1,
      });

    const patientMap = new Map();

    appointments.forEach((appointment) => {
      if (!appointment.patient) {
        return;
      }

      const patient = appointment.patient;
      const patientId = patient._id.toString();

      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          _id: patient._id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          phone: patient.phone,
          preferredLanguage: patient.preferredLanguage,
          totalAppointments: 0,
          lastAppointment: appointment.appointmentDate,
        });
      }

      const patientData = patientMap.get(patientId);

      patientData.totalAppointments += 1;

      if (
        new Date(appointment.appointmentDate) >
        new Date(patientData.lastAppointment)
      ) {
        patientData.lastAppointment =
          appointment.appointmentDate;
      }
    });

    const patients = Array.from(patientMap.values());

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Get doctor patients error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor patients",
    });
  }
};


export {
  createAppointment,
  getPatientAppointments,
  getAppointmentById,
  cancelAppointment,
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
  getDoctorPatients,
};