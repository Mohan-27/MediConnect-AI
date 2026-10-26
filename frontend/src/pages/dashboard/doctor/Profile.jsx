import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Languages,
  ShieldCheck,
  Save,
  RefreshCw,
} from "lucide-react";

import api from "../../../services/api";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    preferredLanguage: "english",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctors/profile");

      const doctor = response.data.doctor;

      setProfile(doctor);

      setFormData({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        phone: doctor.phone || "",
        preferredLanguage:
          doctor.preferredLanguage || "english",
      });
    } catch (error) {
      console.error("Fetch doctor profile error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.patch(
        "/doctors/profile",
        formData
      );

      const updatedDoctor = response.data.doctor;

      setProfile((current) => ({
        ...current,
        ...updatedDoctor,
      }));

      setFormData({
        firstName: updatedDoctor.firstName || "",
        lastName: updatedDoctor.lastName || "",
        phone: updatedDoctor.phone || "",
        preferredLanguage:
          updatedDoctor.preferredLanguage || "english",
      });

      setSuccess(
        response.data.message ||
          "Profile updated successfully."
      );
    } catch (error) {
      console.error("Update doctor profile error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <RefreshCw
            size={20}
            className="animate-spin text-cyan-600"
          />
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error || "Doctor profile could not be loaded."}
      </div>
    );
  }

  const initials =
    `${profile.firstName?.charAt(0) || ""}${
      profile.lastName?.charAt(0) || ""
    }`.toUpperCase() || "DR";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
          Doctor Portal
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Profile Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-100 text-2xl font-bold text-cyan-700">
              {initials}
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Dr. {profile.firstName} {profile.lastName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Doctor
            </p>

            <div className="mt-5 w-full space-y-3 text-left">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Mail
                  size={17}
                  className="text-cyan-600"
                />

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">
                    Email
                  </p>

                  <p className="truncate text-sm font-medium text-slate-700">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <ShieldCheck
                  size={17}
                  className="text-emerald-600"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Account Role
                  </p>

                  <p className="text-sm font-medium capitalize text-slate-700">
                    {profile.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <ShieldCheck
                  size={17}
                  className="text-emerald-600"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Account Status
                  </p>

                  <p className="text-sm font-medium text-emerald-600">
                    {profile.isActive
                      ? "Active"
                      : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-200 pb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the information associated with your doctor
              account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                icon={UserRound}
              />

              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                icon={UserRound}
              />
            </div>

            <Input
              label="Email Address"
              value={profile.email || ""}
              disabled
              icon={Mail}
            />

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              icon={Phone}
            />

            <Select
              label="Preferred Language"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              icon={Languages}
              options={[
                {
                  value: "english",
                  label: "English",
                },
                {
                  value: "telugu",
                  label: "Telugu",
                },
                {
                  value: "hindi",
                  label: "Hindi",
                },
              ]}
            />

            <div className="flex justify-end border-t border-slate-200 pt-6">
              <Button
                type="submit"
                loading={saving}
              >
                <Save size={17} />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;