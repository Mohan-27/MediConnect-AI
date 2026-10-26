import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  Clock3,
  Stethoscope,
  CalendarDays,
  SlidersHorizontal,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const consultationTypes = [
  "All Consultation Types",
  "Online",
  "In-person",
];

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState(
    "All Specializations"
  );
  const [consultationType, setConsultationType] = useState(
    "All Consultation Types"
  );

  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch doctors from MongoDB through the backend API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/doctors");

        setDoctors(response.data.doctors || []);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load doctors. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Create specialization list from real doctors
  const specializations = useMemo(() => {
    const uniqueSpecializations = [
      ...new Set(
        doctors
          .map((doctor) => doctor.specialization)
          .filter(Boolean)
      ),
    ];

    return ["All Specializations", ...uniqueSpecializations];
  }, [doctors]);

  // Convert backend doctor data into UI-friendly data
  const formattedDoctors = useMemo(() => {
    return doctors.map((doctor) => {
      const firstName = doctor.firstName || "";
      const lastName = doctor.lastName || "";

      const fullName = `Dr. ${firstName} ${lastName}`.trim();

      const initials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

      return {
        ...doctor,
        name: fullName,
        initials: initials || "DR",

        // These fields are not currently returned by the backend.
        // Temporary UI defaults are used until doctor profile data is added.
        specialization: doctor.specialization || "General Physician",
        experience: doctor.experience || 0,
        fee: doctor.fee || 0,
        location: doctor.location || "Location not available",
        rating: doctor.rating || 0,
        reviews: doctor.reviews || 0,
        availability: doctor.availability || "Availability not available",
        consultation:
          doctor.consultation || "Online & In-person",
      };
    });
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return formattedDoctors.filter((doctor) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        doctor.name.toLowerCase().includes(search) ||
        doctor.specialization.toLowerCase().includes(search) ||
        doctor.location.toLowerCase().includes(search);

      const matchesSpecialization =
        specialization === "All Specializations" ||
        doctor.specialization === specialization;

      const matchesConsultation =
        consultationType === "All Consultation Types" ||
        doctor.consultation.includes(consultationType);

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesConsultation
      );
    });
  }, [
    formattedDoctors,
    searchTerm,
    specialization,
    consultationType,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSpecialization("All Specializations");
    setConsultationType("All Consultation Types");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
              Healthcare Directory
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Find the right doctor for you
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Search trusted healthcare professionals by specialty,
              location, and consultation type.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search doctor, specialty or city..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 lg:hidden"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>

              <div className="hidden gap-3 lg:flex">
                <select
                  value={specialization}
                  onChange={(event) =>
                    setSpecialization(event.target.value)
                  }
                  className="h-12 min-w-52 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  {specializations.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={consultationType}
                  onChange={(event) =>
                    setConsultationType(event.target.value)
                  }
                  className="h-12 min-w-48 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  {consultationTypes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="mt-3 grid gap-3 border-t border-slate-200 pt-3 sm:grid-cols-2 lg:hidden">
                <select
                  value={specialization}
                  onChange={(event) =>
                    setSpecialization(event.target.value)
                  }
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-cyan-500"
                >
                  {specializations.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={consultationType}
                  onChange={(event) =>
                    setConsultationType(event.target.value)
                  }
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-cyan-500"
                >
                  {consultationTypes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Available Doctors
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading doctors..."
                : `${filteredDoctors.length} doctors found`}
            </p>
          </div>

          {(searchTerm ||
            specialization !== "All Specializations" ||
            consultationType !== "All Consultation Types") && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-cyan-600 hover:text-cyan-700"
            >
              <X size={16} />
              Clear filters
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <Loader2
              size={32}
              className="mx-auto animate-spin text-cyan-600"
            />

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              Loading doctors
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Fetching healthcare professionals from MediConnect AI.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={28} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              Unable to load doctors
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Doctors */}
        {!loading && !error && filteredDoctors.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <article
                key={doctor._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-lg font-bold text-cyan-700">
                      {doctor.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-slate-900">
                        {doctor.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-2">
                        <Stethoscope
                          size={15}
                          className="text-cyan-600"
                        />

                        <span className="text-sm font-medium text-cyan-700">
                          {doctor.specialization}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-1 text-sm">
                        <Star
                          size={15}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span className="font-semibold text-slate-800">
                          {doctor.rating || "New"}
                        </span>

                        {doctor.reviews > 0 && (
                          <span className="text-slate-400">
                            ({doctor.reviews})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock3
                        size={17}
                        className="text-slate-400"
                      />

                      <span>
                        {doctor.experience > 0
                          ? `${doctor.experience} years experience`
                          : "Experience not available"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin
                        size={17}
                        className="text-slate-400"
                      />

                      <span>{doctor.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <CalendarDays
                        size={17}
                        className="text-slate-400"
                      />

                      <span>{doctor.availability}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        Consultation
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {doctor.fee > 0
                          ? `₹${doctor.fee}`
                          : "Fee not available"}
                      </p>
                    </div>

                    <span className="text-xs font-medium text-slate-500">
                      {doctor.consultation}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Link
                      to={`/doctors/${doctor._id}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      View Profile
                    </Link>

                    <Link
                      to={`/doctors/${doctor._id}/book`}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* No doctors */}
        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={28} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              No doctors found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing your search or removing some filters to
              find more healthcare professionals.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Doctors;