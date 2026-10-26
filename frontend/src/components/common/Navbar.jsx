import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Stethoscope,
  ChevronDown,
} from "lucide-react";

const navigation = [
  { name: "Home", path: "/" },
  { name: "Find Doctors", path: "/doctors" },
  { name: "Hospitals", path: "/hospitals" },
  { name: "Laboratories", path: "/laboratories" },
  { name: "Pharmacies", path: "/pharmacies" },
  { name: "AI Assistant", path: "/ai-assistant" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Stethoscope size={21} />
          </div>

          <div>
            <p className="text-lg font-bold leading-none text-slate-900">
              MediConnect
              <span className="text-cyan-600"> AI</span>
            </p>

            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Connected Healthcare
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="mx-auto max-w-7xl px-5 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;