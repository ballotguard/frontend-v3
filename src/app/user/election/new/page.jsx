"use client";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { api } from "@/lib/api";

// Tiny visual components
function StepHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-semibold text-inherit">{title}</h1>
      {subtitle && <p className="text-sm text-inherit opacity-80 mt-1">{subtitle}</p>}
    </div>
  );
}

function WizardProgress({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 w-full rounded-full ${i <= step ? "bg-neutral-900 dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"}`} />
      ))}
    </div>
  );
}

function ElectionLayoutMini({ mode = "grid", active }) {
  const inner = (
    <div className={`rounded-xl p-3 transition min-h-56 ${
      active
        ? "bg-white dark:bg-neutral-900 border-[0.5px] border-black dark:border-white"
        : "bg-neutral-100/50 dark:bg-neutral-800/30 border-[0.5px] border-neutral-300 dark:border-neutral-600 opacity-60"
    }`}>
      <div className="space-y-2">
        {/* Title and description bars */}
        <div className={`h-3 w-2/3 rounded ${active ? "bg-neutral-200 dark:bg-neutral-700" : "bg-neutral-300 dark:bg-neutral-600"}`} />
        <div className={`h-2 w-1/2 rounded ${active ? "bg-neutral-200 dark:bg-neutral-700" : "bg-neutral-300 dark:bg-neutral-600"}`} />
        {mode === "grid" ? (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded-md border-[0.5px] ${active ? "bg-neutral-100 dark:bg-neutral-800 border-black/20 dark:border-white/20" : "bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"}`}
              />
            ))}
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded-md border-[0.5px] ${active ? "bg-neutral-100 dark:bg-neutral-800 border-black/20 dark:border-white/20" : "bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
  return inner;
}

function PollTypePreview({ type = "radio" }) {
  const options = ["Option A", "Option B", "Option C"];
  return (
    <div className="rounded-lg border-[0.5px] border-black/40 dark:border-white/40 p-3 bg-white/85 dark:bg-neutral-900/55">
      <div className="text-xs text-inherit opacity-70 mb-2">Preview</div>
      <div className="space-y-2">
        {options.map((o, i) => (
          <label key={i} className="flex items-center gap-2 text-sm">
            {type === "radio" ? (
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full border-[0.5px] border-neutral-500">
                <span className="h-2 w-2 rounded-full bg-neutral-700 dark:bg-white" />
              </span>
            ) : (
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-[3px] border-[0.5px] border-neutral-500">
                <svg className="h-3 w-3 text-neutral-700 dark:text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            <span className="text-inherit">{o}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function NewElectionPage() {
  const router = useRouter();
  const [form, setForm] = useState(() => ({
    electionName: "",
    electionDescription: "",
    startTime: "",
    endTime: "",
    electionLayout: { pollType: "radio", electionCardId: "grid" },
    options: [],
    voters: [],
    isOpen: false,
  }));
  const [currentOption, setCurrentOption] = useState("");
  const [currentVoter, setCurrentVoter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0); // 0 basics, 1 schedule, 2 layout, 3 options, 4 voters, 5 review
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  // Formatting & parsing for dd/mm/yyyy - hh:mm AM/PM
  function toDMY(dt) {
    const d = new Date(dt);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
  function toDMY12(dt) {
    const d = new Date(dt);
    const base = toDMY(d);
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const suffix = h >= 12 ? "PM" : "AM";
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    const hh = String(h12).padStart(2, "0");
    return `${base} - ${hh}:${m} ${suffix}`;
  }
  function parseDMY(value) {
    if (!value) return null;
    const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return null;
    const dd = parseInt(m[1]);
    const mm = parseInt(m[2]);
    const yyyy = parseInt(m[3]);
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
    const d = new Date(yyyy, mm - 1, dd);
    if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
    return d;
  }
  function parseDMYTime12(value) {
    if (!value) return null;
    const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return null;
    const dd = parseInt(m[1]);
    const mm = parseInt(m[2]);
    const yyyy = parseInt(m[3]);
    let hh = parseInt(m[4]);
    const mi = parseInt(m[5]);
    const suf = m[6].toUpperCase();
    if (hh < 1 || hh > 12 || mi < 0 || mi > 59) return null;
    if (suf === "PM" && hh < 12) hh += 12;
    if (suf === "AM" && hh === 12) hh = 0;
    const d = new Date(yyyy, mm - 1, dd, hh, mi);
    if (isNaN(d.getTime())) return null;
    return d;
  }
  function normalizeDMY(value) {
    const d = parseDMY(value);
    if (!d) return value;
    return toDMY(d);
  }
  function normalizeDMYTime12(value) {
    const d = parseDMYTime12(value);
    if (!d) return value;
    return toDMY12(d);
  }

  function updateField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }
  function updateLayout(k, v) {
    setForm((s) => ({
      ...s,
      electionLayout: { ...(s?.electionLayout ?? {}), [k]: v },
    }));
  }
  function updateArray(field, idx, k, v) {
    setForm((s) => ({
      ...s,
      [field]: s[field].map((item, i) => (i === idx ? { ...item, [k]: v } : item)),
    }));
  }
  function addOption() {
    if (currentOption.trim()) {
      setForm((s) => ({ ...s, options: [...s.options, { optionName: currentOption.trim() }] }));
      setCurrentOption("");
    }
  }
  function addVoter() {
    if (currentVoter.trim() && /@/.test(currentVoter.trim())) {
      setForm((s) => ({ ...s, voters: [...s.voters, { voterEmail: currentVoter.trim() }] }));
      setCurrentVoter("");
    }
  }
  function addItem(field) {
    setForm((s) => ({ ...s, [field]: [...s[field], field === "options" ? { optionName: "" } : { voterEmail: "" }] }));
  }
  function removeItem(field, idx) {
    setForm((s) => ({ ...s, [field]: s[field].filter((_, i) => i !== idx) }));
  }

  const canNext = useMemo(() => {
    if (step === 0) return form.electionName.trim().length > 0;
    if (step === 1) return Boolean(parseDMYTime12(form.startTime) && parseDMYTime12(form.endTime));
    if (step === 2) return Boolean(form.electionLayout?.pollType && form.electionLayout?.electionCardId);
    if (step === 3) return form.options.length > 0;
    if (step === 4) return form.isOpen || form.voters.length > 0;
    return true;
  }, [step, form]);

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        startTime: parseDMYTime12(form.startTime)?.getTime(),
        endTime: parseDMYTime12(form.endTime)?.getTime(),
        voters: form.isOpen ? [] : form.voters,
      };
      const res = await api.createElection(payload);
      try {
        const info = res?.electionInfo;
        if (info) {
          const { storage, TOKEN_KEYS } = await import("@/lib/storage");
          storage.set(TOKEN_KEYS.lastElection, info);
        }
      } catch {}
      const id = res?.electionInfo?.electionId || res?.electionId || res?.id;
      if (!id) throw new Error("Election created but missing id in response.");
      router.replace(`/user/election/${id}`);
    } catch (e) {
      setError(e?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  // Safe derived values to avoid undefined access
  const pollType = form?.electionLayout?.pollType ?? "radio";
  const selectedLayout = String(form?.electionLayout?.electionCardId ?? "grid");

  // Ensure defaults are selected when entering layout step
  if (step === 2) {
    if (!form.electionLayout?.pollType) {
      setForm((s) => ({
        ...s,
        electionLayout: { ...s.electionLayout, pollType: "radio" },
      }));
    }
    if (!form.electionLayout?.electionCardId) {
      setForm((s) => ({
        ...s,
        electionLayout: { ...s.electionLayout, electionCardId: "grid" },
      }));
    }
  }

  const getPollTypeDisplay = (type) => {
    return type === "radio" ? "Single vote" : "Multiple vote";
  };

  const steps = [
    { key: "basics", title: "Basics", subtitle: "Name and short description" },
    { key: "schedule", title: "Schedule", subtitle: "Set start and end time" },
    { key: "layout", title: "Layout", subtitle: "Choose poll type and page layout" },
    { key: "options", title: "Options", subtitle: "Add the choices" },
    { key: "voters", title: "Voters", subtitle: "Add eligible voters" },
    { key: "review", title: "Review", subtitle: "Confirm and create" },
  ];

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Glass card wrapper aligned with login aesthetics */}
        <div className="rounded-2xl border-[0.5px] border-black dark:border-white bg-white/50 dark:bg-neutral-900/30 backdrop-blur-2xl shadow-sm p-5 sm:p-6 relative overflow-hidden text-black dark:text-white">
          {/* blurred animated accents */}
          <div className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 bg-white/30 dark:bg-white/10 blur-3xl rounded-full animate-float" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 bg-black/10 dark:bg-white/10 blur-3xl rounded-full animate-float-delayed" />
          <WizardProgress step={step} total={steps.length} />
          <div key={step} className="animate-fade-in-up">
            <StepHeader title={`Create election · ${steps[step].title}`} subtitle={steps[step].subtitle} />
          </div>
          {error && <Alert type="error" message={error} className="mb-3" />}

          {/* Step content */}
          <div key={"content-" + step} className="space-y-4 animate-fade-in-up">
            {step === 0 && (
              <div className="grid gap-3">
                <Input label="Election name" value={form.electionName} onChange={(e) => updateField("electionName", e.target.value)} required />
                <TextArea label="Short description" value={form.electionDescription} onChange={(e) => updateField("electionDescription", e.target.value)} placeholder="What is this election about?" />
              </div>
            )}

            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Start time</span>
                  <div className="flex items-center justify-between gap-2 rounded-md border-[0.5px] border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/30 focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white px-2 py-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="dd/mm/yyyy - hh:mm AM/PM"
                      value={form.startTime}
                      onChange={(e) => updateField("startTime", e.target.value)}
                      onBlur={(e) => updateField("startTime", normalizeDMYTime12(e.target.value))}
                      className="w-full bg-transparent text-sm focus:outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const el = startPickerRef.current;
                        if (el?.showPicker) el.showPicker();
                        else el?.click();
                      }}
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
                      type="datetime-local"
                      className="absolute opacity-0 pointer-events-none h-0 w-0"
                      onChange={(e) => {
                        const val = e.target.value; // yyyy-mm-ddThh:mm
                        if (!val) {
                          updateField("startTime", "");
                          return;
                        }
                        const [ymd, hm] = val.split("T");
                        const [y, m, d] = ymd.split("-");
                        let [hh, mi] = hm.split(":");
                        let h = parseInt(hh, 10);
                        const suffix = h >= 12 ? "PM" : "AM";
                        let h12 = h % 12;
                        if (h12 === 0) h12 = 12;
                        const out = `${d}/${m}/${y} - ${String(h12).padStart(2, "0")}:${mi} ${suffix}`;
                        updateField("startTime", out);
                      }}
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">End time</span>
                  <div className="flex items-center justify-between gap-2 rounded-md border-[0.5px] border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/30 focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-white px-2 py-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="dd/mm/yyyy - hh:mm AM/PM"
                      value={form.endTime}
                      onChange={(e) => updateField("endTime", e.target.value)}
                      onBlur={(e) => updateField("endTime", normalizeDMYTime12(e.target.value))}
                      className="w-full bg-transparent text-sm focus:outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const el = endPickerRef.current;
                        if (el?.showPicker) el.showPicker();
                        else el?.click();
                      }}
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
                      type="datetime-local"
                      className="absolute opacity-0 pointer-events-none h-0 w-0"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                          updateField("endTime", "");
                          return;
                        }
                        const [ymd, hm] = val.split("T");
                        const [y, m, d] = ymd.split("-");
                        let [hh, mi] = hm.split(":");
                        let h = parseInt(hh, 10);
                        const suffix = h >= 12 ? "PM" : "AM";
                        let h12 = h % 12;
                        if (h12 === 0) h12 = 12;
                        const out = `${d}/${m}/${y} - ${String(h12).padStart(2, "0")}:${mi} ${suffix}`;
                        updateField("endTime", out);
                      }}
                    />
                  </div>
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-inherit">Poll type</label>
                  <div className="flex gap-2">
                    {[
                      { k: "radio", label: "Single vote" },
                      { k: "checkbox", label: "Multiple vote" },
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.k}
                        onClick={() => updateLayout("pollType", p.k)}
                        className={`px-3 py-1.5 rounded-md border-[0.5px] ${pollType === p.k ? "border-black dark:border-white text-inherit" : "border-black/30 dark:border-white/30 text-inherit opacity-70"}`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <div className="text-xs text-inherit opacity-70 mb-1">Single vote example</div>
                      <PollTypePreview type="radio" />
                    </div>
                    <div>
                      <div className="text-xs text-inherit opacity-70 mb-1">Multiple vote example</div>
                      <PollTypePreview type="checkbox" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-inherit">Election page layout</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="text-left relative" onClick={() => updateLayout("electionCardId", "grid")}>
                      <div>
                        <ElectionLayoutMini mode="grid" active={selectedLayout === "grid"} />
                      </div>
                      <div className="mt-1 text-xs text-inherit opacity-70">Grid</div>
                    </button>
                    <button type="button" className="text-left relative" onClick={() => updateLayout("electionCardId", "list")}>
                      <div>
                        <ElectionLayoutMini mode="list" active={selectedLayout === "list"} />
                      </div>
                      <div className="mt-1 text-xs text-inherit opacity-70">List</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="mb-2">
                  <h2 className="font-medium text-inherit">Options</h2>
                </div>

                {/* Add new option input */}
                <div className="flex gap-2 mb-4">
                  <Input className="flex-1" value={currentOption} onChange={(e) => setCurrentOption(e.target.value)} placeholder="Enter options" onKeyPress={(e) => e.key === "Enter" && addOption()} />
                  <Button type="button" onClick={addOption} disabled={!currentOption.trim()}>
                    Add option
                  </Button>
                </div>

                {/* Options list */}
                {form.options.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-inherit">Added options:</h3>
                    {form.options.map((o, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                        <span className="text-sm text-inherit">{idx + 1}. {o.optionName}</span>
                        <Button type="button" variant="secondary" size="sm" onClick={() => removeItem("options", idx)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="mb-2">
                  <h2 className="font-medium text-inherit">Voters</h2>
                </div>

                {/* Open election toggle (switch) */}
                <label className="inline-flex items-center gap-3 mb-3 cursor-pointer select-none">
                  <input type="checkbox" className="sr-only" checked={!!form.isOpen} onChange={(e) => updateField("isOpen", e.target.checked)} />
                  <span className={`relative inline-flex h-6 w-11 items-center rounded-full border-[0.5px] border-black/40 dark:border-white/50 backdrop-blur transition-all duration-200 ease-in-out ${form.isOpen ? 'bg-emerald-600 border-emerald-600' : 'bg-white/60 dark:bg-neutral-900/50'}`}>
                    <span className={`inline-block h-5 w-5 rounded-full shadow-sm transition-all duration-200 ease-in-out ${form.isOpen ? 'translate-x-5 bg-white' : 'translate-x-0.5 bg-black'}`} />
                  </span>
                  <span className="text-sm leading-5 text-inherit">Open election (anyone with the link can vote)</span>
                </label>
                {form.isOpen && <div className="text-xs opacity-70 mb-3">Voter list is disabled while election is open.</div>}

                {/* Add new voter input */}
                <div className="flex gap-2 mb-4">
                  <Input className="flex-1" type="email" value={currentVoter} onChange={(e) => setCurrentVoter(e.target.value)} placeholder="Enter email address" onKeyPress={(e) => e.key === "Enter" && addVoter()} disabled={form.isOpen} />
                  <Button type="button" onClick={addVoter} disabled={form.isOpen || !currentVoter.trim() || !/@/.test(currentVoter.trim())}>
                    Add voter
                  </Button>
                </div>

                {/* Voters list */}
                {!form.isOpen && form.voters.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-inherit">Added voters:</h3>
                    {form.voters.map((v, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                        <span className="text-sm text-inherit">{idx + 1}. {v.voterEmail}</span>
                        <Button type="button" variant="secondary" size="sm" onClick={() => removeItem("voters", idx)} disabled={form.isOpen}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4 text-sm">
                {/* Election Details */}
                <div className="rounded-lg border-[0.5px] border-black/20 dark:border-white/20 p-4 bg-white/50 dark:bg-neutral-900/30">
                  <div className="font-medium text-inherit text-lg mb-1">{form.electionName || "Untitled"}</div>
                  <div className="text-inherit opacity-80">{form.electionDescription || "No description"}</div>
                </div>

                {/* Schedule */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
                    <div className="text-xs text-inherit opacity-70 mb-1">Start Time</div>
                    <div className="font-medium text-inherit">{form.startTime || "-"}</div>
                  </div>
                  <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
                    <div className="text-xs text-inherit opacity-70 mb-1">End Time</div>
                    <div className="font-medium text-inherit">{form.endTime || "-"}</div>
                  </div>
                </div>

                {/* Settings */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
                    <div className="text-xs text-inherit opacity-70 mb-1">Poll Type</div>
                    <div className="font-medium text-inherit">{getPollTypeDisplay(pollType)}</div>
                  </div>
                  <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
                    <div className="text-xs text-inherit opacity-70 mb-1">Page Layout</div>
                    <div className="font-medium text-inherit capitalize">{selectedLayout}</div>
                  </div>
                </div>

                {/* Access (Open/Closed) */}
                <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
                  <div className="text-xs text-inherit opacity-70 mb-1">Access</div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-inherit">Election Access</div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${
                        form.isOpen
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/40"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/40"
                      }`}
                    >
                      {form.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="text-xs opacity-70 mt-1">{form.isOpen ? "Anyone with the link can vote." : "Only listed voters can vote."}</div>
                </div>

                {/* Options */}
                <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
                  <div className="text-xs text-inherit opacity-70 mb-2">Options ({form.options.length})</div>
                  <div className="space-y-1">
                    {form.options.length > 0 ? (
                      form.options.map((o, idx) => <div key={idx} className="text-inherit">{idx + 1}. {o.optionName}</div>)
                    ) : (
                      <div className="text-inherit opacity-60">No options added</div>
                    )}
                  </div>
                </div>

                {/* Voters */}
                <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
                  <div className="text-xs text-inherit opacity-70 mb-2">Voters ({form.voters.length})</div>
                  <div className="space-y-1">
                    {form.voters.length > 0 ? (
                      form.voters.map((v, idx) => <div key={idx} className="text-inherit">{idx + 1}. {v.voterEmail}</div>)
                    ) : (
                      <div className="text-inherit opacity-60">No voters added</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="mt-6 flex items-center justify-between">
            <Button type="button" variant="secondary" disabled={step === 0 || loading} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              Previous
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" disabled={!canNext || loading} onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
                Next
              </Button>
            ) : (
              <Button type="button" disabled={loading} onClick={submit}>
                {loading ? "Creating..." : "Create"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
