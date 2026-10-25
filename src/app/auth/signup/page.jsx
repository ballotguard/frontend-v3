"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useNotifications } from "../../../context/NotificationContext";
import { GoogleSignInButton } from "../../../components/ui/GoogleSignInButton";
import { Logo } from "../../../components/Logo";

export default function SignupPage() {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { notifyError, notifySuccess } = useNotifications();

  async function onGoogleSuccess(idToken) {
    setLoading(true);
    try {
      const data = await googleLogin(idToken);
      notifySuccess(data?.message || "Account created and signed in!");
      router.replace("/dashboard");
    } catch (err) {
      notifyError(err?.data?.message || err?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  function onGoogleError(err) {
    notifyError(err?.message || "Google sign-in failed. Please try again.");
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-sm rounded-lg border border-hairline bg-canvas text-ink p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto mb-4">
            <Logo size={56} href="/" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-ink">
            Create an Account
          </h1>
          <p className="text-xs text-ink-mute">
            Join Ballotguard with one-click Google verification
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <GoogleSignInButton
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            loading={loading}
          />

          <div className="relative flex items-center gap-3 pt-2">
            <div className="flex-1 border-t border-hairline" />
            <span className="text-[11px] text-ink-faint uppercase tracking-wider">No password needed</span>
            <div className="flex-1 border-t border-hairline" />
          </div>

          <p className="text-center text-[11px] text-ink-mute leading-relaxed">
            Your Google profile securely initializes your voter and administrator credentials without password vulnerability.
          </p>
        </div>

        <div className="text-center text-xs text-ink-mute border-t border-hairline pt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
