"use client";
import { Spinner } from "@/components/ui/Spinner";

export function BrandedLoader() {
  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Transparent layer with slight blur so background is visible */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[6px]" />
      <div className="relative h-full w-full flex items-center justify-center">
  <Spinner size={48} className="border-4 border-white/70 border-t-white" />
      </div>
    </div>
  );
}
