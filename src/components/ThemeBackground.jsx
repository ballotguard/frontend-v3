"use client";
import { useTheme } from "../context/ThemeContext";

export function ThemeBackground({ children }) {
  const { theme } = useTheme();

  if (theme === "dark") {
    return (
  <div className="min-h-screen w-full bg-[#020617] relative overflow-hidden">
        {/* Dark Sphere Grid Background */}
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(33, 73, 185, 0.1) 0%, rgba(129, 140, 243, 0.14) 40%, transparent 80%)
            `,
            backgroundSize: "16px 16px,16px 16px, 100% 100%",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen w-full bg-white relative overflow-hidden">
      {/* White Sphere Grid Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(152, 172, 228, 0.25) 0%, rgba(140, 156, 248, 0.23) 40%, transparent 80%)
          `,
          backgroundSize: "16px 16px, 16px 16px, 100% 100%",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
