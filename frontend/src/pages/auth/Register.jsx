import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  UserRound,
  Stethoscope,
  Building2,
  FlaskConical,
  Pill,
} from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "patient",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = [
    { value: "patient", label: "Patient", icon: UserRound },
    { value: "doctor", label: "Doctor", icon: Stethoscope },
    { value: "hospital", label: "Hospital", icon: Building2 },
    { value: "laboratory", label: "Laboratory", icon: FlaskConical },
    { value: "pharmacy", label: "Pharmacy", icon: Pill },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        preferredLanguage: formData.language || "english",
      });

      if (response.data.success) {
        setSuccess("Account created successfully.");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to create your account. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

            {/* Left Panel */}
            <div className="bg-slate-950 p-8 text-white sm:p-10 lg:p-12">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500">
                  <HeartPulse size={24} />
                </div>

                <div>
                  <p className="font-bold">MediConnect AI</p>
                  <p className="text-[10px] tracking-widest text-slate-400">
                    CONNECTED HEALTHCARE
                  </p>
                </div>
              </div>

              <div className="mt-14">
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                  Join the platform
                </p>

                <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                  One account.
                  <br />
                  Connected healthcare.
                </h1>

                <p className="mt-6 text-sm leading-7 text-slate-400">
                  Create your MediConnect AI account and access healthcare
                  services through one connected digital ecosystem.
                </p>
              </div>

              <div className="mt-10 space-y-4">
                {[
                  "Connect with healthcare providers",
                  "Manage appointments and services",
                  "Access intelligent healthcare tools",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <div className="h-2 w-2 rounded-full bg-cyan-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Panel */}
            <div className="p-6 sm:p-10 lg:p-12">
              <div className="mx-auto max-w-xl">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Enter your information to get started.
                </p>

                {/* Error */}
                {error && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-600">
                      {error}
                    </p>
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-600">
                      {success}
                    </p>
                  </div>
                )}

                <form
                  className="mt-8 space-y-5"
                  onSubmit={handleSubmit}
                >
                  {/* Role */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      I am registering as
                    </label>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {roles.map((role) => {
                        const Icon = role.icon;

                        const selected =
                          formData.role === role.value;

                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() =>
                              setFormData((previous) => ({
                                ...previous,
                                role: role.value,
                              }))
                            }
                            className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border px-3 text-center transition ${
                              selected
                                ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100"
                                : "border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50"
                            }`}
                          >
                            <Icon
                              size={21}
                              className="text-cyan-600"
                            />

                            <span className="text-xs font-semibold text-slate-700">
                              {role.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      name="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Last Name"
                      name="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  {/* Phone */}
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                  {/* Language */}
                  <Select
                    label="Preferred Language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="Select your language"
                    required
                    options={[
                      { value: "english", label: "English" },
                      { value: "telugu", label: "Telugu" },
                      { value: "hindi", label: "Hindi" },
                    ]}
                  />

                  {/* Password */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Terms */}
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(event) =>
                        setAgreeTerms(event.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />

                    <span className="text-xs leading-5 text-slate-500">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="font-semibold text-slate-700 hover:text-cyan-600"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="font-semibold text-slate-700 hover:text-cyan-600"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <p className="mt-7 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-cyan-600 hover:text-cyan-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;