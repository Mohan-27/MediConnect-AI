import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Users,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import api from "../../../services/api";

function DoctorDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Fetch doctor appointments
  // --------------------------------------------------

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/appointments/doctor"
      );

      setAppointments(
        response.data.appointments || []
      );
    } catch (err) {
      console.error(
        "Doctor dashboard appointments error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load appointment statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Calculate dashboard statistics
  // --------------------------------------------------

  const stats = useMemo(() => {
    const now = new Date();

    // Start of today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // Start of tomorrow
    const startOfTomorrow = new Date(
      startOfToday
    );
    startOfTomorrow.setDate(
      startOfTomorrow.getDate() + 1
    );

    // Today's appointments
    const todaysAppointments =
      appointments.filter((appointment) => {
        if (!appointment.appointmentDate) {
          return false;
        }

        const appointmentDate = new Date(
          appointment.appointmentDate
        );

        return (
          appointmentDate >= startOfToday &&
          appointmentDate < startOfTomorrow
        );
      });

    // Upcoming appointments
    const upcomingAppointments =
      appointments.filter((appointment) => {
        if (!appointment.appointmentDate) {
          return false;
        }

        const appointmentDate = new Date(
          appointment.appointmentDate
        );

        return appointmentDate >= startOfTomorrow;
      });

    // Unique patients
    const uniquePatientIds = new Set(
      appointments
        .map((appointment) => {
          if (
            typeof appointment.patient ===
            "object"
          ) {
            return appointment.patient?._id;
          }

          return appointment.patient;
        })
        .filter(Boolean)
    );

    // Completed consultations
    const completedConsultations =
      appointments.filter(
        (appointment) =>
          appointment.status === "completed"
      );

    return {
      todaysAppointments:
        todaysAppointments.length,

      upcomingAppointments:
        upcomingAppointments.length,

      totalPatients:
        uniquePatientIds.size,

      completedConsultations:
        completedConsultations.length,

      todaysAppointmentList:
        todaysAppointments,
    };
  }, [appointments]);

  // --------------------------------------------------
  // Stats cards
  // --------------------------------------------------

  const statCards = [
    {
      label: "Today's Appointments",
      value: stats.todaysAppointments,
      icon: CalendarDays,
      description: "Scheduled for today",
    },
    {
      label: "Upcoming Appointments",
      value: stats.upcomingAppointments,
      icon: Clock3,
      description: "Awaiting consultation",
    },
    {
      label: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      description: "Patients consulted",
    },
    {
      label: "Completed Consultations",
      value: stats.completedConsultations,
      icon: CheckCircle2,
      description: "Successfully completed",
    },
  ];

  // --------------------------------------------------
  // Format patient name
  // --------------------------------------------------

  const getPatientName = (appointment) => {
    const patient = appointment.patient;

    if (!patient) {
      return "Patient";
    }

    if (typeof patient === "object") {
      return `${patient.firstName || ""} ${
        patient.lastName || ""
      }`.trim();
    }

    return "Patient";
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
            Doctor Dashboard
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Good morning, Dr.{" "}
                {user?.firstName || "Doctor"}.
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Here's an overview of your healthcare
                practice today.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-700">
              <Activity size={18} />
              Doctor Portal
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <AlertCircle
                size={19}
                className="text-red-600"
              />

              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>

            <button
              onClick={fetchAppointments}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {loading ? "—" : stat.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Today's Appointments */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Today's Appointments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your scheduled consultations for today.
                </p>
              </div>

              <CalendarDays
                className="text-cyan-600"
                size={21}
              />
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex min-h-52 items-center justify-center text-sm text-slate-500">
                  Loading appointments...
                </div>
              ) : stats.todaysAppointmentList
                  .length === 0 ? (
                <div className="flex min-h-52 flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <CalendarDays size={26} />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-800">
                    No appointments today
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    You don't have any appointments
                    scheduled for today.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.todaysAppointmentList.map(
                    (appointment) => (
                      <div
                        key={appointment._id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                            <Users size={18} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {getPatientName(
                                appointment
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {appointment.consultationType ||
                                "Consultation"}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-800">
                            {appointment.appointmentTime ||
                              "Time not set"}
                          </p>

                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {appointment.status ||
                              "pending"}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your practice quickly.
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    View Appointments
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Review your patient bookings
                  </p>
                </div>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Users size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Patient Records
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    View your patient information
                  </p>
                </div>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <FileText size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Prescriptions
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage patient prescriptions
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Practice Overview */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <StethoscopeIcon />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Practice Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your doctor account information.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem
              label="Doctor"
              value={`Dr. ${user?.firstName || ""} ${
                user?.lastName || ""
              }`}
            />

            <InfoItem
              label="Email"
              value={user?.email || "Not available"}
            />

            <InfoItem
              label="Phone"
              value={user?.phone || "Not available"}
            />

            <InfoItem
              label="Role"
              value="Doctor"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function StethoscopeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3v4a6 6 0 0 0 12 0V3" />
      <path d="M6 3H4" />
      <path d="M18 3h2" />
      <path d="M12 13v2a4 4 0 0 0 4 4h1a3 3 0 1 1-3 3" />
    </svg>
  );
}

export default DoctorDashboard;