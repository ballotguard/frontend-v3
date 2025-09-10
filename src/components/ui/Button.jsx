"use client";
export function Button({ children, className = "", variant = "primary", size = "md", ...props }) {
  const base = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-[#4E74A9]/50";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm", 
    lg: "px-6 py-3 text-base",
  };
  
  const styles = {
    // Enhanced with subtle hover effects: soft shadows, gentle scaling, and refined color transitions
    primary: "bg-neutral-950 text-white hover:bg-neutral-800 hover:shadow-md hover:shadow-neutral-900/20 hover:scale-[1.02] active:bg-neutral-900 active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:hover:shadow-md dark:hover:shadow-neutral-700/30 dark:active:bg-neutral-200",
    secondary: "bg-neutral-800 text-white hover:bg-neutral-700 hover:shadow-md hover:shadow-neutral-800/25 hover:scale-[1.02] active:bg-neutral-750 active:scale-[0.98] dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-100 dark:hover:shadow-md dark:hover:shadow-neutral-600/20 dark:active:bg-neutral-300",
    danger: "bg-red-600 text-white hover:bg-red-500 hover:shadow-md hover:shadow-red-500/30 hover:scale-[1.02] active:bg-red-700 active:scale-[0.98] dark:bg-red-500 dark:hover:bg-red-400 dark:hover:shadow-md dark:hover:shadow-red-400/25 dark:active:bg-red-600",
    ghost: "bg-transparent hover:bg-neutral-100 hover:shadow-sm hover:shadow-neutral-900/10 hover:scale-[1.01] active:bg-neutral-150 active:scale-[0.99] dark:hover:bg-neutral-800 dark:hover:shadow-sm dark:hover:shadow-neutral-700/20 dark:active:bg-neutral-750 text-neutral-700 dark:text-neutral-300",
  };
  
  return (
    <button className={`${base} ${sizes[size]} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
