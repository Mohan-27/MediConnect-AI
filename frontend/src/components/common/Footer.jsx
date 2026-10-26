import { Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600 text-white">
                <HeartPulse size={20} />
              </div>

              <span className="text-lg font-bold text-slate-900">
                MediConnect<span className="text-cyan-600"> AI</span>
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              Connecting patients, doctors, hospitals, laboratories and
              pharmacies through intelligent digital healthcare.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
              >
                LinkedIn
              </a>

              <a
                href="#"
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Platform
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  to="/doctors"
                  className="transition hover:text-cyan-600"
                >
                  Find Doctors
                </Link>
              </li>

              <li>
                <Link
                  to="/hospitals"
                  className="transition hover:text-cyan-600"
                >
                  Hospitals
                </Link>
              </li>

              <li>
                <Link
                  to="/laboratories"
                  className="transition hover:text-cyan-600"
                >
                  Laboratories
                </Link>
              </li>

              <li>
                <Link
                  to="/pharmacies"
                  className="transition hover:text-cyan-600"
                >
                  Pharmacies
                </Link>
              </li>
            </ul>
          </div>

          {/* Healthcare */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Healthcare
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  to="/ai-assistant"
                  className="transition hover:text-cyan-600"
                >
                  AI Health Assistant
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="transition hover:text-cyan-600"
                >
                  About MediConnect
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="transition hover:text-cyan-600"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Legal
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  to="/privacy"
                  className="transition hover:text-cyan-600"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="transition hover:text-cyan-600"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} MediConnect AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;