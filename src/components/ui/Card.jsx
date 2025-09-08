export function Card({ children, className = "" }) {
  return (
    <div className={`border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-sm shadow-sm ${className}`}>
      {children}
    </div>
  );
}
