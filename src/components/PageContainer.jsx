"use client";
import { usePathname } from "next/navigation";

export function PageContainer({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <div className="w-full flex-1 flex flex-col">{children}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 flex-1 w-full">
      {children}
    </div>
  );
}
