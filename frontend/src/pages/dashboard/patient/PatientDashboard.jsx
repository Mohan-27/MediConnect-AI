import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CalendarDays,
  FileText,
  Pill,
  Bot,
  UserRoundSearch,
  FlaskConical,
  ArrowRight,
  MapPin,
  Stethoscope,
  ClipboardList,
} from "lucide-react";

import api from "../../../services/api";

function PatientDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    appointments: 0,
    prescriptions: 0,
    medicalRecords: 0,
    labReports: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true);

      const [
        appointmentsResponse,
        prescriptionsResponse,
        medicalRecordsResponse,
        labReportsResponse,
      ] = await Promise.all([
        api.get("/appointments/patient"),
        api.get("/prescriptions/patient"),
        api.get("/medical-records/patient"),
        api.get("/lab-reports/patient"),
      ]);

      setStats({
        appointments: appointmentsResponse.data.count || 0,
        prescriptions: prescriptionsResponse.data.count || 0,
        medicalRecords: medicalRecordsResponse.data.count || 0,
        labReports: labReportsResponse.data.count || 0,
      });
    } catch (error) {
      console.error(
        "Failed to load patient dashboard data:",
        error
      );
    } finally {
      setLoadingStats(false);
    }
  };

  const overviewCards = [
    {
      title: "Appointments",
      value: stats.appointments,
      description: "Your appointments",
      icon: CalendarDays,
      path: "/patient/appointments",
    },
    {
      title: "Prescriptions",
      value: stats.prescriptions,
      description: "Available prescriptions",
      icon: Pill,
      path: "/patient/prescriptions",
    },
    {
      title: "Medical Records",
      value: stats.medicalRecords,
      description: "Your medical records",
      icon: FileText,
      path: "/patient/medical-records",
    },
    {
      title: "Lab Reports",
      value: stats.labReports,
      description: "Your laboratory reports",
      icon: FlaskConical,
      path: "/patient/lab-reports",
    },
  ];

  const quickActions = [
    {
      title: "Find a Doctor",
      description: "Search doctors by specialty",
      icon: UserRoundSearch,
      path: "/doctors",
    },
    {
      title: "Book Appointment",
      description: "Schedule your next visit",
      icon: CalendarDays,
      path: "/doctors",
    },
    {
      title: "Prescriptions",
      description: "View your medicines and prescriptions",
      icon: Pill,
      path: "/patient/prescriptions",
    },
    {
      title: "Medical Records",
      description: "View your consultation records",
      icon: ClipboardList,
      path: "/patient/medical-records",
    },
    {
      title: "Lab Reports",
      description: "View your laboratory reports",
      icon: FlaskConical,
      path: "/patient/lab-reports",
    },
    {
      title: "Find Laboratory",
      description: "Explore nearby laboratories",
      icon: FlaskConical,
      path: "/laboratories",
    },
    {
      title: "AI Health Assistant",
      description: "Get general health guidance",
      icon: Bot,
      path: "/ai-assistant",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">

        {/* Welcome Section */}
        <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Patient Dashboard
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {user?.firstName || "Patient"}.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your appointments, prescriptions, medical
                records and healthcare services from one connected
                place.
              </p>
            </div>

            <Link
              to="/ai-assistant"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              <Bot size={18} />
              Talk to AI Assistant
            </Link>
          </div>
        </section>

        {/* Overview */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Your Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A quick look at your healthcare activity.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {overviewCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  to={card.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                      <Icon size={21} />
                    </div>

                    <span className="text-2xl font-bold text-slate-900">
                      {loadingStats ? "..." : card.value}
                    </span>
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-slate-900">
                    {card.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {card.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-600">
                    View details
                    <ArrowRight
                      size={14}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Access commonly used healthcare services.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-cyan-50 group-hover:text-cyan-600">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-900">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {action.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-cyan-600">
                    Open
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Appointments */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Appointments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your scheduled healthcare visits.
              </p>
            </div>

            <Link
              to="/patient/appointments"
              className="text-sm font-semibold text-cyan-600 hover:text-cyan-700"
            >
              View all →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {stats.appointments === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <CalendarDays size={26} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  No appointments yet
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Find a doctor and book your first appointment
                  through MediConnect AI.
                </p>

                <Link
                  to="/doctors"
                  className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white transition hover:bg-cyan-700"
                >
                  <Stethoscope size={17} />
                  Find a Doctor
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <CalendarDays size={22} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      You have {stats.appointments} appointment
                      {stats.appointments !== 1 ? "s" : ""}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      View your appointment schedule.
                    </p>
                  </div>
                </div>

                <Link
                  to="/patient/appointments"
                  className="hidden items-center gap-1 text-sm font-semibold text-cyan-600 sm:flex"
                >
                  View
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Health Information */}
        <section className="mt-10 grid gap-5 lg:grid-cols-2">

          {/* Healthcare Near You */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <MapPin size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Healthcare Near You
                </h3>

                <p className="text-sm text-slate-500">
                  Find hospitals, doctors and laboratories nearby.
                </p>
              </div>
            </div>

            <Link
              to="/hospitals"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Explore healthcare providers
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Medical Records */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <FileText size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Medical Records
                </h3>

                <p className="text-sm text-slate-500">
                  View your consultation records and clinical notes.
                </p>
              </div>
            </div>

            <Link
              to="/patient/medical-records"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
            >
              View medical records
              <ArrowRight size={16} />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default PatientDashboard;