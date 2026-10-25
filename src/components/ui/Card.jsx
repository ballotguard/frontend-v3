export function Card({ 
  children, 
  variant = "default", 
  className = "" 
}) {
  const variants = {
    default: "bg-canvas border border-hairline text-ink",
    soft: "bg-canvas-soft border border-hairline text-ink",
    featured: "bg-primary border border-hairline-dark text-white",
    teal: "bg-surface-teal-deep text-white",
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <div className={`rounded-lg p-6 shadow-sm transition-all ${selectedVariant} ${className}`}>
      {children}
    </div>
  );
}
