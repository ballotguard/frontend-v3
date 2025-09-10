"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar({ electionId }) {
  const pathname = usePathname();
  const isActive = (href) => pathname === href;

  const Item = ({ href, label }) => (
    <Link
      href={href}
      className={`w-full text-left px-3 py-2 rounded-md border transition block ${
        isActive(href)
          ? "border-neutral-900 text-neutral-900 dark:border-white dark:text-white"
          : "border-neutral-300/70 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-700/30 bg-white/80 border-[1px] dark:bg-neutral-900/70 backdrop-blur-xl p-4 sticky top-24">
      {electionId && (
        <div className="space-y-2">
          <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300">This election</div>
          <div className="flex flex-col gap-2">
            <Item href={`/user/election/${electionId}`} label="Overview" />
            <Item href={`/user/election/${electionId}/edit`} label="Edit" />
            <Item href={`/user/election/${electionId}/results`} label="Results" />
          </div>
        </div>
      )}
    </div>
  );
}
