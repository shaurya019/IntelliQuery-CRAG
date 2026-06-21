import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Bot, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import {
  useHealthCheck,
  useLoginMutation
} from "../hooks/useAuthMutations.js";
import { selectIsAuthenticated } from "../features/auth/authSlice.js";
import Spinner from "../components/ui/Spinner.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const healthQuery = useHealthCheck();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await loginMutation.mutateAsync(form);
      navigate("/", { replace: true });
    } catch {
      // TanStack Query exposes the error through loginMutation.error.
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 flex items-center justify-center">
      <section className="w-full max-w-6xl grid grid-cols-1 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-10 text-white lg:flex">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-cyan-200 blur-3xl" />
          </div>

          <div className="relative">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Bot size={26} />
            </div>

            <h1 className="max-w-md text-4xl font-extrabold leading-tight">
              IntelliQuery CRAG for private document intelligence.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-blue-50">
              Upload private documents, retrieve trusted context, verify relevance,
              correct weak retrieval, and generate source-backed answers.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-4">
            <FeatureCard
              icon={<ShieldCheck size={18} />}
              title="Corrective RAG"
              description="Retrieves, verifies, corrects, and answers with citations."
            />
            <FeatureCard
              icon={<Sparkles size={18} />}
              title="Agentic Workflow"
              description="Ready for LangGraph-style retrieval and tool decisions."
            />
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">
                IntelliQuery <span className="text-violet-500">CRAG</span>
              </h2>
              <p className="text-sm text-slate-500">Corrective RAG for Private Docs</p>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-950">
              Welcome back
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your AI document intelligence workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Email address
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="alex@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Password
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                <Lock size={18} className="text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Enter password"
                />
              </div>
            </label>

            {loginMutation.error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {loginMutation.error.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loginMutation.isPending ? <Spinner className="h-4 w-4" /> : null}
              Sign in
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-500">
            <p>
              New here?{" "}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
                Create an account
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

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold">
        {icon}
        {title}
      </div>
      <p className="text-xs leading-5 text-blue-50">{description}</p>
    </div>
  );
}
