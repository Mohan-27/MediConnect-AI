import { useSelector } from "react-redux";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
            MediConnect AI
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Welcome, {user?.firstName || "User"}!
          </h1>

          <p className="mt-3 text-slate-500">
            You are successfully authenticated.
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Account Role
            </p>

            <p className="mt-1 text-lg font-semibold capitalize text-slate-900">
              {user?.role || "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;