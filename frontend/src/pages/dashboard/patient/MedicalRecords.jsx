import { useEffect, useState } from "react";
import {
  Search,
  FileText,
  User,
  CalendarDays,
  X,
} from "lucide-react";

import api from "../../../services/api";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedRecord, setSelectedRecord] =
    useState(null);

  const [error, setError] = useState("");

  // ---------------------------------------
  // Fetch patient's medical records
  // ---------------------------------------

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/medical-records/patient"
      );

      setRecords(response.data.records || []);
    } catch (err) {
      console.error(
        "Fetch patient medical records error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load medical records"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // Filter records
  // ---------------------------------------

  const filteredRecords = records.filter(
    (record) => {
      const doctorName =
        `${record.doctor?.firstName || ""} ${
          record.doctor?.lastName || ""
        }`.toLowerCase();

      const title =
        record.title?.toLowerCase() || "";

      const type =
        record.recordType?.toLowerCase() || "";

      const searchValue =
        search.toLowerCase();

      return (
        doctorName.includes(searchValue) ||
        title.includes(searchValue) ||
        type.includes(searchValue)
      );
    }
  );

  // ---------------------------------------
  // Format record type
  // ---------------------------------------

  const formatRecordType = (type) => {
    if (!type) return "Record";

    return type
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  return (
    <div className="space-y-6">
      {/* ---------------------------------- */}
      {/* Header */}
      {/* ---------------------------------- */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Medical Records
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your medical records and clinical
          information.
        </p>
      </div>

      {/* ---------------------------------- */}
      {/* Error */}
      {/* ---------------------------------- */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}

          <button
            onClick={fetchRecords}
            className="ml-3 font-medium underline"
          >
            Retry
          </button>
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
          placeholder="Search records or doctor..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {/* ---------------------------------- */}
      {/* Loading */}
      {/* ---------------------------------- */}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            Loading medical records...
          </p>
        </div>
      ) : filteredRecords.length === 0 ? (
        /* -------------------------------- */
        /* Empty state */
        /* -------------------------------- */

        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <FileText
            size={48}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-4 font-semibold text-slate-700">
            No medical records found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Your medical records will appear here
            when they are created by your doctor.
          </p>
        </div>
      ) : (
        /* -------------------------------- */
        /* Records */
        /* -------------------------------- */

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRecords.map((record) => (
            <div
              key={record._id}
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-cyan-200 hover:shadow-sm"
            >
              {/* Record header */}

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                  <FileText size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-800">
                    {record.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatRecordType(
                      record.recordType
                    )}
                  </p>
                </div>
              </div>

              {/* Doctor */}

              <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
                <User size={16} />

                <span>
                  Dr.{" "}
                  {record.doctor?.firstName || ""}{" "}
                  {record.doctor?.lastName || ""}
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

              {/* Description preview */}

              {record.description && (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {record.description}
                </p>
              )}

              {/* View button */}

              <button
                onClick={() =>
                  setSelectedRecord(record)
                }
                className="mt-5 w-full rounded-lg border border-cyan-200 px-4 py-2.5 text-sm font-medium text-cyan-700 transition hover:bg-cyan-50"
              >
                View Full Record
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------------------------------- */}
      {/* Full Record Modal */}
      {/* ---------------------------------- */}

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Modal header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {selectedRecord.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {formatRecordType(
                    selectedRecord.recordType
                  )}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedRecord(null)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal content */}

            <div className="space-y-5 p-6">
              {/* Doctor */}

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Doctor
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  Dr.{" "}
                  {selectedRecord.doctor?.firstName ||
                    ""}{" "}
                  {selectedRecord.doctor?.lastName ||
                    ""}
                </p>
              </div>

              {/* Date */}

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Recorded Date
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {selectedRecord.recordedAt
                    ? new Date(
                        selectedRecord.recordedAt
                      ).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              {/* Description */}

              {selectedRecord.description && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Description
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {selectedRecord.description}
                  </p>
                </div>
              )}

              {/* Clinical Notes */}

              {selectedRecord.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Clinical Notes
                  </h3>

                  <div className="mt-2 rounded-lg bg-slate-50 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {selectedRecord.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Close */}

              <div className="flex justify-end border-t border-slate-200 pt-5">
                <button
                  onClick={() =>
                    setSelectedRecord(null)
                  }
                  className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;