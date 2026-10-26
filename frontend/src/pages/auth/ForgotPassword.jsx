import { Link } from "react-router-dom";
import { ArrowLeft, HeartPulse, Mail } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function ForgotPassword() {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center justify-center px-5 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-sm">
              <HeartPulse size={28} />
            </div>
          </div>

          <div className="mt-7 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
              MediConnect AI
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Forgot your password?
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Enter the email address associated with your account and we'll
              send you instructions to reset your password.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              required
            />

            <Button type="submit" size="lg" fullWidth>
              Send Reset Link
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-7 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-cyan-600"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>

          {/* Security Note */}
          <div className="mt-8 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
            <p className="text-center text-xs leading-5 text-slate-500">
              For your security, we'll only send password reset instructions
              to the email address registered with your MediConnect AI
              account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;