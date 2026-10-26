import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import authRoutes from "./routes/authRoutes.js";

import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";


import prescriptionRoutes from "./routes/prescriptionRoutes.js";

import medicalRecordRoutes from "./routes/medicalRecordRoutes.js";

import labReportRoutes from "./routes/labReportRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// -------------------------
// Security Middleware
// -------------------------

app.use(helmet());

// -------------------------
// CORS
// -------------------------

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// -------------------------
// Request Parsing
// -------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medical-records",medicalRecordRoutes);
app.use("/api/lab-reports",labReportRoutes);

app.use(morgan("dev"));

// -------------------------
// Development Logging
// -------------------------

app.use(morgan("dev"));

// -------------------------
// Root Health Check
// -------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediConnect AI Backend is running",
    service: "Node.js + Express",
  });
});

// -------------------------
// API Health Check
// -------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// -------------------------
// 404 Handler
// -------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// -------------------------
// Global Error Handler
// -------------------------

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: "Internal server error",
  });
});

// -------------------------
// Start Server
// -------------------------

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `MediConnect AI Backend running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();