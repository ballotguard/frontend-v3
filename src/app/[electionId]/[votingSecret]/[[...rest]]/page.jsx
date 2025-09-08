"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../../lib/api";
import { Button } from "../../../../components/ui/Button";
import { Alert } from "../../../../components/ui/Alert";

export default function PublicVotePage() {
  const params = useParams();
  // electionId is the first path segment, votingSecret is the second.
  const electionId = params?.electionId;
  const rawVoterId = params?.votingSecret; // now represents voterId per new spec
  const voterId = useMemo(() => {
    try { return decodeURIComponent(rawVoterId || ""); } catch { return rawVoterId || ""; }
  }, [rawVoterId]);

  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [selectedOptionIds, setSelectedOptionIds] = useState([]); // for checkbox mode
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (!electionId) return;
    (async () => {
      setLoading(true); setError(""); setResultMessage("");
      try {
  const res = await api.findElectionForVoter({ electionId, voterId });
  console.log("public findElectionForVoter response", res);
        const info = res?.electionInfo || res;
        setElection(info || null);
        // Preselect only for radio; leave empty for checkbox
        const pt = info?.electionLayout?.pollType || info?.pollType || "radio";
        if (pt !== "checkbox") {
          const firstOption = info?.options?.[0];
          setSelectedOptionId(firstOption?.optionId || "");
        } else {
          setSelectedOptionIds([]);
        }
      } catch (e) {
        setError(e?.data?.message || e.message || "Failed to load election");
      } finally { setLoading(false); }
    })();
  }, [electionId]);

  function pollTypeOf(elec) {
    return elec?.electionLayout?.pollType || elec?.pollType || "radio";
  }

  const pollType = useMemo(() => pollTypeOf(election), [election]);
  const layoutMode = useMemo(() => {
    const raw = election?.electionLayout?.electionCardId ?? election?.electionCardId;
    const v = String(raw ?? "").toLowerCase();
    if (v === "1" || v === "grid" || v === "style1") return "grid";
    if (v === "2" || v === "list" || v === "style2") return "list";
    return "grid";
  }, [election]);

  // End time helpers
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

  // Option list and grid sizing for centering when less than 3
  const optionsList = Array.isArray(election?.options) ? election.options : [];
  const optionCount = optionsList.length;
  const gridContainerClass = (() => {
    // Base grid and gaps
    let base = "grid gap-3";
    if (optionCount >= 3) return `${base} grid-cols-1 sm:grid-cols-2 md:grid-cols-3`;
    if (optionCount === 2) return `${base} grid-cols-1 sm:grid-cols-2 md:grid-cols-2 max-w-[720px] mx-auto`;
    return `${base} grid-cols-1 max-w-[360px] mx-auto`;
  })();

  async function castVote() {
    setSubmitting(true); setResultMessage(""); setError("");
    try {
      const pt = pollTypeOf(election);
      if (pt === "checkbox") {
        const optionIds = selectedOptionIds;
        const payload = { electionId, voterId, optionIds: JSON.stringify(optionIds) };
        console.log("castMultiVote request", payload);
        const res = await api.castMultiVote(payload);
        console.log("castMultiVote response", res);
        setResultMessage(res?.message || "Vote cast successfully");
  setVoted(true);
      } else {
        const payload = { electionId, voterId, optionId: selectedOptionId };
        console.log("castVote request", payload);
        const res = await api.castVote(payload);
        console.log("castVote response", res);
        setResultMessage(res?.message || "Vote cast successfully");
  setVoted(true);
      }
    } catch (e) {
      const msg = e?.data?.message || e.message || "Failed to cast vote";
      setError(msg);
      setResultMessage("");
    } finally { setSubmitting(false); }
  }

  function OptionItem({ option, checked, onChange }) {
    const isCheckbox = pollType === "checkbox";
    return (
      <label
        key={option.optionId || option.optionName}
        className="group cursor-pointer select-none rounded-xl border-[0.5px] border-black/30 dark:border-white/30 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md hover:border-black/60 dark:hover:border-white/60 transition p-3 flex items-start gap-3 text-black dark:text-white"
      >
        {/* Native input for accessibility */}
        <input
          type={isCheckbox ? "checkbox" : "radio"}
          name={isCheckbox ? undefined : "voteOption"}
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
          value={option.optionId}
        />
        {/* Custom control */}
        <span
          className={
            isCheckbox
              ? "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-[6px] border-[0.5px] border-black/60 dark:border-white/70 bg-white/80 dark:bg-neutral-900/60 peer-checked:bg-blue-600 peer-checked:border-blue-600"
              : "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border-[0.5px] border-black/60 dark:border-white/70 bg-white/80 dark:bg-neutral-900/60"
          }
        >
          {isCheckbox ? (
            <svg
              className={`h-3.5 w-3.5 text-white transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <span
              className={`h-2.5 w-2.5 rounded-full bg-black dark:bg-white transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </span>
        <span className="text-sm leading-5 text-inherit">{option.optionName}</span>
      </label>
    );
  }

  return (
  <div className="max-w-3xl mx-auto p-4 text-black dark:text-white font-[Poppins,ui-sans-serif,system-ui]">
      {loading && <div className="text-sm opacity-80">Loading election…</div>}
      {!loading && error && <Alert type="error" message={error} />}

      {!loading && !error && election && (
        <div className="space-y-4">
          {/* Glass card */}
          <div className="rounded-2xl border-[0.5px] border-black dark:border-white bg-white/50 dark:bg-neutral-900/30 backdrop-blur-2xl p-4 sm:p-5">
            {/* Header: name, desc, countdown (stunning) */}
            <div className="mb-4 relative">
              {/* subtle glowing accents */}
              <div className="pointer-events-none absolute -top-8 -left-6 h-24 w-24 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 blur-2xl rounded-full" />
              <div className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 bg-gradient-to-br from-cyan-500/15 to-indigo-500/15 blur-2xl rounded-full" />
              <div className="relative flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-indigo-500/70 to-cyan-500/70" />
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-inherit truncate">{election.electionName}</h1>
                    {election.electionDescription && (
                      <p className="text-sm opacity-80 mt-0.5 line-clamp-3">{election.electionDescription}</p>
                    )}
                  </div>
                  {endMs && (
                    <div className="ml-auto shrink-0 inline-flex items-center gap-2 rounded-full bg-white/50 dark:bg-neutral-900/30 px-3 py-1.5">
                      <svg className="h-5 w-5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M16 3v4M8 3v4M3 11h18" />
                      </svg>
                      <span className="text-sm sm:text-base opacity-80">Ends on</span>
                      <span className="text-sm sm:text-base font-medium">{formatEndOn(endMs)}</span>
                    </div>
                  )}
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
              </div>
            </div>

            {/* Prompt */}
            <div className="mb-3">
              <h2 className="text-base sm:text-lg font-medium text-inherit">
                {pollType === "checkbox" ? "Select one or more options" : "Select one option"}
              </h2>
              {pollType === "checkbox" && (
                <div className="text-xs opacity-70 mt-1">Multiple selections allowed</div>
              )}
            </div>

            {Array.isArray(election.options) && election.options.length > 0 ? (
              layoutMode === "grid" ? (
                <div className={gridContainerClass}>
                  {optionsList.map((o) => {
                    const checked = pollType === "checkbox" ? selectedOptionIds.includes(o.optionId) : selectedOptionId === o.optionId;
                    return (
                      <OptionItem
                        key={o.optionId || o.optionName}
                        option={o}
                        checked={checked}
                        onChange={(e) => {
                          if (pollType === "checkbox") {
                            const next = e.target.checked
                              ? [...selectedOptionIds, o.optionId]
                              : selectedOptionIds.filter((id) => id !== o.optionId);
                            setSelectedOptionIds(next);
                          } else {
                            setSelectedOptionId(o.optionId);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {optionsList.map((o) => {
                    const checked = pollType === "checkbox" ? selectedOptionIds.includes(o.optionId) : selectedOptionId === o.optionId;
                    return (
                      <OptionItem
                        key={o.optionId || o.optionName}
                        option={o}
                        checked={checked}
                        onChange={(e) => {
                          if (pollType === "checkbox") {
                            const next = e.target.checked
                              ? [...selectedOptionIds, o.optionId]
                              : selectedOptionIds.filter((id) => id !== o.optionId);
                            setSelectedOptionIds(next);
                          } else {
                            setSelectedOptionId(o.optionId);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              )
            ) : (
              <div className="text-sm opacity-80">No options available.</div>
            )}

            <div className="mt-6 flex justify-center">
              <Button
                onClick={castVote}
                disabled={submitting || endedNow || (pollType === "checkbox" ? selectedOptionIds.length === 0 : !selectedOptionId)}
              >
                {submitting ? "Submitting…" : "Cast Vote"}
              </Button>
            </div>
          </div>

          {/* Post-vote message */}
          {voted && (
            <div className="rounded-2xl border-[0.5px] border-emerald-700/50 dark:border-emerald-300/40 bg-emerald-50/60 dark:bg-emerald-700/10 backdrop-blur p-4 sm:p-5 text-emerald-900 dark:text-emerald-200">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Thank you for your vote.</div>
                  <p className="text-sm mt-1 opacity-90">
                    When the election ends, results and the full participant list will be emailed to you.
                    For security, only trust messages from
                    <span className="font-semibold"> system.ballotguard@gmail.com</span>.
                  </p>
                  {resultMessage && (
                    <div className="text-xs mt-2 opacity-80">{resultMessage}</div>
                  )}
                </div>
              </div>
            </div>
          )}
          {error && !loading && <Alert type="error" message={error} />}
        </div>
      )}
    </div>
  );
}
