import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Stethoscope,
  Video,
} from "lucide-react";

import api from "../../services/api";

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

function BookAppointment() {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [doctorError, setDoctorError] = useState("");

  const [consultationType, setConsultationType] = useState("online");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoadingDoctor(true);
        setDoctorError("");

        const response = await api.get(`/doctors/${doctorId}`);

        setDoctor(response.data.doctor);
      } catch (error) {
        console.error("Fetch doctor error:", error);

        setDoctorError(
          error.response?.data?.message ||
            "Unable to load the doctor. Please try again."
        );
      } finally {
        setLoadingDoctor(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const dates = useMemo(() => {
    const result = [];

    for (let i = 1; i <= 7; i += 1) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      result.push({
        value: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        date: date.toLocaleDateString("en-US", {
          day: "numeric",
        }),
        month: date.toLocaleDateString("en-US", {
          month: "short",
        }),
      });
    }

    return result;
  }, []);

  const doctorName = doctor
    ? `Dr. ${doctor.firstName} ${doctor.lastName}`
    : "";

  const initials = doctor
    ? `${doctor.firstName?.charAt(0) || ""}${doctor.lastName?.charAt(0) || ""}`
    : "";

  const specialization = doctor?.specialization || "General Physician";

  const location = doctor?.location || "Location not available";

  const consultationLabel =
    consultationType === "online" ? "Online" : "In-person";

  const formatSelectedDate = (format = "long") => {
    if (!selectedDate) {
      return "Not selected";
    }

    return new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
      "en-US",
      format === "long"
        ? {
            weekday: "long",
            month: "long",
            day: "numeric",
          }
        : {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
    );
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      setSubmitError("Please select an appointment date and time.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const response = await api.post("/appointments", {
        doctorId,
        consultationType,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason,
      });

      setCreatedAppointment(response.data.appointment);
      setConfirmed(true);
    } catch (error) {
      console.error("Create appointment error:", error);

      setSubmitError(
        error.response?.data?.message ||
          "Unable to create the appointment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
          <div className="text-center">
            <Loader2
              size={38}
              className="mx-auto animate-spin text-cyan-600"
            />
            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading doctor details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (doctorError || !doctor) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Doctor not found
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {doctorError || "We couldn't find the doctor you selected."}
          </p>

          <Link
            to="/doctors"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 size={42} />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-cyan-600">
              Booking Confirmed
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Appointment request created
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500">
              Your appointment has been successfully submitted to
              MediConnect AI.
            </p>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-left">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-100 font-bold text-cyan-700">
                  {initials}
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">{doctorName}</h2>

                  <p className="mt-1 text-sm text-cyan-700">
                    {specialization}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatSelectedDate("long")}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs text-slate-400">Time</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedTime}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs text-slate-400">Consultation</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {consultationLabel}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-green-600">
                    {createdAppointment?.status || "pending"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/patient/appointments"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-600 px-6 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                View My Appointments
              </Link>

              <Link
                to="/doctors"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Find Another Doctor
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6 lg:px-8">
          <Link
            to={`/doctors/${doctorId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-cyan-600"
          >
            <ArrowLeft size={17} />
            Back to Doctor Profile
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
            Appointment Booking
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Book your consultation
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Choose your preferred consultation type, date, and available
            time.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-lg font-bold text-cyan-700">
                  {initials}
                </div>

                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {doctorName}
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-sm text-cyan-700">
                    <Stethoscope size={15} />
                    {specialization}
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={14} />
                    {location}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Video size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Consultation Type
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Select how you want to consult the doctor.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { value: "online", label: "Online" },
                  { value: "in-person", label: "In-person" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setConsultationType(type.value)}
                    className={`rounded-xl border p-4 text-left transition ${
                      consultationType === type.value
                        ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100"
                        : "border-slate-200 bg-white hover:border-cyan-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {type.label} Consultation
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {type.value === "online"
                            ? "Video consultation"
                            : "Visit the doctor's clinic"}
                        </p>
                      </div>

                      {consultationType === type.value && (
                        <CheckCircle2
                          size={20}
                          className="text-cyan-600"
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Select Date
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Choose a convenient date for your appointment.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
                {dates.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedDate(item.value)}
                    className={`rounded-xl border px-2 py-4 text-center transition ${
                      selectedDate === item.value
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200"
                    }`}
                  >
                    <p className="text-xs font-medium">{item.day}</p>

                    <p className="mt-1 text-lg font-bold">{item.date}</p>

                    <p className="text-xs">{item.month}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Clock3 size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Select Time
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Available consultation slots.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`min-h-11 rounded-xl border text-sm font-semibold transition ${
                      selectedTime === time
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-900">
                Reason for Consultation
                <span className="ml-1 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </h2>

              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={5}
                placeholder="Briefly describe the reason for your appointment..."
                className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Appointment Summary
              </h2>

              <div className="mt-5 flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 font-bold text-cyan-700">
                  {initials}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {doctorName}
                  </p>

                  <p className="mt-1 text-xs text-cyan-700">
                    {specialization}
                  </p>
                </div>
              </div>

              <div className="space-y-4 py-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Consultation
                  </span>

                  <span className="text-right text-sm font-semibold text-slate-800">
                    {consultationLabel}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-slate-500">Date</span>

                  <span className="text-right text-sm font-semibold text-slate-800">
                    {formatSelectedDate("short")}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-slate-500">Time</span>

                  <span className="text-right text-sm font-semibold text-slate-800">
                    {selectedTime || "Not selected"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-slate-500">Location</span>

                  <span className="text-right text-sm font-semibold text-slate-800">
                    {consultationType === "online"
                      ? "Video Consultation"
                      : location}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Consultation Fee
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    Fee not available
                  </span>
                </div>
              </div>

              {submitError && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />

                  <p>{submitError}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                disabled={
                  !selectedDate || !selectedTime || submitting
                }
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Appointment...
                  </>
                ) : (
                  <>
                    <CalendarDays size={18} />
                    Confirm Appointment
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Your appointment will be saved to your MediConnect AI
                account.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default BookAppointment;