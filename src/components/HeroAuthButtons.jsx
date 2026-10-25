"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";

export function HeroAuthButtons({ variant = "hero" }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-12 w-48 rounded-md bg-white/10" />
    );
  }

  if (isAuthenticated) {
    if (variant === "teal") {
      return (
        <Link href="/dashboard">
          <Button variant="on-teal" size="lg">
            Go to Dashboard →
          </Button>
        </Link>
      );
    }
    return (
      <Link href="/dashboard">
        <Button variant="on-dark-pill" size="lg">
          Open Dashboard →
        </Button>
      </Link>
    );
  }

  // Not authenticated
  if (variant === "teal") {
    return (
      <Link href="/auth/login">
        <Button variant="on-teal" size="lg">
          Launch Election Now
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/auth/login">
      <Button variant="on-dark-pill" size="lg">
        Get Started with Google
      </Button>
    </Link>
  );
}
