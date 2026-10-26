import { useEffect, useState } from "react";
import {
  CalendarDays,
  Search,
  Clock3,
  Stethoscope,
  Video,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";

import api from "../../../services/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/appointments/patient");

        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load your appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "pending" ||
      appointment.status === "confirmed"
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDoctorName = (doctor) => {
    if (!doctor) return "Doctor";

    return `Dr. ${doctor.firstName || ""} ${
      doctor.lastName || ""
    }`.trim();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
            Patient Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Appointments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your upcoming and previous healthcare appointments.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <button
            type="button"
            onClick={() => {
              window.location.href = "/doctors";
            }}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Search size={21} />
            </div>

            <h2 className="mt-5 font-semibold text-slate-900">
              Find a Doctor
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search doctors and book an appointment.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/doctors";
            }}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <CalendarDays size={21} />
            </div>

            <h2 className="mt-5 font-semibold text-slate-900">
              Book Appointment
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Schedule a consultation with a healthcare provider.
            </p>
          </button>

          <button
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Clock3 size={21} />
            </div>

            <h2 className="mt-5 font-semibold text-slate-900">
              Appointment History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View your previous healthcare appointments.
            </p>
          </button>

        </div>

        {/* Upcoming Appointments */}
        <section className="mt-10">

          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Upcoming Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your scheduled appointments will appear here.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <Loader2
                  size={20}
                  className="animate-spin text-cyan-600"
                />
                Loading appointments...
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={22}
                  className="mt-0.5 text-red-600"
                />

                <div>
                  <h3 className="font-semibold text-red-900">
                    Unable to load appointments
                  </h3>

                  <p className="mt-1 text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* No appointments */}
          {!loading &&
            !error &&
            upcomingAppointments.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <CalendarDays size={30} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    No upcoming appointments
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Once you book an appointment with a doctor,
                    the appointment details will appear here.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/doctors";
                    }}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white transition hover:bg-cyan-700"
                  >
                    <Stethoscope size={18} />
                    Find a Doctor
                  </button>

                </div>
              </div>
            )}

          {/* Appointment Cards */}
          {!loading &&
            !error &&
            upcomingAppointments.length > 0 && (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                      {/* Doctor */}
                      <div className="flex items-start gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-lg font-bold text-cyan-700">
                          {appointment.doctor?.firstName?.[0] || "D"}
                          {appointment.doctor?.lastName?.[0] || ""}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {getDoctorName(appointment.doctor)}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Healthcare consultation
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">

                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                appointment.status === "confirmed"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {appointment.status}
                            </span>

                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                              {appointment.consultationType ===
                              "online" ? (
                                <Video size={13} />
                              ) : (
                                <MapPin size={13} />
                              )}

                              {appointment.consultationType}
                            </span>

                          </div>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="grid gap-3 sm:grid-cols-2 lg:min-w-96">

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-medium text-slate-400">
                            DATE
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {formatDate(
                              appointment.appointmentDate
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-medium text-slate-400">
                            TIME
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {appointment.appointmentTime}
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* Reason */}
                    {appointment.reason && (
                      <div className="mt-5 border-t border-slate-100 pt-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Reason
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {appointment.reason}
                        </p>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}

        </section>
      </div>
    </div>
  );
}

export default Appointments;