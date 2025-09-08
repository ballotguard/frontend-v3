export function Spinner({ size = 16 }) {
  const s = typeof size === "number" ? `${size}px` : size;
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800"
      style={{ width: s, height: s }}
      aria-label="loading"
    />
  );
}
