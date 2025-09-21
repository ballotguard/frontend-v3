"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { BrandedLoader } from "@/components/BrandedLoader";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [theme, setTheme] = useState("dark"); // default dark per spec
  const [ready, setReady] = useState(false);
  const prevAuth = useRef(false);

  // Initialize theme:
  // 1) If localStorage has theme, use it.
  // 2) If empty and user is logged in, fetch from API and store to localStorage.
  // 3) If not logged in and localStorage empty, keep default "dark".
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved) {
      setTheme(saved);
      setReady(true);
      return; // respect local choice
    }
    if (authLoading) return; // wait until we know auth state
    (async () => {
      if (isAuthenticated) {
        try {
          const res = await api.getUserSettings();
          const pref = (res?.userSettings?.preferredTheme || res?.preferredTheme || "dark").toString().toLowerCase();
          const normalized = pref === "dark" || pref === "light" ? pref : "dark";
          setTheme(normalized);
          localStorage.setItem("theme", normalized);
        } catch {
          setTheme("dark");
          localStorage.setItem("theme", "dark");
        } finally {
          setReady(true);
        }
      } else {
        setTheme("dark");
        localStorage.setItem("theme", "dark");
        setReady(true);
      }
    })();
  }, [authLoading, isAuthenticated]);

  // Apply theme to document and persist to localStorage on change (always).
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = useMemo(() => {
    return async () => {
      const next = theme === "light" ? "dark" : "light";
      setTheme(next);
      // Persist locally immediately
      try { localStorage.setItem("theme", next); } catch {}
      // If authenticated, update user theme using dedicated endpoint
      if (isAuthenticated) {
        try {
          await api.updateUserTheme({ preferredTheme: next === "dark" ? "Dark" : "Light" });
        } catch {
          // ignore API errors for theme persistence
        }
      }
    };
  }, [theme, isAuthenticated]);

  // When user logs in, fetch their theme preference and apply it (override localStorage as per spec)
  useEffect(() => {
    if (authLoading) return;
    const wasAuth = prevAuth.current;
    prevAuth.current = isAuthenticated;
    if (!wasAuth && isAuthenticated) {
      (async () => {
        try {
          const res = await api.getUserSettings();
          const pref = (res?.userSettings?.preferredTheme || res?.preferredTheme || "dark").toString().toLowerCase();
          const normalized = pref === "dark" || pref === "light" ? pref : "dark";
          setTheme(normalized);
          localStorage.setItem("theme", normalized);
        } catch {
          // ignore; keep current theme
        }
      })();
    }
  }, [authLoading, isAuthenticated]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
  {!ready && <BrandedLoader />}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
