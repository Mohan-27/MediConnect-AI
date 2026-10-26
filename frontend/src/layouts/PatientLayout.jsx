import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HeartPulse,
  LayoutDashboard,
  CalendarDays,
  UserRoundSearch,
  Pill,
  FileText,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import { logout } from "../store/authSlice";

function PatientLayout() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/patient/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Appointments",
      path: "/patient/appointments",
      icon: CalendarDays,
    },
    {
      label: "Find Doctors",
      path: "/doctors",
      icon: UserRoundSearch,
    },
    {
      label: "Prescriptions",
      path: "/patient/prescriptions",
      icon: Pill,
    },
    {
      label: "Lab Reports",
      path: "/patient/lab-reports",
      icon: FileText,
    },
    {
      label: "Medical Records",
      path: "/patient/medical-records",
      icon: FileText,
    },
    {
      label: "AI Assistant",
      path: "/ai-assistant",
      icon: Bot,
    },
    {
      label: "Settings",
      path: "/patient/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Link
          to="/patient/dashboard"
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600 text-white">
            <HeartPulse size={20} />
          </div>

          <span className="font-bold text-slate-900">
            MediConnect<span className="text-cyan-600"> AI</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <Link
            to="/patient/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white">
              <HeartPulse size={22} />
            </div>

            <div>
              <p className="font-bold text-slate-900">
                MediConnect<span className="text-cyan-600"> AI</span>
              </p>

              <p className="text-[10px] font-semibold tracking-widest text-slate-400">
                PATIENT PORTAL
              </p>
            </div>
          </Link>
        </div>

        {/* User */}
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="truncate text-xs capitalize text-slate-500">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Main Menu
          </p>

          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive
                      ? "bg-cyan-50 text-cyan-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={19} />

                  <span className="flex-1">
                    {item.label}
                  </span>

                  <ChevronRight size={15} className="opacity-40" />
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="lg:pl-72">
        <Outlet />
      </div>
    </div>
  );
}

export default PatientLayout;