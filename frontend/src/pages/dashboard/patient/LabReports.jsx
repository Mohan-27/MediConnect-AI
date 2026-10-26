import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  CalendarDays,
  FlaskConical,
  UserRound,
  X,
  CheckCircle2,
} from "lucide-react";

import api from "../../../services/api";

function LabReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/lab-reports/patient");

      setReports(response.data.reports || []);
    } catch (err) {
      console.error("Fetch lab reports error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load lab reports"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const doctorName = report.doctor
      ? `${report.doctor.firstName} ${report.doctor.lastName}`
      : "";

    const laboratoryName = report.laboratory
      ? `${report.laboratory.firstName} ${report.laboratory.lastName}`
      : "";

    const searchText = `
      ${report.testName || ""}
      ${report.testType || ""}
      ${report.result || ""}
      ${doctorName}
      ${laboratoryName}
      ${report.status || ""}
    `.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";

      case "reviewed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Lab Reports
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your laboratory test results and reports.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search by test, type, doctor or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Loading lab reports...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredReports.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <FlaskConical
              size={42}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-800">
              No lab reports found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your laboratory reports will appear here when
              they are available.
            </p>
          </div>
        )}

      {/* Reports */}
      {!loading &&
        !error &&
        filteredReports.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredReports.map((report) => {
              const doctorName = report.doctor
                ? `Dr. ${report.doctor.firstName} ${report.doctor.lastName}`
                : "Not specified";

              return (
                <div
                  key={report._id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                        <FlaskConical size={21} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {report.testName}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {report.testType || "Laboratory Test"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays size={16} />

                    <span>
                      {formatDate(report.reportDate)}
                    </span>
                  </div>

                  {/* Result */}
                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Result
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {report.result || "Result not specified"}
                    </p>
                  </div>

                  {/* Normal Range */}
                  {report.normalRange && (
                    <div className="mt-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Normal Range
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {report.normalRange}
                      </p>
                    </div>
                  )}

                  {/* Doctor */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <UserRound size={16} />

                    <span>
                      {doctorName}
                    </span>
                  </div>

                  {/* Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedReport(report)
                    }
                    className="mt-5 w-full rounded-lg border border-cyan-600 px-4 py-2.5 text-sm font-medium text-cyan-700 transition hover:bg-cyan-50"
                  >
                    View Full Report
                  </button>
                </div>
              );
            })}
          </div>
        )}

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Lab Report
                </h2>

                <p className="text-sm text-slate-500">
                  {formatDate(selectedReport.reportDate)}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedReport(null)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">

              {/* Test Information */}
              <div className="rounded-xl bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <FlaskConical size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Test
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {selectedReport.testName}
                    </h3>

                    {selectedReport.testType && (
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedReport.testType}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Result */}
              <div>
                <h3 className="font-semibold text-slate-900">
                  Result
                </h3>

                <div className="mt-3 rounded-xl border border-slate-200 p-5">
                  <p className="text-sm leading-6 text-slate-700">
                    {selectedReport.result ||
                      "No result provided."}
                  </p>
                </div>
              </div>

              {/* Normal Range */}
              {selectedReport.normalRange && (
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Normal Range
                  </h3>

                  <div className="mt-3 rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-700">
                      {selectedReport.normalRange}
                    </p>
                  </div>
                </div>
              )}

              {/* Remarks */}
              {selectedReport.remarks && (
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Remarks
                  </h3>

                  <div className="mt-3 rounded-lg bg-cyan-50 p-4">
                    <p className="text-sm leading-6 text-slate-700">
                      {selectedReport.remarks}
                    </p>
                  </div>
                </div>
              )}

              {/* Doctor */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <UserRound
                    size={20}
                    className="text-cyan-600"
                  />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Referring Doctor
                    </p>

                    <p className="font-semibold text-slate-900">
                      {selectedReport.doctor
                        ? `Dr. ${selectedReport.doctor.firstName} ${selectedReport.doctor.lastName}`
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={18}
                    className="text-green-600"
                  />

                  <span className="text-sm text-slate-600">
                    Report Status
                  </span>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                    selectedReport.status
                  )}`}
                >
                  {selectedReport.status}
                </span>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabReports;