import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { login, signup } from "../api/auth";

export default function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate();
  const isLogin = mode === "login";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await (isLogin ? login(form) : signup(form));
      onAuth(data);
      navigate("/review");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl items-center px-5 py-12 lg:px-8">
      <div className="grid w-full gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="hidden lg:block">
          <p className="eyebrow">A calmer way to choose</p>
          <h1 className="display max-w-xl">
            Make room for a <em>second thought.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-ink/65">
            We read between the stars, spot the red flags, and help you decide
            with a little more confidence.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="paper-card"
        >
          <div className="mb-8">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-amber text-cream">
              <Sparkles size={21} />
            </div>
            <h1 className="font-serif text-3xl font-semibold">
              {isLogin ? "Welcome back" : "Start thinking clearly"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              {isLogin
                ? "Pick up where you left off."
                : "Create your free account and make your next decision a better one."}
            </p>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-4">
            {!isLogin && (
              <label className="field">
                Your name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Alex Morgan"
                />
              </label>
            )}
            <label className="field">
              Email address
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label className="field">
              Password
              <input
                required
                minLength={6}
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
              />
            </label>
            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              disabled={busy}
              className="button button-dark mt-2 w-full justify-center"
            >
              {busy ? "Working..." : isLogin ? "Log in" : "Create account"}{" "}
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-ink/55">
            {isLogin ? "New here? " : "Already have an account? "}
            <a
              className="font-semibold text-brown underline underline-offset-4"
              href={isLogin ? "/signup" : "/login"}
            >
              {isLogin ? "Create an account" : "Log in"}
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
