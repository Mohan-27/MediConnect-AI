import { useState } from "react";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  Save,
} from "lucide-react";

import api from "../../../services/api";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

function Settings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all password fields.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters long."
      );
      return;
    }

    if (
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(
        "/doctors/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );

      setSuccess(
        response.data.message ||
          "Password changed successfully."
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(
        "Change doctor password error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
          Doctor Portal
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your account security and password.
        </p>
      </div>

      {/* Security Information */}
      <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Account Security
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Use a strong password and never share your
              account credentials with anyone.
            </p>
          </div>
        </div>
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

      {/* Change Password */}
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <LockKeyhole size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Change Password
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update your doctor account password.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <Input
            label="Current Password"
            name="currentPassword"
            type={showCurrent ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            required
            icon={LockKeyhole}
            rightIcon={
              showCurrent ? EyeOff : Eye
            }
            onRightIconClick={() =>
              setShowCurrent((current) => !current)
            }
          />

          <Input
            label="New Password"
            name="newPassword"
            type={showNew ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            required
            icon={LockKeyhole}
            rightIcon={showNew ? EyeOff : Eye}
            onRightIconClick={() =>
              setShowNew((current) => !current)
            }
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
            icon={LockKeyhole}
            rightIcon={
              showConfirm ? EyeOff : Eye
            }
            onRightIconClick={() =>
              setShowConfirm((current) => !current)
            }
          />

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password Requirements
            </p>

            <ul className="mt-2 space-y-1 text-sm text-slate-500">
              <li>• At least 6 characters</li>
              <li>• Must be different from your current password</li>
              <li>• Confirm the new password correctly</li>
            </ul>
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-5">
            <Button
              type="submit"
              loading={saving}
            >
              <Save size={17} />
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;