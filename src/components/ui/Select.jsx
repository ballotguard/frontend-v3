"use client";
export function Select({ label, error, children, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      {label && <span className="text-sm text-inherit opacity-80">{label}</span>}
      <select
        className="rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white border-[0.5px] border-black/30 dark:border-white/30 bg-white dark:bg-neutral-900/30 text-inherit disabled:opacity-60 disabled:cursor-not-allowed"
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
