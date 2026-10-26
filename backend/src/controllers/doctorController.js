import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      isActive: true,
    })
      .select(
        "firstName lastName email phone preferredLanguage createdAt"
      )
      .sort({
        firstName: 1,
        lastName: 1,
      });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const doctor = await User.findOne({
      _id: id,
      role: "doctor",
      isActive: true,
    }).select(
      "firstName lastName email phone preferredLanguage createdAt"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("Get doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Logged-in Doctor Profile
|--------------------------------------------------------------------------
*/

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.user.userId,
      role: "doctor",
    }).select(
      "firstName lastName email phone preferredLanguage role isActive createdAt updatedAt"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("Get doctor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor profile",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Logged-in Doctor Profile
|--------------------------------------------------------------------------
*/

const updateDoctorProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      preferredLanguage,
    } = req.body;

    if (!firstName?.trim() || !lastName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required",
      });
    }

    const allowedLanguages = [
      "english",
      "telugu",
      "hindi",
    ];

    if (
      preferredLanguage &&
      !allowedLanguages.includes(preferredLanguage)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid preferred language",
      });
    }

    const doctor = await User.findOne({
      _id: req.user.userId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    doctor.firstName = firstName.trim();
    doctor.lastName = lastName.trim();

    if (phone !== undefined) {
      doctor.phone = phone.trim();
    }

    if (preferredLanguage) {
      doctor.preferredLanguage = preferredLanguage;
    }

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        phone: doctor.phone,
        preferredLanguage: doctor.preferredLanguage,
        role: doctor.role,
        isActive: doctor.isActive,
      },
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update doctor profile",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Change Doctor Password
|--------------------------------------------------------------------------
*/

const changeDoctorPassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters long",
      });
    }

    const doctor = await User.findOne({
      _id: req.user.userId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor account not found",
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      doctor.password
    );

    if (!passwordMatches) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      doctor.password
    );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from the current password",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    doctor.password = hashedPassword;

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change doctor password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

export {
  getDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  changeDoctorPassword,
};