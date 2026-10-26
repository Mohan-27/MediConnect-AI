import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HeartPulse } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import api from "../../services/api";
import { setCredentials } from "../../store/authSlice";

import getDashboardPath from "../../utils/roleRedirect";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        dispatch(
          setCredentials({
            token,
            user,
            rememberMe,
          })
        );

        navigate(getDashboardPath(user.role));
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to login. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-5 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">

          <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500">
                  <HeartPulse size={24} />
                </div>

                <div>
                  <p className="text-lg font-bold">
                    MediConnect AI
                  </p>

                  <p className="text-xs tracking-widest text-slate-400">
                    CONNECTED HEALTHCARE
                  </p>
                </div>
              </div>

              <div className="mt-20 max-w-md">
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                  Welcome back
                </p>

                <h1 className="mt-5 text-4xl font-bold leading-tight xl:text-5xl">
                  Healthcare that connects around you.
                </h1>

                <p className="mt-6 text-base leading-7 text-slate-400">
                  Access doctors, hospitals, laboratories,
                  pharmacies and intelligent healthcare services
                  from one connected platform.
                </p>
              </div>
            </div>

            <div className="mt-12 border-t border-slate-800 pt-6">
              <p className="text-sm text-slate-500">
                Secure healthcare access powered by MediConnect AI.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">

              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <HeartPulse size={21} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    MediConnect AI
                  </p>

                  <p className="text-[10px] tracking-widest text-slate-400">
                    CONNECTED HEALTHCARE
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to continue to your MediConnect account.
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-600">
                    {error}
                  </p>
                </div>
              )}

              <form
                className="mt-8 space-y-5"
                onSubmit={handleSubmit}
              >
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <div className="flex items-center justify-between gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />

                    <span className="text-sm text-slate-600">
                      Remember me
                    </span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  New to MediConnect AI?
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Create an account to connect with healthcare
                  services.
                </p>

                <Link
                  to="/register"
                  className="mt-3 inline-block text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                >
                  Create your account →
                </Link>
              </div>

              <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                By continuing, you agree to our{" "}
                <Link
                  to="/terms"
                  className="text-slate-600 hover:text-cyan-600"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-slate-600 hover:text-cyan-600"
                >
                  Privacy Policy
                </Link>
                .
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;