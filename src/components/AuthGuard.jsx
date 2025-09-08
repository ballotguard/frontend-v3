"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/auth/login");
  }, [loading, isAuthenticated, router]);
  if (loading) return null;
  if (!isAuthenticated) return null;
  return children;
}
