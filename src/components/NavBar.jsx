"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Logo } from "./Logo";

function SunIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
    </svg>
  );
}

export function NavBar() {
  const { isAuthenticated, logout, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isDarkCanvas = isHome || theme === "dark";

  const navCls = `text-sm font-semibold transition-opacity duration-150 hover:opacity-70 cursor-pointer ${
    isDarkCanvas ? "text-white/90" : "text-ink"
  }`;

  return (
    <div className={`${isHome ? "absolute" : "fixed"} top-5 left-6 sm:left-10 z-50 flex items-center gap-5`}>
      {/* Brand logo */}
      <Logo size={30} href="/" />

      {/* Theme toggle — hidden on landing page (always dark there) */}
      {!isHome && (
        <button
          onClick={toggleTheme}
          className={`transition-opacity hover:opacity-70 ${isDarkCanvas ? "text-white/90" : "text-ink"}`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
      )}

      {authLoading ? (
        <div className="h-4 w-16 rounded bg-white/10 animate-pulse" aria-hidden />
      ) : isAuthenticated ? (
        <>
          <Link href="/dashboard" className={navCls}>Dashboard</Link>
          <Link href="/user/settings" className={navCls}>Settings</Link>
          <button onClick={logout} className={navCls}>Sign out</button>
        </>
      ) : (
        <>
          <Link href="/auth/login" className={navCls}>Sign in</Link>
          <Link href="/auth/login" className={`text-sm font-bold transition-opacity hover:opacity-70 ${isDarkCanvas ? "text-surface-violet-soft" : "text-primary"}`}>
            Get Started
          </Link>
        </>
      )}
    </div>
  );
}
