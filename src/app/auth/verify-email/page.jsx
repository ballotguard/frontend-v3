"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { Button } from "../../../components/ui/Button";
import { useNotifications } from "../../../context/NotificationContext";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const { notifyError, notifySuccess } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const hasSentRef = useRef(false);

  // Automatically send verification email on page load (only once)
  useEffect(() => {
    if (!hasSentRef.current) {
      hasSentRef.current = true;
      sendCode();
    }
  }, []);

  async function sendCode() {
    setSendingCode(true);
    try {
      const res = await api.sendEmailVerification();
      notifySuccess(res.message || "Code sent");
    } catch (e) {
      notifyError(e?.data?.message || e.message || "Failed to send code");
    } finally {
      setSendingCode(false);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.verifyEmailCode({ verificationCode: code });
      notifySuccess(res.message || "Verified");
      router.replace("/dashboard");
    } catch (e) {
      notifyError(e?.data?.message || e.message || "Verification failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200/70 dark:border-neutral-700/60 bg-white dark:bg-neutral-900/40 backdrop-blur-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">Verify your email</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Enter the code we sent to your email</p>
        </div>
  {/* Notifications handled globally */}
       
        <form onSubmit={verify} className="space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Verification code</span>
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white bg-white dark:bg-neutral-900/30">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
              />
            </div>
          </label>
           <div className="flex justify-left mb-4">
          <button 
            onClick={sendCode}
            disabled={sendingCode}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingCode ? "Sending..." : "Send email again?"}
          </button>
        </div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Verifying..." : "Verify"}</Button>
        </form>
      </div>
    </div>
  );
}
