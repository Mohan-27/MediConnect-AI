import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pill,
  CalendarDays,
  User,
  X,
} from "lucide-react";

import api from "../../../services/api";

const Prescriptions = () => {
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    generalInstructions: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================================
  // Fetch doctor's patients
  // ================================
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/appointments/doctor/patients"
      );

      console.log(
        "Doctor patients API response:",
        response.data
      );

      setPatients(response.data.patients || []);
    } catch (err) {
      console.error(
        "Fetch patients error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load patients"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Form input handler
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================================
  // Open prescription form
  // ================================
  const openPrescriptionForm = (patientId = "") => {
    setFormData((previous) => ({
      ...previous,
      patientId,
    }));

    setMessage("");
    setError("");
    setShowForm(true);
  };

  // ================================
  // Close prescription form
  // ================================
  const closePrescriptionForm = () => {
    setShowForm(false);

    setFormData({
      patientId: "",
      diagnosis: "",
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      generalInstructions: "",
    });

    setMessage("");
    setError("");
  };

  // ================================
  // Create prescription
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Basic validation
    if (
      !formData.patientId ||
      !formData.diagnosis.trim() ||
      !formData.medicineName.trim() ||
      !formData.dosage.trim() ||
      !formData.frequency.trim() ||
      !formData.duration.trim()
    ) {
      setError(
        "Please fill all required fields."
      );

      return;
    }

    try {
      const response = await api.post(
        "/prescriptions",
        {
          patientId: formData.patientId,

          diagnosis: formData.diagnosis.trim(),

          medicines: [
            {
              name: formData.medicineName.trim(),
              dosage: formData.dosage.trim(),
              frequency: formData.frequency.trim(),
              duration: formData.duration.trim(),
              instructions:
                formData.instructions.trim(),
            },
          ],

          generalInstructions:
            formData.generalInstructions.trim(),
        }
      );

      console.log(
        "Create prescription response:",
        response.data
      );

      setMessage(
        response.data.message ||
          "Prescription created successfully"
      );

      setFormData({
        patientId: "",
        diagnosis: "",
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        generalInstructions: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error(
        "Create prescription error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to create prescription"
      );
    }
  };

  // ================================
  // Search patients
  // ================================
  const filteredPatients = patients.filter(
    (patient) => {
      const fullName =
        `${patient.firstName || ""} ${
          patient.lastName || ""
        }`.toLowerCase();

      const email =
        patient.email?.toLowerCase() || "";

      const searchValue =
        search.toLowerCase();

      return (
        fullName.includes(searchValue) ||
        email.includes(searchValue)
      );
    }
  );

  return (
    <div className="space-y-6">
      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Prescriptions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage prescriptions for
            your patients.
          </p>
        </div>

        <button
          onClick={() =>
            openPrescriptionForm()
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700"
        >
          <Plus size={18} />

          Create Prescription
        </button>
      </div>

      {/* =====================================
          SUCCESS MESSAGE
      ====================================== */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* =====================================
          ERROR MESSAGE
      ====================================== */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          SEARCH
      ====================================== */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {/* =====================================
          PATIENT LIST
      ====================================== */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading patients...
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <User
            size={40}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-3 font-semibold text-slate-700">
            No patients found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Patients with appointments will
            appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map(
            (patient) => (
              <div
                key={patient._id}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                {/* Patient header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                      <User size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {patient.firstName}{" "}
                        {patient.lastName}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {patient.email}
                      </p>
                    </div>
                  </div>

                  <Pill
                    size={19}
                    className="text-cyan-600"
                  />
                </div>

                {/* Patient information */}
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />

                    <span>
                      Appointments:{" "}
                      {patient.totalAppointments ||
                        0}
                    </span>
                  </div>

                  {patient.phone && (
                    <div className="text-xs text-slate-500">
                      Phone: {patient.phone}
                    </div>
                  )}

                  {patient.lastAppointment && (
                    <div className="text-xs text-slate-500">
                      Last appointment:{" "}
                      {new Date(
                        patient.lastAppointment
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Prescription button */}
                <button
                  onClick={() =>
                    openPrescriptionForm(
                      patient._id
                    )
                  }
                  className="mt-5 w-full rounded-lg border border-cyan-200 px-4 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-50"
                >
                  Write Prescription
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* =====================================
          CREATE PRESCRIPTION MODAL
      ====================================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Create Prescription
                </h2>

                <p className="text-sm text-slate-500">
                  Add diagnosis and medicine
                  details.
                </p>
              </div>

              <button
                onClick={
                  closePrescriptionForm
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* =================================
                FORM
            ================================== */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* Patient */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Patient *
                </label>

                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">
                    Select patient
                  </option>

                  {patients.map(
                    (patient) => (
                      <option
                        key={patient._id}
                        value={patient._id}
                      >
                        {patient.firstName}{" "}
                        {patient.lastName}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Diagnosis *
                </label>

                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter diagnosis..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* Medicine */}
              <div>
                <h3 className="mb-3 font-semibold text-slate-800">
                  Medicine
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Medicine name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Medicine Name *
                    </label>

                    <input
                      name="medicineName"
                      value={
                        formData.medicineName
                      }
                      onChange={handleChange}
                      placeholder="e.g. Paracetamol"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>

                  {/* Dosage */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Dosage *
                    </label>

                    <input
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleChange}
                      placeholder="e.g. 500 mg"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Frequency *
                    </label>

                    <input
                      name="frequency"
                      value={
                        formData.frequency
                      }
                      onChange={handleChange}
                      placeholder="e.g. Twice daily"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Duration *
                    </label>

                    <input
                      name="duration"
                      value={
                        formData.duration
                      }
                      onChange={handleChange}
                      placeholder="e.g. 3 days"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                </div>
              </div>

              {/* Medicine instructions */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Medicine Instructions
                </label>

                <textarea
                  name="instructions"
                  value={
                    formData.instructions
                  }
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g. Take after food"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* General instructions */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  General Instructions
                </label>

                <textarea
                  name="generalInstructions"
                  value={
                    formData.generalInstructions
                  }
                  onChange={handleChange}
                  rows="3"
                  placeholder="Additional instructions for the patient..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* Form actions */}
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={
                    closePrescriptionForm
                  }
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700"
                >
                  Create Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;