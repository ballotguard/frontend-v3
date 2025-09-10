"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import { AuthGuard } from "../../components/AuthGuard";
import { Button } from "../../components/ui/Button";
import { ColorfulButton } from "../../components/ui/ColorfulButton";
import { Alert } from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../components/ui/Spinner";
// no local cache; always fetch from API per requirement

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("running"); // running | upcoming | finished
  const [startDateFilter, setStartDateFilter] = useState(""); // YYYY-MM-DD
  const [endDateFilter, setEndDateFilter] = useState("");   // YYYY-MM-DD

  const isEditLocked = (startTime) => {
    if (!startTime) return false;
    const startMs = new Date(startTime).getTime();
    const now = Date.now();
    return startMs - now <= 15 * 60 * 1000; // 15 minutes before start
  };

  async function load() {
    setLoading(true); setError("");
    try {
      const res = await api.findAllElections();
      console.log("findAllElections response", res);
      // Support both .elections and .electionList (backend variant)
      const list = res?.elections || res?.electionList || [];
      setElections(list);
    } catch (e) {
      setError(e?.data?.message || e.message);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated) load();
  }, [authLoading, isAuthenticated]);

  const categorized = useMemo(() => {
    const now = Date.now();
    const buckets = { running: [], upcoming: [], finished: [] };
    for (const e of elections) {
      const start = e?.startTime ? new Date(e.startTime).getTime() : null;
      const end = e?.endTime ? new Date(e.endTime).getTime() : null;
      let key = "running";
      if (start && now < start) key = "upcoming";
      else if (end && now > end) key = "finished";
      buckets[key].push(e);
    }
    return buckets;
  }, [elections]);

  const visible = activeTab === "running" ? categorized.running : activeTab === "upcoming" ? categorized.upcoming : categorized.finished;

  const filtered = useMemo(() => {
    const list = activeTab === "running" ? categorized.running : activeTab === "upcoming" ? categorized.upcoming : categorized.finished;
    const startParsed = parseDMY(startDateFilter);
    const endParsed = parseDMY(endDateFilter);
    const startBound = startParsed ? new Date(startParsed).setHours(0,0,0,0) : null;
    const endBound = endParsed ? new Date(endParsed).setHours(23,59,59,999) : null;
    return list.filter((e) => {
      const s = e?.startTime ? new Date(e.startTime).getTime() : null;
      const en = e?.endTime ? new Date(e.endTime).getTime() : null;
      if (startBound && s && s < startBound) return false;
      if (endBound && en && en > endBound) return false;
      return true;
    });
  }, [activeTab, categorized, startDateFilter, endDateFilter]);

  function fmt(dt) {
    if (!dt) return "-";
    try {
      const d = new Date(dt);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return String(dt);
    }
  }

  // dd/mm/yyyy - hh:mm AM/PM (12h)
  function fmtWithTime(dt) {
    if (!dt) return "-";
    try {
      const d = new Date(dt);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      let h24 = d.getHours();
      const mi = String(d.getMinutes()).padStart(2, "0");
      const suffix = h24 >= 12 ? "PM" : "AM";
      let h12 = h24 % 12; // 0 -> 0 for midnight/noon
      if (h12 === 0) h12 = 12; // 0 => 12
      const hh = String(h12).padStart(2, "0");
      return `${dd}/${mm}/${yyyy} - ${hh}:${mi} ${suffix}`;
    } catch {
      return String(dt);
    }
  }

  // Parse dd/mm/yyyy to Date, else null
  function parseDMY(value) {
    if (!value) return null;
    const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return null;
    const dd = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const yyyy = parseInt(m[3], 10);
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
    const d = new Date(yyyy, mm - 1, dd);
    if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
    return d;
  }

  // Normalize dd/mm/yyyy padding
  function normalizeDMY(value) {
    const d = parseDMY(value);
    if (!d) return value;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  // Refs for hidden native pickers
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  function votersCount(e) {
    if (Array.isArray(e?.voters)) return e.voters.length;
    return e?.totalVoters ?? e?.voterCount ?? e?.votersCount ?? 0;
  }

  const CalendarIcon = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
  const UsersIcon = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  return (
    <AuthGuard>
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-700/30 bg-white/80 border-[1px] dark:bg-neutral-900/70 backdrop-blur-xl p-4 sticky top-24">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Filters</h2>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { key: "upcoming", label: `Upcoming (${categorized.upcoming.length})` },
                { key: "running", label: `Running (${categorized.running.length})` },
                { key: "finished", label: `Finished (${categorized.finished.length})` },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`w-full text-left px-3 py-2 rounded-md border transition ${
                    activeTab === t.key
                      ? "border-neutral-900 text-neutral-900 dark:border-white dark:text-white"
                      : "border-neutral-300/70 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {/* Date filters */}
            <div className="mt-6 space-y-3">
              <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300">Dates</div>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-neutral-600 dark:text-neutral-400">Start on or after</span>
                <div className="flex items-center justify-between gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/30 focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white px-2 py-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="dd/mm/yyyy"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    onBlur={(e) => setStartDateFilter(normalizeDMY(e.target.value))}
                    className="w-full bg-transparent text-sm focus:outline-none text-neutral-900 dark:text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={() => { const el = startPickerRef.current; if (el?.showPicker) el.showPicker(); else el?.click(); }}
                    className="shrink-0 text-neutral-700 dark:text-neutral-100 hover:opacity-90"
                    aria-label="Open calendar"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M16 3v4M8 3v4M3 11h18" />
                    </svg>
                  </button>
                  <input
                    ref={startPickerRef}
                    type="date"
                    className="absolute opacity-0 pointer-events-none h-0 w-0"
                    onChange={(e) => {
                      const iso = e.target.value; // yyyy-mm-dd
                      if (!iso) { setStartDateFilter(""); return; }
                      const [y, m, d] = iso.split("-");
                      setStartDateFilter(`${d}/${m}/${y}`);
                    }}
                  />
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-neutral-600 dark:text-neutral-400">End on or before</span>
                <div className="flex items-center justify-between gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/30 focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white px-2 py-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="dd/mm/yyyy"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    onBlur={(e) => setEndDateFilter(normalizeDMY(e.target.value))}
                    className="w-full bg-transparent text-sm focus:outline-none text-neutral-900 dark:text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={() => { const el = endPickerRef.current; if (el?.showPicker) el.showPicker(); else el?.click(); }}
                    className="shrink-0 text-neutral-700 dark:text-neutral-100 hover:opacity-90"
                    aria-label="Open calendar"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M16 3v4M8 3v4M3 11h18" />
                    </svg>
                  </button>
                  <input
                    ref={endPickerRef}
                    type="date"
                    className="absolute opacity-0 pointer-events-none h-0 w-0"
                    onChange={(e) => {
                      const iso = e.target.value;
                      if (!iso) { setEndDateFilter(""); return; }
                      const [y, m, d] = iso.split("-");
                      setEndDateFilter(`${d}/${m}/${y}`);
                    }}
                  />
                </div>
              </label>
              {(startDateFilter || endDateFilter) && (
                <button onClick={() => { setStartDateFilter(""); setEndDateFilter(""); }} className="text-xs text-neutral-700 dark:text-neutral-300 underline">Clear dates</button>
              )}
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold capitalize">{activeTab} elections</h1>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={load} className="bg-neutral-800 text-white hover:bg-neutral-900 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-100 w-36 h-[47px] mt-[1px]">Refresh</Button>
              <Link href="/user/election/new">
                <ColorfulButton variant="secondary" width="160px">Create election</ColorfulButton>
              </Link>
            </div>
          </div>
          {error && <Alert type="error" message={error} />}
          {loading ? (
            <div className="flex items-center justify-center py-10"><Spinner size={18} /><span className="sr-only">Loading</span></div>
          ) : filtered.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((e) => (
                <div key={e.electionId} className="group relative">
                  {/* solid border: black (light) / white (dark) */}
                  <div className="rounded-xl">
                    <div className="relative rounded-xl border-[1px] border-neutral-200/70 dark:border-neutral-700/30 p-4 bg-white dark:bg-neutral-900/60 text-neutral-900 dark:text-white backdrop-blur-sm transition shadow-sm hover:shadow-md">
                      {/* content that blurs/dims on hover */}
                      <div className="transition duration-200 group-hover:blur-sm group-hover:opacity-70">
                        <div className="min-w-0 h-32 flex flex-col">
                          <div className="font-medium text-base truncate">{e.electionName || "Untitled"}</div>
                          <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 flex-1">
                            {e.electionDescription || e.description || "No description available"}
                          </div>
                          <div className="mt-4 w-full">
                            <div className="rounded-md border-[0.5px] border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-white/5 px-2 py-1.5 text-[10px] text-neutral-700 dark:text-neutral-200 w-full">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 text-center">
                                  <div className="font-medium">{fmt(e.startTime)}</div>
                                  <div className="text-xs opacity-75">{fmtWithTime(e.startTime).split(' - ')[1]}</div>
                                </div>
                                <div className="h-px w-8 bg-neutral-400 dark:bg-neutral-500 my-2"></div>
                                <div className="flex-1 text-center">
                                  <div className="font-medium">{fmt(e.endTime)}</div>
                                  <div className="text-xs opacity-75">{fmtWithTime(e.endTime).split(' - ')[1]}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* hover actions centered */}
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2 pointer-events-auto">
                          {activeTab === "finished" ? (
                            <Link href={`/user/election/${e.electionId}/results`}>
                              <Button size="sm" variant="secondary">Results</Button>
                            </Link>
                          ) : (
                            <Link href={`/user/election/${e.electionId}/edit`}>
                              <Button size="sm" variant="secondary" disabled={isEditLocked(e.startTime)} title={isEditLocked(e.startTime) ? "Editing locked within 15 minutes of start" : "Edit"}>Edit</Button>
                            </Link>
                          )}
                          <Link href={`/user/election/${e.electionId}`}>
                            <Button size="sm">View</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-neutral-600 dark:text-neutral-400">No elections in this category.</div>
          )}
        </section>
      </div>
    </AuthGuard>
  );
}
