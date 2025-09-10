"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OverlaySpinner } from "@/components/OverlaySpinner";

// Shows a blurred overlay spinner during route transitions
export function ClientRouteLoadingOverlay() {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const failSafeTimer = useRef(null);
  const searchKey = useMemo(() => (searchParams ? searchParams.toString() : ""), [searchParams]);

  useEffect(() => {
    // Monkey-patch push/replace/back to toggle loading
    const origPush = router.push;
    const origReplace = router.replace;
    const origBack = router.back;
    router.push = (...args) => { setActive(true); return origPush(...args); };
    router.replace = (...args) => { setActive(true); return origReplace(...args); };
    router.back = (...args) => { setActive(true); return origBack(...args); };
    return () => {
      router.push = origPush;
      router.replace = origReplace;
      router.back = origBack;
    };
  }, [router]);

  // Clear overlay when the URL (pathname or search) changes, i.e., after navigation completes.
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 120); // small delay for nicer transition
    return () => clearTimeout(t);
  }, [active, pathname, searchKey]);

  // Fail-safe: never keep overlay more than 10s
  useEffect(() => {
    if (active) {
      if (failSafeTimer.current) clearTimeout(failSafeTimer.current);
      failSafeTimer.current = setTimeout(() => setActive(false), 10000);
    } else if (failSafeTimer.current) {
      clearTimeout(failSafeTimer.current);
      failSafeTimer.current = null;
    }
    return () => {
      if (failSafeTimer.current) {
        clearTimeout(failSafeTimer.current);
        failSafeTimer.current = null;
      }
    };
  }, [active]);

  if (!active) return null;
  return <OverlaySpinner />;
}
