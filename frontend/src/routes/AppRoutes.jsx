import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import PatientLayout from "../layouts/PatientLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import LaboratoryLayout from "../layouts/LaboratoryLayout";

// Public Pages
import Home from "../pages/public/Home";
import Doctors from "../pages/public/Doctors";
import DoctorProfile from "../pages/public/DoctorProfile";
import BookAppointment from "../pages/public/BookAppointment";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Common Dashboard
import Dashboard from "../pages/dashboard/Dashboard";

// Patient Pages
import PatientDashboard from "../pages/dashboard/patient/PatientDashboard";
import Appointments from "../pages/dashboard/patient/Appointments";
import PatientMedicalRecords from "../pages/dashboard/patient/MedicalRecords";
import PatientPrescriptions from "../pages/dashboard/patient/Prescriptions";
import PatientLabReports from "../pages/dashboard/patient/LabReports";

import LaboratoryDashboard from "../pages/dashboard/laboratory/LaboratoryDashboard";
import LabReports from "../pages/dashboard/laboratory/LabReports";
import LaboratorySettings from "../pages/dashboard/laboratory/LaboratorySettings";


// Doctor Pages
import DoctorDashboard from "../pages/dashboard/doctor/DoctorDashboard";
import DoctorAppointments from "../pages/dashboard/doctor/Appointments";
import DoctorPatients from "../pages/dashboard/doctor/Patients";
import DoctorAccountProfile from "../pages/dashboard/doctor/Profile";
import DoctorSettings from "../pages/dashboard/doctor/Settings";
import DoctorPrescriptions from "../pages/dashboard/doctor/Prescriptions";
import DoctorMedicalRecords from "../pages/dashboard/doctor/MedicalRecords";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";


// Temporary placeholder component
function Placeholder({ title }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-5">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
          MediConnect AI
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-3 text-slate-500">
          This module will be implemented in a later phase.
        </p>
      </div>
    </div>
  );
}


function AppRoutes() {
  return (
    <Routes>

      {/* =========================================================
          PUBLIC ROUTES
      ========================================================= */}

      <Route element={<PublicLayout />}>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Doctors */}
        <Route
          path="/doctors"
          element={<Doctors />}
        />

        {/* Doctor Profile */}
        <Route
          path="/doctors/:doctorId"
          element={<DoctorProfile />}
        />

        {/* Book Appointment */}
        <Route
          path="/doctors/:doctorId/book"
          element={<BookAppointment />}
        />

        {/* Hospitals */}
        <Route
          path="/hospitals"
          element={<Placeholder title="Hospitals" />}
        />

        {/* Laboratories */}
        <Route
          path="/laboratories"
          element={<Placeholder title="Laboratories" />}
        />

        {/* Pharmacies */}
        <Route
          path="/pharmacies"
          element={<Placeholder title="Pharmacies" />}
        />

        {/* AI Assistant */}
        <Route
          path="/ai-assistant"
          element={<Placeholder title="AI Health Assistant" />}
        />

        {/* About */}
        <Route
          path="/about"
          element={<Placeholder title="About MediConnect AI" />}
        />

        {/* Contact */}
        <Route
          path="/contact"
          element={<Placeholder title="Contact" />}
        />

        {/* Privacy */}
        <Route
          path="/privacy"
          element={<Placeholder title="Privacy" />}
        />

        {/* Terms */}
        <Route
          path="/terms"
          element={<Placeholder title="Terms" />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Route>


      {/* =========================================================
          PROTECTED ROUTES
          User must be authenticated
      ========================================================= */}

      <Route element={<ProtectedRoute />}>

        {/* General authenticated dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* =======================================================
            PATIENT ROUTES
        ======================================================= */}

        <Route element={<RoleRoute allowedRoles={["patient"]} />}>

          <Route element={<PatientLayout />}>

            <Route
              path="/patient/dashboard"
              element={<PatientDashboard />}
            />

            <Route
              path="/patient/appointments"
              element={<Appointments />}
            />
            <Route
              path="/patient/medical-records"
              element={<PatientMedicalRecords />}
            />
            <Route
              path="/patient/prescriptions"
              element={<PatientPrescriptions />}
            />
            <Route
              path="/patient/lab-reports"
              element={<PatientLabReports />}
            />
          </Route>

        </Route>


        {/* =======================================================
            DOCTOR ROUTES
        ======================================================= */}

        <Route element={<RoleRoute allowedRoles={["doctor"]} />}>

          <Route element={<DoctorLayout />}>

            <Route
              path="/doctor/dashboard"
              element={<DoctorDashboard />}
            />

            <Route
              path="/doctor/appointments"
              element={<DoctorAppointments />}
            />

            <Route
              path="/doctor/patients"
              element={<DoctorPatients />}
            />

            <Route
              path="/doctor/profile"
              element={<DoctorAccountProfile />}
            />

            <Route
              path="/doctor/settings"
              element={<DoctorSettings />}
            />

            <Route
              path="/doctor/prescriptions"
              element={<DoctorPrescriptions />}
            />
            <Route
              path="/doctor/medical-records"
              element={<DoctorMedicalRecords />}
            />
          </Route>

        </Route>


        {/* =======================================================
            FUTURE ROLE ROUTES
        ======================================================= */}

        {/* Hospital Admin */}
        <Route element={<RoleRoute allowedRoles={["hospital"]} />}>
          <Route
            path="/hospital/dashboard"
            element={<Placeholder title="Hospital Dashboard" />}
          />
        </Route>


        {/* Laboratory Admin */}
        <Route element={<RoleRoute allowedRoles={["laboratory"]} />}>
          <Route element={<LaboratoryLayout />}>
            <Route
              path="/laboratory/dashboard"
              element={<LaboratoryDashboard />}
            />
            <Route
              path="/laboratory/reports"
              element={<LabReports />}
            />
            <Route
              path="/laboratory/settings"
              element={<LaboratorySettings />}
            />
          </Route>
        </Route>

        {/* Pharmacy Admin */}
        <Route element={<RoleRoute allowedRoles={["pharmacy"]} />}>
          <Route
            path="/pharmacy/dashboard"
            element={<Placeholder title="Pharmacy Dashboard" />}
          />
        </Route>


        {/* Global Admin */}
        <Route element={<RoleRoute allowedRoles={["globalAdmin"]} />}>
          <Route
            path="/admin/dashboard"
            element={<Placeholder title="Admin Dashboard" />}
          />
        </Route>

      </Route>

    </Routes>
  );
}

export default AppRoutes;