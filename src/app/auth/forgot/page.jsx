"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { Button } from "../../../components/ui/Button";
import { useNotifications } from "../../../context/NotificationContext";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { notifyError, notifySuccess } = useNotifications();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.sendResetCode({ email });
      notifySuccess(res.message || "Code sent");
      // Redirect to reset password page with email parameter
      router.push(`/auth/reset?email=${encodeURIComponent(email)}`);
    } catch (e) {
      notifyError(e?.data?.message || e.message || "Failed to send code");
    } finally { setLoading(false); }
  }

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200/70 dark:border-neutral-700/60 bg-white dark:bg-neutral-900/40 backdrop-blur-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">Forgot password</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">We'll send a reset code to your email</p>
        </div>
  {/* Notifications handled globally */}
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Email</span>
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white bg-white dark:bg-neutral-900/30">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
              />
            </div>
          </label>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Sending..." : "Send code"}</Button>
        </form>
        <div className="mt-4 flex items-center justify-between text-xs text-neutral-700 dark:text-neutral-300">
          <span>Have a code?</span>
          <Link href="/auth/reset" className="hover:underline">Reset password</Link>
        </div>
      </div>
    </div>
  );
}
