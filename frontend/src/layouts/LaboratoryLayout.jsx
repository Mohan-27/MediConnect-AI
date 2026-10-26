import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  FlaskConical,
} from "lucide-react";

import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function LaboratoryLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/laboratory/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Lab Reports",
      path: "/laboratory/reports",
      icon: FileText,
    },
    {
      name: "Settings",
      path: "/laboratory/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= MOBILE HEADER ================= */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <FlaskConical
            size={24}
            className="text-teal-600"
          />

          <span className="font-bold text-slate-900">
            Laboratory Portal
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 w-64 border-r border-slate-200 bg-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-50 p-2">
              <FlaskConical
                size={24}
                className="text-teal-600"
              />
            </div>

            <div>
              <p className="font-bold text-slate-900">
                MediConnect AI
              </p>

              <p className="text-xs text-slate-500">
                Laboratory Portal
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={19} />

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="min-h-screen lg:ml-64">
        <div className="px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}