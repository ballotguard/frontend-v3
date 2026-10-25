"use client";

export function Button({ 
  children, 
  className = "", 
  variant = "primary", 
  size = "md", 
  ...props 
}) {
  const base = "inline-flex items-center justify-center font-semibold focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98]";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-5 py-2.5 text-sm rounded-md", 
    lg: "px-6 py-3 text-base rounded-md",
    pill: "px-6 py-3 text-sm rounded-full",
  };
  
  const styles = {
    // Primary Indigo Navy (standard body CTA)
    primary: "bg-primary text-white hover:bg-primary-deep shadow-sm hover:shadow",
    
    // Hero pale violet pill button
    "on-dark-pill": "bg-surface-violet-soft text-primary hover:bg-opacity-90 shadow-sm font-semibold",
    
    // Closing teal band white button
    "on-teal": "bg-canvas text-surface-teal-deep hover:bg-canvas-soft shadow-sm font-semibold",
    
    // Outline alternative on white
    secondary: "bg-canvas text-ink border border-hairline hover:bg-canvas-soft",
    
    // Ghost
    ghost: "bg-transparent text-ink-mute hover:text-ink hover:bg-black/5 dark:hover:bg-white/10",
    
    // Danger
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  };
  
  const selectedSize = variant === "on-dark-pill" ? sizes.pill : sizes[size] || sizes.md;
  const selectedStyle = styles[variant] || styles.primary;

  return (
    <button className={`${base} ${selectedSize} ${selectedStyle} ${className}`} {...props}>
      {children}
    </button>
  );
}
