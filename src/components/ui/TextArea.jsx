"use client";
export function TextArea({ label, error, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      {label && <span className="text-sm text-inherit opacity-80">{label}</span>}
      <textarea
        className="rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white min-h-24 border-[0.5px] border-black/30 dark:border-white/30 bg-white dark:bg-neutral-900/30 text-inherit placeholder:text-neutral-500 dark:placeholder:text-neutral-400 disabled:opacity-60 disabled:cursor-not-allowed"
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
