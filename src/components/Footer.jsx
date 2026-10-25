"use client";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="w-full bg-canvas border-t border-hairline py-12 px-6 sm:px-12 mt-auto transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Logo size={22} href="/" />
            <span className="font-semibold text-sm tracking-tight text-ink">
              Ballotguard
            </span>
          </div>
          <p className="text-xs text-ink-mute mt-1 max-w-sm">
            Cryptographically verified election platform built for high-stakes governance and transparency.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-xs text-ink-mute">
          <a href="mailto:ballotguard@gmail.com" className="hover:text-ink transition-colors">
            ballotguard@gmail.com
          </a>
          <a href="https://github.com/ballotguard" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">
            GitHub
          </a>
          <span>© {new Date().getFullYear()} Ballotguard</span>
        </div>
      </div>
    </footer>
  );
}
