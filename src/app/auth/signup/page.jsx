"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "../../../components/ui/Button";
import { useNotifications } from "../../../context/NotificationContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { notifyError, notifySuccess } = useNotifications();
  const [showPassword, setShowPassword] = useState(false);

  function update(k, v) { setForm((s) => ({ ...s, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    // clear previous ephemeral errors via notification system
    setLoading(true);
    try {
      await signup(form);
      notifySuccess("Account created. Verify your email.");
      router.replace("/auth/verify-email");
    } catch (err) {
      notifyError(err?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200/70 dark:border-neutral-700/60 bg-white dark:bg-neutral-900/40 backdrop-blur-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">Create account</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Join Ballotguard in seconds</p>
        </div>

  {/* Notifications handled globally */}

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">First name</span>
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white bg-white dark:bg-neutral-900/30">
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                required
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Last name</span>
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white bg-white dark:bg-neutral-900/30">
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                required
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Email</span>
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white bg-white dark:bg-neutral-900/30">
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Password</span>
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white bg-white dark:bg-neutral-900/30">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="px-2 h-full flex items-center bg-transparent focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-neutral-500 dark:text-neutral-400">
                  {!showPassword ? (
                    <>
                      <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
                    </>
                  ) : (
                    <>
                      <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </label>

          <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating..." : "Sign up"}</Button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs text-neutral-700 dark:text-neutral-300">
          <span>Have an account?</span>
          <Link href="/auth/login" className="hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}
