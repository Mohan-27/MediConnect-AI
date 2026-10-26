import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CalendarCheck,
  FlaskConical,
  Hospital,
  Pill,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "Find Doctors",
    description:
      "Discover verified healthcare professionals based on specialty, location, availability, and consultation type.",
  },
  {
    icon: CalendarCheck,
    title: "Book Appointments",
    description:
      "Find available time slots and manage your healthcare appointments from one place.",
  },
  {
    icon: FlaskConical,
    title: "Laboratory Tests",
    description:
      "Discover laboratory services and manage test bookings and reports digitally.",
  },
  {
    icon: Pill,
    title: "Pharmacy",
    description:
      "Connect prescriptions with registered pharmacies and track medicine orders.",
  },
  {
    icon: Hospital,
    title: "Healthcare Facilities",
    description:
      "Explore hospitals, departments, facilities, and healthcare services.",
  },
  {
    icon: BrainCircuit,
    title: "AI Health Assistant",
    description:
      "Get general health guidance and healthcare navigation support using AI.",
  },
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
              Connected healthcare platform
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Healthcare Connected.
              <span className="block text-cyan-600">
                Intelligence Powered.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              MediConnect AI brings patients, doctors, hospitals,
              laboratories, pharmacies, and intelligent healthcare services
              together through one connected platform.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/doctors"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Find a Doctor
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/ai-assistant"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Talk to AI
                <BrainCircuit size={17} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-cyan-600" />
                Secure platform foundation
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-cyan-600" />
                Provider verification
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-cyan-100/50 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-5 shadow-2xl">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      MediConnect AI
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      Healthcare overview
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <BrainCircuit size={20} />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                    <Stethoscope className="text-cyan-400" size={19} />
                    <p className="mt-5 text-sm text-slate-400">
                      Doctors
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      Discovery
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                    <CalendarCheck className="text-cyan-400" size={19} />
                    <p className="mt-5 text-sm text-slate-400">
                      Appointments
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      Connected
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                    <FlaskConical className="text-cyan-400" size={19} />
                    <p className="mt-5 text-sm text-slate-400">
                      Laboratory
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      Reports
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                    <Pill className="text-cyan-400" size={19} />
                    <p className="mt-5 text-sm text-slate-400">
                      Pharmacy
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      Orders
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-cyan-400" />
                    <p className="text-sm font-medium text-cyan-200">
                      AI healthcare assistance available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-10 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
          {[
            "Verified Doctors",
            "Trusted Hospitals",
            "Certified Laboratories",
            "Registered Pharmacies",
            "Secure Platform",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 text-sm font-medium text-slate-600"
            >
              <ShieldCheck size={18} className="text-cyan-600" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
              Healthcare ecosystem
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              One platform for your healthcare journey.
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Access connected healthcare services through a single,
              consistent digital experience.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    Explore
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Intelligent healthcare
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Your intelligent healthcare companion.
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-slate-400">
              Ask general health questions, describe symptoms for general
              triage guidance, explore relevant healthcare departments, and
              interact with the platform using multilingual capabilities.
            </p>

            <div className="mt-8">
              <Link
                to="/ai-assistant"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Try AI Assistant
                <ArrowRight size={17} />
              </Link>
            </div>

            <p className="mt-6 max-w-lg text-xs leading-5 text-slate-500">
              MediConnect AI provides general information and healthcare
              navigation support. It is not a replacement for professional
              medical diagnosis or emergency care.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="rounded-xl bg-white p-5 text-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                  <BrainCircuit size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold">MediConnect AI</p>
                  <p className="text-xs text-slate-400">
                    General healthcare guidance
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                "Based on the information you provided, General Medicine or
                Pulmonology may be appropriate. This is general guidance and
                not a diagnosis."
              </div>

              <div className="mt-4 flex gap-2">
                {["General Medicine", "Pulmonology", "Book a Doctor"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;