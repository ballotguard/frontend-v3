"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useNotifications } from "../../../context/NotificationContext";
import { GoogleSignInButton } from "../../../components/ui/GoogleSignInButton";
import { Logo } from "../../../components/Logo";

export default function LoginPage() {
  const { googleLogin, isAuthenticated, verifyAndRefreshSession } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { notifyError, notifySuccess } = useNotifications();

  async function onGoogleSuccess(idToken) {
    if (isAuthenticated) {
      const ok = await verifyAndRefreshSession();
      if (ok) {
        notifySuccess("Session active");
        return router.replace("/dashboard");
      }
    }

    setLoading(true);
    try {
      await googleLogin(idToken);
      notifySuccess("Signed in successfully");
      router.replace("/dashboard");
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Google sign-in failed";
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function onGoogleError(err) {
    const msg = err?.message || "Google sign-in failed. Please try again.";
    notifyError(msg);
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center py-20 px-4">
      {/* Editorial Card following DESIGN.md card-feature-light */}
      <div className="w-full max-w-sm rounded-lg border border-hairline bg-canvas text-ink p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          {/* Brand logo */}
          <div className="mx-auto mb-4">
            <Logo size={56} href="/" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-ink">
            Sign in to Ballotguard
          </h1>
          <p className="text-xs text-ink-mute">
            Authenticated via Google Identity Services
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
            <span className="text-[11px] text-ink-faint uppercase tracking-wider">Cryptographic Security</span>
            <div className="flex-1 border-t border-hairline" />
          </div>

          <p className="text-center text-[11px] text-ink-mute leading-relaxed">
            By signing in, your account is provisioned with cryptographic signing keys for creating and managing verifiable ballots.
          </p>
        </div>
      </div>
    </div>
  );
}
