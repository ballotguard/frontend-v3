"use client";
export function Button({ children, className = "", variant = "primary", size = "md", ...props }) {
  const base = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm", 
    lg: "px-6 py-3 text-base",
  };
  
  const styles = {
    // Dark mode: white bg with black text; Light mode: black bg with white text
    primary: "bg-black text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-200",
    secondary: "bg-black text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
  };
  
  return (
    <button className={`${base} ${sizes[size]} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
