"use client";

export function Input({ label, error, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-xs font-medium text-ink-mute">{label}</span>}
      <input
        className="rounded-sm px-3.5 py-2.5 text-sm bg-canvas text-ink border border-hairline focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-ink-faint transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </label>
  );
}
