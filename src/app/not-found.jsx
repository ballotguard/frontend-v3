"use client";
import Link from "next/link";
import { Button } from "../components/ui/Button";
import { ColorfulButton } from "../components/ui/ColorfulButton";

function SearchIcon({ className = "w-16 h-16" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M8 11h6" />
      <path d="M11 8v6" />
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

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
      {/* Animated 404 with voting theme */}
      <div className="relative">
        <div className="text-8xl sm:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#4E74A9] via-[#6B8FBD] to-[#9DB7DF] opacity-20">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute -top-2 -right-2">
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
          Sorry, this page could not be found. It might have been moved, deleted, or the URL might be incorrect.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button onClick={() => window.history.back()} variant="ghost" size="lg">
          ← Go Back
        </Button>
        <Link href="/">
          <ColorfulButton variant="secondary" >
            Return to Ballotguard
          </ColorfulButton>
        </Link>

      </div>

    
    </div>
  );
}
