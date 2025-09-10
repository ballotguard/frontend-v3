"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { api } from "@/lib/api";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Spinner";

export default function ElectionResultsPage() {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const { notifyError } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    (async () => {
      try {
        const res = await api.electionResult({ electionId: id });
        setResult(res?.electionResult);
      } catch (e) { setError(e?.data?.message || e.message); }
      finally { setLoading(false); }
    })();
  }, [id, authLoading, isAuthenticated]);

  useEffect(() => { if (error) notifyError(error); }, [error, notifyError]);

  const totalVotes = result?.totalVotes || 0;
  const palette = useMemo(() => [
    ["#2563eb", "#1d4ed8"],
    ["#3b82f6", "#2563eb"],
    ["#60a5fa", "#3b82f6"],
    ["#93c5fd", "#60a5fa"],
    ["#818cf8", "#6366f1"],
    ["#bfdbfe", "#93c5fd"],
  ], []);

  const { rankByVotes, steps } = useMemo(() => {
    const votes = (result?.options || []).map(o => o.votes || 0);
    const uniq = Array.from(new Set(votes)).sort((a, b) => b - a);
    const map = new Map();
    uniq.forEach((v, i) => map.set(v, i));
    const st = Math.max(uniq.length - 1, 1);
    return { rankByVotes: map, steps: st };
  }, [result]);

  return (
    <AuthGuard>
  <div className="text-black dark:text-white">
  {/* Inline error removed; using global notifications */}
        {loading ? (
          <div className="flex items-center justify-center py-10"><Spinner size={18} /><span className="sr-only">Loading</span></div>
        ) : (
          <>
            {result ? (
              <div className="rounded-2xl border-[0.5px] border-black dark:border-white bg-white/50 dark:bg-neutral-900/30 backdrop-blur-2xl p-5 sm:p-6 relative overflow-hidden">
                {/* blurred animated accents to match Overview/Edit */}
                <div className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 bg-white/30 dark:bg-white/10 blur-3xl rounded-full animate-float" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 bg-black/10 dark:bg-white/10 blur-3xl rounded-full animate-float-delayed" />
                <div className="relative flex items-start gap-3 mb-4">
                  <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-indigo-500/70 to-cyan-500/70" />
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-inherit truncate">Results</h1>
                    <div className="text-xs sm:text-sm opacity-80 mt-0.5 truncate">{result.electionName}</div>
                  </div>
                  <div className="ml-auto shrink-0 inline-flex items-center gap-2 rounded-full bg-white/50 dark:bg-neutral-900/30 px-3 py-1.5">
                    <span className="text-xs sm:text-sm opacity-80">Votes</span>
                    <span className="text-sm sm:text-base font-medium">{totalVotes}</span>
                    <span className="opacity-40">/</span>
                    <span className="text-xs sm:text-sm opacity-80">Voters</span>
                    <span className="text-sm sm:text-base font-medium">{result.totalVoters}</span>
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20 mb-4" />
                <ul className="space-y-3 relative">
                  {result.options?.map((o, idx) => {
                    const pct = totalVotes ? Math.round((o.votes / totalVotes) * 100) : 0;
                    const group = rankByVotes.get(o.votes || 0) ?? idx;
                    const scaled = Math.round((group / steps) * (palette.length - 1));
                    const [from, to] = palette[Math.min(Math.max(scaled, 0), palette.length - 1)];
                    return (
                      <li key={o.optionId} className="group rounded-xl border-[0.5px] border-black/20 dark:border-white/20 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md p-3">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="truncate font-medium text-inherit">{o.optionName}</div>
                          <div className="shrink-0 text-sm opacity-80 tabular-nums">{o.votes} • {pct}%</div>
                        </div>
                        <div className="h-3 rounded-full bg-neutral-100 dark:bg-neutral-800/60 border border-black/5 dark:border-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${from}, ${to})`, boxShadow: `0 2px 8px ${to}33` }}
                            role="progressbar"
                            aria-valuenow={pct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${o.optionName} ${pct}%`}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div>No result available.</div>
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}
