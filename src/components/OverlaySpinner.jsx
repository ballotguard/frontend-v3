"use client";
import { Spinner } from "@/components/ui/Spinner";

export function OverlaySpinner() {
  return (
    <div className="fixed inset-0 z-[9998]">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[6px]" />
      <div className="relative h-full w-full flex items-center justify-center">
        <Spinner size={28} />
      </div>
    </div>
  );
}
