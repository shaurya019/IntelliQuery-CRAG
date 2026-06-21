import { useState } from "react";
import { useSelector } from "react-redux";
import { Bot, Lock, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  useHealthCheck,
  useRegisterMutation
} from "../hooks/useAuthMutations.js";
import { selectIsAuthenticated } from "../features/auth/authSlice.js";
import Spinner from "../components/ui/Spinner.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const healthQuery = useHealthCheck();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [formError, setFormError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        full_name: form.full_name,
        email: form.email,
        password: form.password
      });
      navigate("/", { replace: true });
    } catch {
      // TanStack Query exposes the error through registerMutation.error.
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 flex items-center justify-center">
      <section className="w-full max-w-6xl grid grid-cols-1 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 p-10 text-white lg:flex">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-16 right-0 h-72 w-72 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-cyan-200 blur-3xl" />
          </div>

          <div className="relative">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Bot size={26} />
            </div>

            <h1 className="max-w-md text-4xl font-extrabold leading-tight">
              Create your workspace for secure document intelligence.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-cyan-50">
              Register once, upload private knowledge, and use CRAG-powered retrieval,
              verification, and answer generation from a single workspace.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-4">
            <FeatureCard
              icon={<ShieldCheck size={18} />}
              title="Protected Access"
              description="Accounts are registered through the FastAPI auth endpoints."
            />
            <FeatureCard
              icon={<Sparkles size={18} />}
              title="Knowledge Workspace"
              description="Sessions, documents, and chat history can now come from your backend."
            />
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">
                IntelliQuery <span className="text-blue-600">CRAG</span>
              </h2>
              <p className="text-sm text-slate-500">Create your account</p>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-950">
              Register
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Start with your name, email, and a secure password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field
              icon={<UserRound size={18} className="text-slate-400" />}
              label="Full name"
            >
              <input
                type="text"
                value={form.full_name}
                onChange={(event) => setForm({ ...form, full_name: event.target.value })}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Shaurya Singh"
              />
            </Field>

            <Field
              icon={<Mail size={18} className="text-slate-400" />}
              label="Email address"
            >
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="shaurya@example.com"
              />
            </Field>

            <Field
              icon={<Lock size={18} className="text-slate-400" />}
              label="Password"
            >
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Create a strong password"
              />
            </Field>

            <Field
              icon={<Lock size={18} className="text-slate-400" />}
              label="Confirm password"
            >
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Repeat your password"
              />
            </Field>

            {formError ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {formError}
              </p>
            ) : null}

            {registerMutation.error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {registerMutation.error.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {registerMutation.isPending ? <Spinner className="h-4 w-4" /> : null}
              Create account
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-500">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
            <p
              className={`font-semibold ${
                healthQuery.isError ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {healthQuery.isError ? "Backend unavailable" : "Backend connected"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ icon, label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
        {icon}
        {children}
      </div>
    </label>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold">
        {icon}
        {title}
      </div>
      <p className="text-xs leading-5 text-cyan-50">{description}</p>
    </div>
  );
}
