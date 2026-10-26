import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FlaskConical,
  FileText,
  Users,
  PlusCircle,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

import api from "../../../services/api";

function LaboratoryDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    reports: 0,
    patients: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaboratoryData();
  }, []);

  const fetchLaboratoryData = async () => {
    try {
      setLoading(true);

      const response = await api.get("/lab-reports/laboratory");

      const reports = response.data.reports || [];

      const uniquePatients = new Set(
        reports
          .map((report) => report.patient?._id)
          .filter(Boolean)
      );

      setStats({
        reports: response.data.count || reports.length,
        patients: uniquePatients.size,
      });
    } catch (error) {
      console.error(
        "Failed to load laboratory dashboard data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const overviewCards = [
    {
      title: "Lab Reports",
      value: stats.reports,
      description: "Reports created by your laboratory",
      icon: FileText,
      path: "/laboratory/reports",
    },
    {
      title: "Patients",
      value: stats.patients,
      description: "Patients with laboratory reports",
      icon: Users,
      path: "/laboratory/reports",
    },
  ];

  const quickActions = [
    {
      title: "Create Lab Report",
      description: "Add a new laboratory test report",
      icon: PlusCircle,
      path: "/laboratory/reports",
    },
    {
      title: "View Lab Reports",
      description: "Manage reports created by your laboratory",
      icon: ClipboardList,
      path: "/laboratory/reports",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">

        {/* Welcome */}
        <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Laboratory Dashboard
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome, {user?.firstName || "Laboratory"}.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage laboratory reports and patient test information
                from one connected workspace.
              </p>
            </div>

            <Link
              to="/laboratory/reports"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              <FlaskConical size={18} />
              Manage Reports
            </Link>
          </div>
        </section>

        {/* Overview */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Laboratory Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A quick look at your laboratory activity.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {overviewCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  to={card.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                      <Icon size={23} />
                    </div>

                    <span className="text-3xl font-bold text-slate-900">
                      {loading ? "..." : card.value}
                    </span>
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-900">
                    {card.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {card.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-cyan-600">
                    View details
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

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Common laboratory tasks.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-cyan-50 group-hover:text-cyan-600">
                    <Icon size={23} />
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

        {/* Information */}
        <section className="mt-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <FlaskConical size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Laboratory Management
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Create and manage patient laboratory reports,
                  record test results, and keep laboratory information
                  organized.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default LaboratoryDashboard;