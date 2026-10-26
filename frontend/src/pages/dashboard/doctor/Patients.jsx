import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  Mail,
  Phone,
  CalendarDays,
  RefreshCw,
  UserRound,
} from "lucide-react";

import api from "../../../services/api";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/appointments/doctor/patients"
      );

      setPatients(response.data.patients || []);
    } catch (error) {
      console.error("Fetch doctor patients error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      const fullName =
        `${patient.firstName || ""} ${patient.lastName || ""}`.toLowerCase();

      return (
        fullName.includes(query) ||
        patient.email?.toLowerCase().includes(query) ||
        patient.phone?.toLowerCase().includes(query)
      );
    });
  }, [patients, search]);

  const getPatientName = (patient) => {
    return (
      `${patient.firstName || ""} ${
        patient.lastName || ""
      }`.trim() || "Unknown Patient"
    );
  };

  const getInitials = (patient) => {
    const first = patient.firstName?.charAt(0) || "";
    const last = patient.lastName?.charAt(0) || "";

    return (
      `${first}${last}`.toUpperCase() || "P"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Doctor Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Patients
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View patients who have appointments with you.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={fetchPatients}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <Users size={23} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Patients
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {patients.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <Input
          label="Search Patients"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          icon={Search}
        />
      </div>

      {/* Patient List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-slate-900">
            Patient List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Patients connected to your consultations.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <RefreshCw
                size={20}
                className="animate-spin text-cyan-600"
              />
              Loading patients...
            </div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              {search ? (
                <Search size={26} />
              ) : (
                <Users size={26} />
              )}
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {search
                ? "No patients found"
                : "No patients yet"}
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              {search
                ? "Try searching with a different name, email or phone number."
                : "Patients who book appointments with you will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="p-5 transition hover:bg-slate-50 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Patient Identity */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-base font-bold text-cyan-700">
                      {getInitials(patient)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {getPatientName(patient)}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Patient
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                      <Mail
                        size={17}
                        className="shrink-0 text-cyan-600"
                      />

                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">
                          Email
                        </p>

                        <p className="truncate text-sm font-medium text-slate-700">
                          {patient.email ||
                            "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                      <Phone
                        size={17}
                        className="shrink-0 text-cyan-600"
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          Phone
                        </p>

                        <p className="text-sm font-medium text-slate-700">
                          {patient.phone ||
                            "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Information */}
                  <div className="flex gap-3">
                    <div className="rounded-xl bg-cyan-50 px-4 py-3 text-center">
                      <p className="text-xs text-cyan-600">
                        Appointments
                      </p>

                      <p className="mt-1 text-xl font-bold text-cyan-700">
                        {patient.totalAppointments}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-xs text-slate-400">
                        Last Appointment
                      </p>

                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <CalendarDays
                          size={15}
                          className="text-cyan-600"
                        />

                        {formatDate(
                          patient.lastAppointment
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients;