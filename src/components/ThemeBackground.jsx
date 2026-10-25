"use client";
import { useTheme } from "../context/ThemeContext";

export function ThemeBackground({ children }) {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen w-full transition-colors duration-200 ${
      theme === "dark" 
        ? "bg-primary-deep text-white dark" 
        : "bg-canvas text-ink"
    }`}>
      {children}
    </div>
  );
}
