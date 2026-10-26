import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Stethoscope,
  Video,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

function DoctorProfile() {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/doctors/${doctorId}`);

        setDoctor(response.data.doctor);
      } catch (err) {
        console.error("Failed to fetch doctor:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load doctor profile."
        );
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Loader2
            size={36}
            className="mx-auto animate-spin text-cyan-600"
          />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Loading doctor profile
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Fetching doctor information from MediConnect AI.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Doctor not found
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {error ||
              "The doctor profile you are looking for does not exist."}
          </p>

          <Link
            to="/doctors"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            <ArrowLeft size={17} />
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  const firstName = doctor.firstName || "";
  const lastName = doctor.lastName || "";

  const doctorName = `Dr. ${firstName} ${lastName}`.trim();

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
    "DR";

  /*
    These fields are not currently stored in the User model.
    Temporary fallback values are used until we create
    the Doctor Profile system.
  */
  const specialization =
    doctor.specialization || "General Physician";

  const experience = doctor.experience || 0;
  const fee = doctor.fee || 0;
  const location =
    doctor.location || "Location not available";

  const rating = doctor.rating || 0;
  const reviews = doctor.reviews || 0;

  const availability =
    doctor.availability || "Availability not available";

  const consultation =
    doctor.consultation || "Online & In-person";

  const about =
    doctor.about ||
    `${doctorName} is a healthcare professional registered with MediConnect AI. Doctor profile information will be expanded as additional professional details are added.`;

  const education = doctor.education || [
    "Professional qualifications will be added soon.",
  ];

  const expertise = doctor.expertise || [
    "General Healthcare",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6 lg:px-8">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-cyan-600"
          >
            <ArrowLeft size={17} />
            Back to Doctors
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Profile header */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-500 sm:h-40" />

          <div className="px-6 pb-7 sm:px-8">
            <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-cyan-50 text-3xl font-bold text-cyan-700 shadow-md">
                  {initials}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                      {doctorName}
                    </h1>

                    <CheckCircle2
                      size={21}
                      className="text-cyan-600"
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-semibold text-cyan-700">
                      {specialization}
                    </span>

                    <span className="text-slate-300">•</span>

                    <span className="text-slate-500">
                      {experience > 0
                        ? `${experience} years experience`
                        : "Experience not available"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <strong className="text-slate-800">
                        {rating || "New"}
                      </strong>

                      {reviews > 0 && (
                        <>({reviews} reviews)</>
                      )}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/doctors/${doctor._id}/book`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 text-sm font-semibold text-white transition hover:bg-cyan-700"
                >
                  <CalendarDays size={18} />
                  Book Appointment
                </Link>

                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  <MessageCircle size={18} />
                  Message
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* About */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Stethoscope size={20} />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  About the Doctor
                </h2>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {about}
              </p>
            </section>

            {/* Education */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <GraduationCap size={20} />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Education & Qualifications
                </h2>
              </div>

              <div className="mt-5 space-y-3">
                {education.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-cyan-600"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Expertise */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-slate-900">
                Areas of Expertise
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {expertise.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Consultation */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Consultation
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Consultation fee
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    {fee > 0 ? `₹${fee}` : "Not available"}
                  </span>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Video size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Consultation Type
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {consultation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Location
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {location}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to={`/doctors/${doctor._id}/book`}
                className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                <CalendarDays size={18} />
                Book Appointment
              </Link>
            </section>

            {/* Availability */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Clock3 size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Availability
                  </h2>

                  <p className="mt-0.5 text-xs text-green-600">
                    {availability}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Consultation hours
                  </span>

                  <span className="font-semibold text-slate-800">
                    9:00 AM – 5:00 PM
                  </span>
                </div>
              </div>
            </section>

            {/* Verification */}
            <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-6">
              <div className="flex gap-3">
                <ShieldCheck
                  size={23}
                  className="shrink-0 text-cyan-600"
                />

                <div>
                  <h3 className="font-semibold text-cyan-900">
                    Verified Healthcare Professional
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-cyan-800/80">
                    Doctor credentials are verified by MediConnect AI
                    before being listed on the platform.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default DoctorProfile;