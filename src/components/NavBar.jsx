"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./ui/Button";

function SunIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
    </svg>
  );
}

export function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const containerStyle = theme === "dark"
    ? {
        backgroundImage: "linear-gradient(90deg, rgba(228,218,253,0.22), rgba(228,218,253,0.10))",
        backgroundColor: "rgba(228,218,253,0.18)",
        backdropFilter: "blur(2px)",
      }
    : {
        backgroundImage: "linear-gradient(90deg, rgba(228,218,253,0.22), rgba(255,255,255,0.10))",
        backgroundColor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(2px)",
      };
  
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(92%,1100px)]">
      <div className="rounded-2xl shadow-lg border border-neutral-200/40 dark:border-neutral-700/40 flex items-center h-14 px-4 justify-between text-neutral-900 dark:text-white" style={containerStyle}>
        <Link href="/" className="font-semibold text-neutral-900 dark:text-white">
          Ballotguard
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-neutral-800 hover:text-neutral-900 dark:text-neutral-100 dark:hover:text-white">
                Dashboard
              </Link>
              <Link href="/settings" className="text-neutral-800 hover:text-neutral-900 dark:text-neutral-100 dark:hover:text-white">
                Profile
              </Link>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={logout}>
                  <span className="inline-flex items-center gap-1">
                    Logout
                    <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="3" width="12" height="18" rx="2" />
                      <path d="M15 12h6" />
                      <path d="M19 8l4 4-4 4" />
                    </svg>
                  </span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
