import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  CalendarDays,
  UserRound,
  Pill,
  X,
  Clock,
} from "lucide-react";

import api from "../../../services/api";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/prescriptions/patient");

      setPrescriptions(response.data.prescriptions || []);
    } catch (err) {
      console.error("Fetch prescriptions error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load prescriptions"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const doctorName = prescription.doctor
      ? `${prescription.doctor.firstName} ${prescription.doctor.lastName}`
      : "";

    const searchText = `
      ${prescription.diagnosis || ""}
      ${doctorName}
      ${prescription.status || ""}
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
      case "active":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Prescriptions
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and manage prescriptions issued by your doctors.
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
          placeholder="Search by diagnosis, doctor or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Loading prescriptions...
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
        filteredPrescriptions.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <FileText
              size={42}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-800">
              No prescriptions found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your prescriptions will appear here when a doctor
              issues one.
            </p>
          </div>
        )}

      {/* Prescription Cards */}
      {!loading &&
        !error &&
        filteredPrescriptions.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredPrescriptions.map((prescription) => {
              const doctorName = prescription.doctor
                ? `Dr. ${prescription.doctor.firstName} ${prescription.doctor.lastName}`
                : "Doctor";

              return (
                <div
                  key={prescription._id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                        <FileText size={21} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {prescription.diagnosis}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {doctorName}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                        prescription.status
                      )}`}
                    >
                      {prescription.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <CalendarDays size={16} />

                      <span>
                        {formatDate(
                          prescription.prescribedAt
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <Pill size={16} />

                      <span>
                        {prescription.medicines?.length || 0}{" "}
                        medicine
                        {prescription.medicines?.length !== 1
                          ? "s"
                          : ""}
                      </span>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="mt-4 rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Diagnosis
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {prescription.diagnosis}
                    </p>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() =>
                      setSelectedPrescription(prescription)
                    }
                    className="mt-4 w-full rounded-lg border border-cyan-600 px-4 py-2.5 text-sm font-medium text-cyan-700 transition hover:bg-cyan-50"
                  >
                    View Prescription
                  </button>
                </div>
              );
            })}
          </div>
        )}

      {/* Prescription Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Prescription Details
                </h2>

                <p className="text-sm text-slate-500">
                  {formatDate(
                    selectedPrescription.prescribedAt
                  )}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedPrescription(null)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">

              {/* Doctor */}
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <UserRound
                    size={20}
                    className="text-cyan-600"
                  />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Prescribed By
                    </p>

                    <p className="font-semibold text-slate-900">
                      {selectedPrescription.doctor
                        ? `Dr. ${selectedPrescription.doctor.firstName} ${selectedPrescription.doctor.lastName}`
                        : "Doctor"}
                    </p>

                    {selectedPrescription.doctor?.email && (
                      <p className="text-sm text-slate-500">
                        {selectedPrescription.doctor.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h3 className="font-semibold text-slate-900">
                  Diagnosis
                </h3>

                <p className="mt-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  {selectedPrescription.diagnosis}
                </p>
              </div>

              {/* Medicines */}
              <div>
                <div className="flex items-center gap-2">
                  <Pill
                    size={20}
                    className="text-cyan-600"
                  />

                  <h3 className="font-semibold text-slate-900">
                    Medicines
                  </h3>
                </div>

                <div className="mt-3 space-y-3">
                  {selectedPrescription.medicines?.map(
                    (medicine, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {medicine.name}
                            </h4>

                            <p className="mt-1 text-sm text-slate-500">
                              {medicine.dosage}
                            </p>
                          </div>

                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock size={14} />
                            {medicine.frequency}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                          <p>
                            <span className="font-medium text-slate-600">
                              Duration:
                            </span>{" "}
                            {medicine.duration}
                          </p>

                          {medicine.instructions && (
                            <p>
                              <span className="font-medium text-slate-600">
                                Instructions:
                              </span>{" "}
                              {medicine.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* General Instructions */}
              {selectedPrescription.generalInstructions && (
                <div>
                  <h3 className="font-semibold text-slate-900">
                    General Instructions
                  </h3>

                  <p className="mt-2 rounded-lg bg-cyan-50 p-4 text-sm text-slate-700">
                    {selectedPrescription.generalInstructions}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-sm text-slate-500">
                  Status
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                    selectedPrescription.status
                  )}`}
                >
                  {selectedPrescription.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;