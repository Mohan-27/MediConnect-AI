import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Stethoscope,
  UserRound,
  FileText,
  X,
} from "lucide-react";

import { logout } from "../store/authSlice";

function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const navItems = [
    {
      label: "Dashboard",
      path: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Appointments",
      path: "/doctor/appointments",
      icon: CalendarDays,
    },
    {
      label: "Patients",
      path: "/doctor/patients",
      icon: UserRound,
    },
    {
      label: "Prescriptions",
      path: "/doctor/prescriptions",
      icon: ClipboardList,
    },
    {
      label: "Profile",
      path: "/doctor/profile",
      icon: Stethoscope,
    },
    {
      label: "Medical Records",
      path: "/doctor/medical-records",
      icon: FileText,
    },

    {
      label: "Settings",
      path: "/doctor/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive
      ? "bg-cyan-50 text-cyan-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600 text-white">
            <Stethoscope size={19} />
          </div>

          <span className="font-bold text-slate-900">
            MediConnect<span className="text-cyan-600"> AI</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${collapsed ? "w-20" : "w-72"
          } ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white">
                <Stethoscope size={21} />
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  MediConnect<span className="text-cyan-600"> AI</span>
                </p>
                <p className="text-xs text-slate-400">Doctor Portal</p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white">
              <Stethoscope size={21} />
            </div>
          )}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Collapse button */}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-3 top-24 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-cyan-600 lg:flex"
        >
          {collapsed ? (
            <ChevronRight size={15} />
          ) : (
            <ChevronLeft size={15} />
          )}
        </button>

        {/* Doctor Info */}
        <div className="border-b border-slate-100 p-4">
          <div
            className={`flex items-center ${collapsed ? "justify-center" : "gap-3"
              }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-100 font-bold text-cyan-700">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  Dr. {user?.firstName} {user?.lastName}
                </p>

                <p className="mt-0.5 text-xs capitalize text-slate-400">
                  {user?.role || "Doctor"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Doctor Portal
            </p>
          )}

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={linkClasses}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={19} className="shrink-0" />

                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 ${collapsed ? "justify-center" : ""
              }`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={19} />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`min-h-screen pt-16 transition-all duration-300 lg:pt-0 ${collapsed ? "lg:pl-20" : "lg:pl-72"
          }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default DoctorLayout;