"use client";
import Link from "next/link";
import { Button } from "../components/ui/Button";
import { useEffect } from "react";

function AlertTriangleIcon({ className = "w-16 h-16" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function BallotIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M8 12h8M8 16h5" />
      <path d="M7 8l4-5h6l-4 5H7z" />
    </svg>
  );
}

function LockIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="10" width="18" height="11" rx="2" />
      <path d="M7 10V7a5 5 0 0 1 10 0v3" />
    </svg>
  );
}

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
      {/* Animated error with voting theme */}
      <div className="relative">
        <div className="text-6xl sm:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-300 opacity-20">
          ERROR
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <AlertTriangleIcon className="w-16 h-16 text-red-400 dark:text-red-500" />
            <div className="absolute -top-2 -right-2">
              <LockIcon className="w-6 h-6 text-red-600 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
          Something Went Wrong
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
          Sorry, an unexpected error occurred. Our voting system encountered an issue while processing your request.
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
          Like a corrupted ballot in an election, something went wrong with this page.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button onClick={reset} variant="ghost" size="lg">
          🔄 Try Again
        </Button>
        <Button onClick={() => window.history.back()} variant="ghost" size="lg">
          ← Go Back
        </Button>
        <Link href="/">
          <Button size="lg" className="bg-gradient-to-r from-[#4E74A9] via-[#6B8FBD] to-[#9DB7DF] text-white hover:opacity-90 border-0">
            <BallotIcon className="w-4 h-4 mr-2" />
            Return to Ballotguard
          </Button>
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="flex space-x-2 pt-8">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}
