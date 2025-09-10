export function Spinner({ size = 16, className = "" }) {
  const s = typeof size === "number" ? `${size}px` : size;
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-800 dark:border-t-white ${className}`}
      style={{ width: s, height: s }}
      aria-label="loading"
    />
  );
}
