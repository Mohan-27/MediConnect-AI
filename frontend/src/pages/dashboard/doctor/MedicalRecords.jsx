import { useEffect, useState } from "react";
import {
  Search,
  FileText,
  User,
  CalendarDays,
  Plus,
  X,
} from "lucide-react";

import api from "../../../services/api";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [patientsLoading, setPatientsLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    patientId: "",
    recordType: "consultation",
    title: "",
    description: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ---------------------------------------
  // Fetch doctor's medical records
  // ---------------------------------------
  useEffect(() => {
    fetchRecords();
    fetchPatients();
  }, []);

  // ---------------------------------------
  // Fetch medical records
  // ---------------------------------------
  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/medical-records/doctor");

      setRecords(response.data.records || []);
    } catch (err) {
      console.error("Fetch medical records error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load medical records"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // Fetch doctor's patients
  // ---------------------------------------
  const fetchPatients = async () => {
    try {
      setPatientsLoading(true);

      const response = await api.get(
        "/appointments/doctor/patients"
      );

      setPatients(response.data.patients || []);
    } catch (err) {
      console.error("Fetch patients error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load patients"
      );
    } finally {
      setPatientsLoading(false);
    }
  };

  // ---------------------------------------
  // Handle form changes
  // ---------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ---------------------------------------
  // Open create form
  // ---------------------------------------
  const openCreateForm = () => {
    setFormData({
      patientId: "",
      recordType: "consultation",
      title: "",
      description: "",
      notes: "",
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  // ---------------------------------------
  // Close create form
  // ---------------------------------------
  const closeCreateForm = () => {
    setShowForm(false);

    setFormData({
      patientId: "",
      recordType: "consultation",
      title: "",
      description: "",
      notes: "",
    });
  };

  // ---------------------------------------
  // Create medical record
  // ---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.patientId ||
      !formData.title.trim()
    ) {
      setError(
        "Patient and record title are required."
      );

      return;
    }

    try {
      const response = await api.post(
        "/medical-records",
        {
          patientId: formData.patientId,
          recordType: formData.recordType,
          title: formData.title.trim(),
          description: formData.description.trim(),
          notes: formData.notes.trim(),
        }
      );

      setMessage(
        response.data.message ||
          "Medical record created successfully"
      );

      closeCreateForm();

      await fetchRecords();
    } catch (err) {
      console.error(
        "Create medical record error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to create medical record"
      );
    }
  };

  // ---------------------------------------
  // Filter records
  // ---------------------------------------
  const filteredRecords = records.filter(
    (record) => {
      const patientName =
        `${record.patient?.firstName || ""} ${
          record.patient?.lastName || ""
        }`.toLowerCase();

      const title =
        record.title?.toLowerCase() || "";

      const searchValue =
        search.toLowerCase();

      return (
        patientName.includes(searchValue) ||
        title.includes(searchValue)
      );
    }
  );

  return (
    <div className="space-y-6">
      {/* ---------------------------------- */}
      {/* Header */}
      {/* ---------------------------------- */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Medical Records
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and review medical records for
            your patients.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700"
        >
          <Plus size={18} />

          New Medical Record
        </button>
      </div>

      {/* ---------------------------------- */}
      {/* Success message */}
      {/* ---------------------------------- */}

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* ---------------------------------- */}
      {/* Error message */}
      {/* ---------------------------------- */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ---------------------------------- */}
      {/* Search */}
      {/* ---------------------------------- */}

      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search patient or record..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {/* ---------------------------------- */}
      {/* Records */}
      {/* ---------------------------------- */}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading medical records...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <FileText
            size={42}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-3 font-semibold text-slate-700">
            No medical records found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Create a medical record for a patient
            to see it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRecords.map((record) => (
            <div
              key={record._id}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              {/* Record header */}

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                  <FileText size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800">
                    {record.title}
                  </h3>

                  <p className="mt-1 text-xs capitalize text-slate-500">
                    {record.recordType}
                  </p>
                </div>
              </div>

              {/* Patient */}

              <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
                <User size={16} />

                <span>
                  {record.patient?.firstName}{" "}
                  {record.patient?.lastName}
                </span>
              </div>

              {/* Date */}

              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays size={15} />

                <span>
                  {record.recordedAt
                    ? new Date(
                        record.recordedAt
                      ).toLocaleDateString()
                    : "—"}
                </span>
              </div>

              {/* Description */}

              {record.description && (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {record.description}
                </p>
              )}

              {/* Notes */}

              {record.notes && (
                <div className="mt-4 rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Notes
                  </p>

                  <p className="mt-1 line-clamp-3 text-sm text-slate-600">
                    {record.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ---------------------------------- */}
      {/* Create Medical Record Modal */}
      {/* ---------------------------------- */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Modal header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  New Medical Record
                </h2>

                <p className="text-sm text-slate-500">
                  Add clinical information for a
                  patient.
                </p>
              </div>

              <button
                onClick={closeCreateForm}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}

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
                  disabled={patientsLoading}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-50"
                >
                  <option value="">
                    {patientsLoading
                      ? "Loading patients..."
                      : patients.length === 0
                      ? "No patients found"
                      : "Select a patient"}
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient._id}
                      value={patient._id}
                    >
                      {patient.firstName}{" "}
                      {patient.lastName}
                      {patient.email
                        ? ` — ${patient.email}`
                        : ""}
                    </option>
                  ))}
                </select>

                {patients.length === 0 &&
                  !patientsLoading && (
                    <p className="mt-1 text-xs text-red-500">
                      No patients are available for
                      your account.
                    </p>
                  )}
              </div>

              {/* Record Type */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Record Type
                </label>

                <select
                  name="recordType"
                  value={formData.recordType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="consultation">
                    Consultation
                  </option>

                  <option value="diagnosis">
                    Diagnosis
                  </option>

                  <option value="lab-report">
                    Lab Report
                  </option>

                  <option value="follow-up">
                    Follow-up
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              {/* Title */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Initial Consultation"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the patient's condition or consultation..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* Clinical Notes */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Clinical Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Add clinical notes, recommendations, or follow-up instructions..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={closeCreateForm}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    patientsLoading ||
                    patients.length === 0
                  }
                  className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;