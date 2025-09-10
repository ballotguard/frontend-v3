"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import { ColorfulButton } from "./ui/ColorfulButton";

// Reusable auth-aware buttons for hero / CTA sections.
export function HeroAuthButtons({ variant = "hero" }) {
  const { isAuthenticated, loading } = useAuth();

  // Skeleton while auth state resolves (first paint SSR -> hydrate)
  if (loading) {
    return (
      <div className={variant === "hero" ? "mt-8 flex justify-center gap-4" : ""}>
        <div className="h-12 w-40 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        {variant === "hero" && <div className="h-12 w-36 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />}
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={variant === "hero" ? "mt-8 flex justify-center gap-4" : ""}>
        <Link href="/dashboard">
          <ColorfulButton variant="secondary" width={variant === "hero" ? "180px" : "240px"}>
            Dashboard
          </ColorfulButton>
        </Link>
      </div>
    );
  }

  // Not authenticated states
  if (variant === "hero") {
    return (
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/auth/signup">
          <ColorfulButton variant="secondary" width="160px">Get Started</ColorfulButton>
        </Link>
        <Link href="/auth/login">
          <Button size="lg" className="bg-neutral-800 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-400 min-w-[140px]">Login</Button>
        </Link>
      </div>
    );
  }

  // CTA section default (single large button)
  return (
    <Link href="/auth/signup">
      <ColorfulButton variant="secondary" width="240px">Create Free Account</ColorfulButton>
    </Link>
  );
}
