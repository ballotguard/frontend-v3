"use client";
import Link from "next/link";
import { Button } from "../components/ui/Button";
import { useEffect } from "react";

function BallotIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M8 12h8M8 16h5" />
      <path d="M7 8l4-5h6l-4 5H7z" />
    </svg>
  );
}

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border-[0.5px] border-black dark:border-white bg-white/50 dark:bg-neutral-900/30 backdrop-blur-2xl shadow-sm p-6 sm:p-7 relative overflow-hidden text-black dark:text-white text-center">
        {/* subtle background accents (neutral) */}
        <div className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 bg-white/20 dark:bg-white/10 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 bg-black/10 dark:bg-white/10 blur-3xl rounded-full" />

        <h1 className="text-2xl sm:text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-neutral-700 dark:text-neutral-300">
          An unexpected error occurred while processing your request.
        </p>
        <p className="text-sm mt-1 text-neutral-500 dark:text-neutral-400">
          Please try again or return to the home page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
          <Button onClick={reset} variant="ghost" size="lg">Try again</Button>
          <Button onClick={() => window.history.back()} variant="ghost" size="lg">Go back</Button>
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-[#4E74A9] via-[#6B8FBD] to-[#9DB7DF] text-white hover:opacity-90 border-0">
              <BallotIcon className="w-4 h-4 mr-2" />
              Return to Ballotguard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
