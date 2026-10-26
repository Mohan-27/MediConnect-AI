import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Users,
  X,
  Loader2,
} from "lucide-react";

import api from "../../../services/api";

const initialForm = {
  patientId: "",
  testName: "",
  testType: "",
  result: "",
  normalRange: "",
  remarks: "",
};

export default function LabReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/lab-reports/laboratory");

      setReports(response.data.reports || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load laboratory reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return reports;
    }

    return reports.filter((report) => {
      const patientName = report.patient
        ? `${report.patient.firstName || ""} ${
            report.patient.lastName || ""
          }`
        : "";

      return (
        patientName.toLowerCase().includes(value) ||
        report.testName?.toLowerCase().includes(value) ||
        report.testType?.toLowerCase().includes(value) ||
        report.status?.toLowerCase().includes(value)
      );
    });
  }, [reports, search]);

  const uniquePatients = useMemo(() => {
    const ids = reports
      .map((report) => report.patient?._id)
      .filter(Boolean);

    return new Set(ids).size;
  }, [reports]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateReport = async (event) => {
    event.preventDefault();

    setFormError("");
    setSuccess("");

    if (!form.patientId.trim()) {
      setFormError("Patient ID is required.");
      return;
    }

    if (!form.testName.trim()) {
      setFormError("Test name is required.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/lab-reports", {
        patientId: form.patientId.trim(),
        testName: form.testName.trim(),
        testType: form.testType.trim(),
        result: form.result.trim(),
        normalRange: form.normalRange.trim(),
        remarks: form.remarks.trim(),
      });

      setForm(initialForm);
      setShowForm(false);
      setSuccess("Laboratory report created successfully.");

      await fetchReports();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Failed to create laboratory report."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getPatientName = (patient) => {
    if (!patient) {
      return "Unknown Patient";
    }

    return `${patient.firstName || ""} ${
      patient.lastName || ""
    }`.trim() || "Unknown Patient";
  };

  const getStatusClasses = (status) => {
    if (status === "reviewed") {
      return "bg-green-100 text-green-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Laboratory Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage laboratory test reports and patient results.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setFormError("");
            setSuccess("");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Plus size={18} />
          Create Report
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-50 p-3">
              <FileText className="text-teal-600" size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Reports
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {reports.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-3">
              <Users className="text-blue-600" size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Patients
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {uniquePatients}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by patient, test name, test type or status..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="animate-spin" size={20} />
            Loading reports...
          </div>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
          <FileText
            size={40}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            No laboratory reports found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Create a report or change your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              {/* Report header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {report.testName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {report.testType || "Laboratory Test"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                    report.status
                  )}`}
                >
                  {report.status || "available"}
                </span>
              </div>

              {/* Patient */}
              <div className="mt-5 rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Patient
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {getPatientName(report.patient)}
                </p>

                {report.patient?.email && (
                  <p className="mt-1 text-sm text-slate-500">
                    {report.patient.email}
                  </p>
                )}
              </div>

              {/* Result */}
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Result
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                    {report.result || "No result entered"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Normal Range
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {report.normalRange || "Not specified"}
                  </p>
                </div>

                {report.remarks && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Remarks
                    </p>

                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                      {report.remarks}
                    </p>
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400">
                  Report Date
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {report.reportDate
                    ? new Date(
                        report.reportDate
                      ).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Report Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Create Laboratory Report
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the patient's laboratory test details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateReport}
              className="space-y-5 p-6"
            >
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Patient ID *
                </label>

                <input
                  type="text"
                  name="patientId"
                  value={form.patientId}
                  onChange={handleChange}
                  placeholder="Enter patient MongoDB ID"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Use the patient's User ID from your system.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Test Name *
                  </label>

                  <input
                    type="text"
                    name="testName"
                    value={form.testName}
                    onChange={handleChange}
                    placeholder="e.g. Complete Blood Count"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Test Type
                  </label>

                  <input
                    type="text"
                    name="testType"
                    value={form.testType}
                    onChange={handleChange}
                    placeholder="e.g. Blood Test"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Result
                </label>

                <textarea
                  name="result"
                  value={form.result}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter test result..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Normal Range
                </label>

                <input
                  type="text"
                  name="normalRange"
                  value={form.normalRange}
                  onChange={handleChange}
                  placeholder="e.g. 12.0 - 16.0 g/dL"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Additional remarks..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {submitting
                    ? "Creating..."
                    : "Create Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}