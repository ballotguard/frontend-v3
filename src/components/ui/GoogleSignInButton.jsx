"use client";
import { GoogleLogin } from "@react-oauth/google";

/**
 * Renders Google's official sign-in button via @react-oauth/google.
 * The credential returned in onSuccess is a Google ID token (JWT).
 * Pass it to the backend at /api/v1/auth/google for verification.
 */
export function GoogleSignInButton({ onSuccess, onError, loading = false }) {
  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse?.credential) {
            onSuccess?.(credentialResponse.credential);
          } else {
            onError?.(new Error("No credential received from Google"));
          }
        }}
        onError={() => {
          onError?.(new Error("Google Sign-In failed"));
        }}
        theme="outline"
        size="large"
        width="100%"
        shape="rectangular"
        text="continue_with"
        useOneTap={false}
      />
      {loading && (
        <div className="flex items-center justify-center gap-2 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Signing in...
        </div>
      )}
    </div>
  );
}
