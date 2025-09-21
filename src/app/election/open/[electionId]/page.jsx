"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/context/NotificationContext";

export default function OpenVotePage() {
  const params = useParams();
  const electionId = params?.electionId;

  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [error, setError] = useState("");
  const { notifyError, notifySuccess } = useNotifications();
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [selectedOptionIds, setSelectedOptionIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [openResult, setOpenResult] = useState(null);

  useEffect(() => {
    if (!electionId) return;
    (async () => {
      setLoading(true); setError(""); setResultMessage("");
      try {
        const res = await api.findOpenElection({ electionId });
        console.log("findOpenElection response:", res);
        const info = res?.electionInfo || res;
        setElection(info || null);
        const pt = info?.electionLayout?.pollType || info?.pollType || "radio";
        if (pt !== "checkbox") {
          const first = info?.options?.[0];
          setSelectedOptionId(first?.optionId || "");
        } else {
          setSelectedOptionIds([]);
        }
      } catch (e) {
        setError(e?.data?.message || e.message || "Failed to load election");
      } finally { setLoading(false); }
    })();
  }, [electionId]);

  function pollTypeOf(elec) { return elec?.electionLayout?.pollType || elec?.pollType || "radio"; }

  const pollType = useMemo(() => pollTypeOf(election), [election]);
  const layoutMode = useMemo(() => {
    const raw = election?.electionLayout?.electionCardId ?? election?.electionCardId;
    const v = String(raw ?? "").toLowerCase();
    if (v === "1" || v === "grid" || v === "style1") return "grid";
    if (v === "2" || v === "list" || v === "style2") return "list";
    return "grid";
  }, [election]);

  const optionsList = Array.isArray(election?.options) ? election.options : [];
  const optionCount = optionsList.length;
  const gridContainerClass = (() => {
    let base = "grid gap-3";
    if (optionCount >= 3) return `${base} grid-cols-1 sm:grid-cols-2 md:grid-cols-3`;
    if (optionCount === 2) return `${base} grid-cols-1 sm:grid-cols-2 md:grid-cols-2 max-w-[720px] mx-auto`;
    return `${base} grid-cols-1 max-w-[360px] mx-auto`;
  })();

  const endMs = useMemo(() => {
    const raw = election?.endTime ?? election?.endAt ?? election?.endsAt;
    if (raw == null) return undefined;
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
    const p = Date.parse(raw);
    return Number.isFinite(p) ? p : undefined;
  }, [election]);
  const endedNow = useMemo(() => (endMs ? Date.now() >= endMs : false), [endMs]);

  function formatEndOn(ms) {
    if (!ms) return "";
    const d = new Date(ms);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const suf = h >= 12 ? "PM" : "AM";
    let h12 = h % 12; if (h12 === 0) h12 = 12;
    const hh = String(h12).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} - ${hh}:${m} ${suf}`;
  }

  async function castVote() {
    setSubmitting(true); setResultMessage(""); setError("");
    try {
      const pt = pollTypeOf(election);
      if (pt === "checkbox") {
        const payload = { electionId, optionIds: JSON.stringify(selectedOptionIds) };
        const res = await api.castOpenMultiVote(payload);
        setResultMessage(res?.message || "Vote cast successfully");
        setVoted(true);
      } else {
        const payload = { electionId, optionId: selectedOptionId };
        const res = await api.castOpenVote(payload);
        setResultMessage(res?.message || "Vote cast successfully");
        setVoted(true);
      }
    } catch (e) {
      const msg = e?.data?.message || e.message || "Failed to cast vote";
      setError(msg);
      setResultMessage("");
    } finally { setSubmitting(false); }
  }

  useEffect(() => { if (error) notifyError(error); }, [error, notifyError]);
  useEffect(() => { if (resultMessage) notifySuccess(resultMessage); }, [resultMessage, notifySuccess]);

  useEffect(() => {
    if (!electionId || !endedNow) return;
    (async () => {
      try {
        const res = await api.openElectionResult({ electionId });
        setOpenResult(res?.electionResult || null);
      } catch (e) {}
    })();
  }, [electionId, endedNow]);

  const totalVotes = openResult?.totalVotes || 0;
  const palette = [["#2563eb", "#1d4ed8"],["#3b82f6", "#2563eb"],["#60a5fa", "#3b82f6"],["#93c5fd", "#60a5fa"],["#818cf8", "#6366f1"],["#bfdbfe", "#93c5fd"]];
  const rankMeta = useMemo(() => {
    const votes = (openResult?.options || []).map(o => o.votes || 0);
    const uniq = Array.from(new Set(votes)).sort((a,b) => b - a);
    const map = new Map(); uniq.forEach((v,i) => map.set(v,i));
    const steps = Math.max(uniq.length - 1, 1);
    return { rankByVotes: map, steps };
  }, [openResult]);

  function OptionItem({ option, checked, onChange }) {
    const isCheckbox = pollType === "checkbox";
    return (
      <label className="group cursor-pointer select-none rounded-xl border-[0.5px] border-black/30 dark:border-white/30 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md hover:border-black/60 dark:hover:border-white/60 transition p-3 flex items-start gap-3 text-black dark:text-white">
        <input type={isCheckbox ? "checkbox" : "radio"} name={isCheckbox ? undefined : "voteOption"} className="sr-only peer" checked={checked} onChange={onChange} value={option.optionId} />
        <span className={isCheckbox ? "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-[6px] border-[0.5px] border-black/60 dark:border-white/70 bg-white/80 dark:bg-neutral-900/60 peer-checked:bg-blue-600 peer-checked:border-blue-600" : "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border-[0.5px] border-black/60 dark:border-white/70 bg-white/80 dark:bg-neutral-900/60"}>
          {isCheckbox ? (
            <svg className={`h-3.5 w-3.5 text-white transition-opacity ${checked ? "opacity-100" : "opacity-0"}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
          ) : (
            <span className={`h-2.5 w-2.5 rounded-full bg-black dark:bg-white transition-opacity ${checked ? "opacity-100" : "opacity-0"}`} />
          )}
        </span>
        <span className="text-sm leading-5 text-inherit">{option.optionName}</span>
      </label>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 text-black dark:text-white font-[Poppins,ui-sans-serif,system-ui]">
      {loading && <div className="text-sm opacity-80">Loading election…</div>}
  {/* Inline error removed; using notifications */}

      {!loading && !error && election && (
        <div className="space-y-4">
          <div className="rounded-2xl border-[0.5px] border-black dark:border-white bg-white/50 dark:bg-neutral-900/30 backdrop-blur-2xl p-4 sm:p-5">
            <div className="mb-4 relative">
              <div className="pointer-events-none absolute -top-8 -left-6 h-24 w-24 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 blur-2xl rounded-full" />
              <div className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 bg-gradient-to-br from-cyan-500/15 to-indigo-500/15 blur-2xl rounded-full" />
              <div className="relative flex items-start gap-3">
                <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-indigo-500/70 to-cyan-500/70" />
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-inherit truncate">{election.electionName}</h1>
                  {election.electionDescription && (<p className="text-sm opacity-80 mt-0.5 line-clamp-3">{election.electionDescription}</p>)}
                </div>
                {endMs && (
                  <div className="ml-auto shrink-0 inline-flex items-center gap-2 rounded-full bg-white/50 dark:bg-neutral-900/30 px-3 py-1.5">
                    <svg className="h-5 w-5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M16 3v4M8 3v4M3 11h18" />
                    </svg>
                    <span className="text-sm sm:text-base opacity-80">{endedNow ? "Ended on" : "Ends on"}</span>
                    <span className="text-sm sm:text-base font-medium">{formatEndOn(endMs)}</span>
                  </div>
                )}
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20 mt-3" />
            </div>

            {!endedNow && (
              <div className="mb-3">
                <h2 className="text-base sm:text-lg font-medium text-inherit">{pollType === "checkbox" ? "Select one or more options" : "Select one option"}</h2>
                {pollType === "checkbox" && (<div className="text-xs opacity-70 mt-1">Multiple selections allowed</div>)}
              </div>
            )}

            {!endedNow && Array.isArray(election.options) && election.options.length > 0 ? (
              layoutMode === "grid" ? (
                <div className={gridContainerClass}>
                  {optionsList.map((o) => {
                    const checked = pollType === "checkbox" ? selectedOptionIds.includes(o.optionId) : selectedOptionId === o.optionId;
                    return (
                      <OptionItem key={o.optionId || o.optionName} option={o} checked={checked} onChange={(e) => {
                        if (pollType === "checkbox") {
                          const next = e.target.checked ? [...selectedOptionIds, o.optionId] : selectedOptionIds.filter((id) => id !== o.optionId);
                          setSelectedOptionIds(next);
                        } else {
                          setSelectedOptionId(o.optionId);
                        }
                      }} />
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {optionsList.map((o) => {
                    const checked = pollType === "checkbox" ? selectedOptionIds.includes(o.optionId) : selectedOptionId === o.optionId;
                    return (
                      <OptionItem key={o.optionId || o.optionName} option={o} checked={checked} onChange={(e) => {
                        if (pollType === "checkbox") {
                          const next = e.target.checked ? [...selectedOptionIds, o.optionId] : selectedOptionIds.filter((id) => id !== o.optionId);
                          setSelectedOptionIds(next);
                        } else {
                          setSelectedOptionId(o.optionId);
                        }
                      }} />
                    );
                  })}
                </div>
              )
            ) : !endedNow ? (
              <div className="text-sm opacity-80">No options available.</div>
            ) : null}

            {!endedNow && (
              <div className="mt-6 flex justify-center">
                <Button onClick={castVote} disabled={submitting || (pollType === "checkbox" ? selectedOptionIds.length === 0 : !selectedOptionId)}>
                  {submitting ? "Submitting…" : "Cast Vote"}
                </Button>
              </div>
            )}
          </div>

          {!endedNow && voted && (
            <div className="rounded-2xl border-[0.5px] border-emerald-700/50 dark:border-emerald-300/40 bg-emerald-50/60 dark:bg-emerald-700/10 backdrop-blur p-4 sm:p-5 text-emerald-900 dark:text-emerald-200">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Thank you for your vote.</div>
                  <p className="text-sm mt-1 opacity-90">Your vote has been recorded.</p>
                  <p className="text-sm mt-1 opacity-90">After the election ends, you can view the results on this page.</p>
                  {resultMessage && (<div className="text-xs mt-2 opacity-80">{resultMessage}</div>)}
                </div>
              </div>
            </div>
          )}

          {/* Inline error removed; using notifications */}
          {endedNow && openResult && (
            <div className="rounded-2xl border-[0.5px] border-black dark:border-white bg-white/50 dark:bg-neutral-900/30 backdrop-blur-2xl p-4 sm:p-5 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-8 -left-6 h-24 w-24 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 blur-2xl rounded-full" />
              <div className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 bg-gradient-to-br from-cyan-500/15 to-indigo-500/15 blur-2xl rounded-full" />
              <div className="relative flex items-start gap-3 mb-4">
                <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-indigo-500/70 to-cyan-500/70" />
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-inherit truncate">Results</h2>
                  <div className="text-xs sm:text-sm opacity-80 mt-0.5 truncate">{openResult.electionName}</div>
                </div>
                <div className="ml-auto shrink-0 inline-flex items-center gap-2 rounded-full bg-white/50 dark:bg-neutral-900/30 px-3 py-1.5">
                  <span className="text-xs sm:text-sm opacity-80">Votes</span>
                  <span className="text-sm sm:text-base font-medium">{totalVotes}</span>
                  <span className="opacity-40">/</span>
                  <span className="text-xs sm:text-sm opacity-80">Voters</span>
                  <span className="text-sm sm:text-base font-medium">{openResult.totalVoters}</span>
                </div>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20 mb-4" />

              <ul className="space-y-3 relative">
                {openResult.options?.map((o, idx) => {
                  const pct = totalVotes ? Math.round((o.votes / totalVotes) * 100) : 0;
                  const group = rankMeta.rankByVotes.get(o.votes || 0) ?? idx;
                  const scaled = Math.round((group / rankMeta.steps) * (palette.length - 1));
                  const [from, to] = palette[Math.min(Math.max(scaled, 0), palette.length - 1)];
                  return (
                    <li key={o.optionId} className="group rounded-xl border-[0.5px] border-black/20 dark:border-white/20 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md p-3">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="truncate font-medium text-inherit">{o.optionName}</div>
                        <div className="shrink-0 text-sm opacity-80 tabular-nums">{o.votes} • {pct}%</div>
                      </div>
                      <div className="h-3 rounded-full bg-neutral-100 dark:bg-neutral-800/60 border border-black/5 dark:border-white/10 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${from}, ${to})`, boxShadow: `0 2px 8px ${to}33` }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${o.optionName} ${pct}%`} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
