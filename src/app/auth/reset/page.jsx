"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../../lib/api";
import { Button } from "../../../components/ui/Button";
import { useNotifications } from "../../../context/NotificationContext";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [verificationCode, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { notifyError, notifySuccess } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Get email from URL parameters
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.verifyAndReset({ email, verificationCode, newPassword });
      notifySuccess(res.message || "Password reset");
      router.replace("/auth/login");
    } catch (e) {
      notifyError(e?.data?.message || e.message || "Reset failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200/70 dark:border-neutral-700/60 bg-white dark:bg-neutral-900/40 backdrop-blur-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">Reset password</h1>
          {email ? (
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              Enter the code sent to <span className="font-medium text-neutral-800 dark:text-neutral-200">{email}</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Enter the code and your new password</p>
          )}
        </div>
  {/* Notifications handled globally */}
        <form onSubmit={onSubmit} className="space-y-4">
          {!email && (
            <label className="flex flex-col gap-1">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">Email</span>
              <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white bg-white dark:bg-neutral-900/30">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500" />
              </div>
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Verification code</span>
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white bg-white dark:bg-neutral-900/30">
              <input value={verificationCode} onChange={(e) => setCode(e.target.value)} required className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500" />
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">New password</span>
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white bg-white dark:bg-neutral-900/30">
              <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500" />
              <button type="button" aria-label={showNewPassword ? "Hide password" : "Show password"} onClick={() => setShowNewPassword((v) => !v)} className="px-2 h-full flex items-center bg-transparent focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-neutral-500 dark:text-neutral-400">
                  {!showNewPassword ? (
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
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Resetting..." : "Reset password"}</Button>
        </form>
      </div>
    </div>
  );
}
