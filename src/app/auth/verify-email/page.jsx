"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    setError(""); setMessage("");
    try {
      const res = await api.sendEmailVerification();
      setMessage(res.message || "Code sent");
    } catch (e) {
      setError(e?.data?.message || e.message);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      const res = await api.verifyEmailCode({ verificationCode: code });
      setMessage(res.message || "Verified");
      router.replace("/dashboard");
    } catch (e) {
      setError(e?.data?.message || e.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200/70 dark:border-neutral-700/60 bg-white dark:bg-neutral-900/40 backdrop-blur-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">Verify your email</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Enter the 6-digit code we sent to your email</p>
        </div>
        {message && <Alert type="success" message={message} className="mb-4"/>}
        {error && <Alert type="error" message={error} className="mb-4"/>}
        <div className="flex gap-2 mb-4">
          <Button onClick={sendCode}>Send code</Button>
        </div>
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
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Verifying..." : "Verify"}</Button>
        </form>
      </div>
    </div>
  );
}
