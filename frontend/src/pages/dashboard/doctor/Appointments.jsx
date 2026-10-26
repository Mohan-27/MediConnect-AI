import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  UserRound,
  Video,
  Building2,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  RefreshCw,
  Mail,
  Phone,
} from "lucide-react";

import api from "../../../services/api";
import Button from "../../../components/common/Button";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments/doctor");

      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Fetch doctor appointments error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);
      setError("");

      const response = await api.patch(
        `/appointments/${appointmentId}/status`,
        {
          status,
        }
      );

      const updatedAppointment = response.data.appointment;

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment._id === updatedAppointment._id
            ? updatedAppointment
            : appointment
        )
      );
    } catch (error) {
      console.error("Update appointment status error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update appointment status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPatientName = (patient) => {
    if (!patient) return "Unknown Patient";

    return `${patient.firstName || ""} ${
      patient.lastName || ""
    }`.trim() || "Unknown Patient";
  };

  const getInitials = (patient) => {
    if (!patient) return "P";

    const first = patient.firstName?.charAt(0) || "";
    const last = patient.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase() || "P";
  };

  const getStatusClasses = (status) => {
    const classes = {
      pending:
        "bg-amber-50 text-amber-700 border-amber-200",
      confirmed:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
      completed:
        "bg-blue-50 text-blue-700 border-blue-200",
      rejected:
        "bg-red-50 text-red-700 border-red-200",
      cancelled:
        "bg-slate-100 text-slate-600 border-slate-200",
    };

    return (
      classes[status] ||
      "bg-slate-100 text-slate-600 border-slate-200"
    );
  };

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Doctor Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Appointments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your patient appointments and consultation requests.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={fetchAppointments}
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

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {appointments.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <CalendarDays size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {pendingCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Confirmed</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {confirmedCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {completedCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ClipboardCheck size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Appointment List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-slate-900">
            Patient Appointments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage your scheduled consultations.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <RefreshCw
                size={20}
                className="animate-spin text-cyan-600"
              />
              Loading appointments...
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <CalendarDays size={26} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No appointments yet
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Patient appointment requests will appear here when
              someone books a consultation with you.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map((appointment) => {
              const patient = appointment.patient;
              const isUpdating =
                updatingId === appointment._id;

              return (
                <div
                  key={appointment._id}
                  className="p-5 transition hover:bg-slate-50 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    {/* Patient */}
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                        {getInitials(patient)}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {getPatientName(patient)}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                              appointment.status
                            )}`}
                          >
                            {getStatusLabel(
                              appointment.status
                            )}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1.5 text-sm text-slate-500">
                          {patient?.email && (
                            <p className="flex items-center gap-2">
                              <Mail size={14} />
                              {patient.email}
                            </p>
                          )}

                          {patient?.phone && (
                            <p className="flex items-center gap-2">
                              <Phone size={14} />
                              {patient.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Appointment Info */}
                    <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-medium text-slate-400">
                          Date
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <CalendarDays
                            size={15}
                            className="text-cyan-600"
                          />
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-medium text-slate-400">
                          Time
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Clock
                            size={15}
                            className="text-cyan-600"
                          />
                          {appointment.appointmentTime ||
                            "Not available"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-medium text-slate-400">
                          Consultation
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold capitalize text-slate-700">
                          {appointment.consultationType ===
                          "online" ? (
                            <Video
                              size={15}
                              className="text-cyan-600"
                            />
                          ) : (
                            <Building2
                              size={15}
                              className="text-cyan-600"
                            />
                          )}

                          {appointment.consultationType ||
                            "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  {appointment.reason && (
                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Reason for Visit
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {appointment.reason}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {appointment.status === "pending" && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        onClick={() =>
                          updateStatus(
                            appointment._id,
                            "confirmed"
                          )
                        }
                        loading={isUpdating}
                      >
                        <CheckCircle2 size={16} />
                        Confirm
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          updateStatus(
                            appointment._id,
                            "rejected"
                          )
                        }
                        disabled={isUpdating}
                      >
                        <XCircle size={16} />
                        Reject
                      </Button>
                    </div>
                  )}

                  {appointment.status === "confirmed" && (
                    <div className="mt-5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          updateStatus(
                            appointment._id,
                            "completed"
                          )
                        }
                        loading={isUpdating}
                      >
                        <ClipboardCheck size={16} />
                        Mark as Completed
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;