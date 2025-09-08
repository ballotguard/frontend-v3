"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "../../../../components/AuthGuard";
import { api } from "../../../../lib/api";
import { Alert } from "../../../../components/ui/Alert";
import { useAuth } from "../../../../context/AuthContext";

export default function ElectionResultsPage() {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
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

  const totalVotes = result?.totalVotes || 0;
  // Dark-to-light blue/indigo gradients (index 0 is darkest)
  const palette = useMemo(() => [
    ["#2563eb", "#1d4ed8"], // blue-600 -> blue-700 (dark)
    ["#3b82f6", "#2563eb"], // blue-500 -> blue-600
    ["#60a5fa", "#3b82f6"], // blue-400 -> blue-500
    ["#93c5fd", "#60a5fa"], // blue-300 -> blue-400
    ["#818cf8", "#6366f1"], // indigo-400 -> indigo-500
    ["#bfdbfe", "#93c5fd"], // blue-200 -> blue-300 (light)
  ], []);

  // Group by equal vote counts so ties share the same color; 0 = most votes (darkest)
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
      <div className="max-w-3xl mx-auto p-4 text-black dark:text-white font-[Poppins,ui-sans-serif,system-ui]">
        {error && <Alert type="error" message={error} />}
        {loading ? (
          <div>Loading...</div>
        ) : result ? (
          <div className="rounded-2xl border-[0.5px] border-black dark:border-white bg-white/50 dark:bg-neutral-900/30 backdrop-blur-2xl p-4 sm:p-5 relative overflow-hidden">
            {/* subtle glowing accents */}
            <div className="pointer-events-none absolute -top-8 -left-6 h-24 w-24 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 blur-2xl rounded-full" />
            <div className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 bg-gradient-to-br from-cyan-500/15 to-indigo-500/15 blur-2xl rounded-full" />

            {/* Header */}
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

            {/* Bars */}
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
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${from}, ${to})`,
                          boxShadow: `0 2px 8px ${to}33`,
                        }}
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
      </div>
    </AuthGuard>
  );
}
