"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { api } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";

export default function EditElectionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [orig, setOrig] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  // Lock states: within 15 minutes before start, running, or ended
  const lockInfo = useMemo(() => {
    const now = Date.now();
    const start = orig?.startTime ? new Date(orig.startTime).getTime() : null;
    const end = orig?.endTime ? new Date(orig.endTime).getTime() : null;
    const fifteen = 15 * 60 * 1000;
    const within15 = !!start && now < start && (start - now) <= fifteen;
    const running = !!start && now >= start && (!end || now <= end);
    const ended = !!end && now > end;
    let reason = null;
    if (ended) reason = "ended";
    else if (running) reason = "running";
    else if (within15) reason = "prelock";
    return { within15, running, ended, reason, locked: !!reason };
  }, [orig]);

  useEffect(() => {
    (async () => {
      setLoading(true); setError("");
      try {
        const res = await api.findElection({ electionId: id });
        const e = res?.electionInfo || res;
        setOrig(e);
        setForm({
          electionName: e.electionName || "",
          electionDescription: e.electionDescription || "",
          startTime: e.startTime ? new Date(e.startTime).toISOString().slice(0,16) : "",
          endTime: e.endTime ? new Date(e.endTime).toISOString().slice(0,16) : "",
          isOpen: !!e.isOpen,
          electionLayout: {
            pollType: e.electionLayout?.pollType || "radio",
            electionCardId: e.electionLayout?.electionCardId || "",
          },
          options: (e.options || []).map(o => ({ optionId: o.optionId, optionName: o.optionName })),
          voters: (e.voters || []).map(v => ({ voterEmail: v.voterEmail })),
        });
      } catch (e) { setError(e?.data?.message || e.message); }
      finally { setLoading(false); }
    })();
  }, [id]);

  function updateField(k, v) { setForm((s) => ({ ...s, [k]: v })); }
  function updateLayout(k, v) { setForm((s) => ({ ...s, electionLayout: { ...s.electionLayout, [k]: v } })); }
  function updateArray(field, idx, k, v) {
    setForm((s) => ({ ...s, [field]: s[field].map((it,i) => i===idx ? { ...it, [k]: v } : it ) }));
  }
  function addItem(field) { setForm((s) => ({ ...s, [field]: [...s[field], field === "options" ? { optionName: "" } : { voterEmail: "" }] })); }
  function removeItem(field, idx) { setForm((s) => ({ ...s, [field]: s[field].filter((_, i) => i !== idx) })); }

  async function onSave() {
    if (!form) return;
    setSaving(true); setError(""); setMessages([]);
    try {
      const payload = {
        electionId: id,
        electionName: form.electionName,
        electionDescription: form.electionDescription,
        startTime: form.startTime ? Date.parse(form.startTime) : null,
        endTime: form.endTime ? Date.parse(form.endTime) : null,
        isOpen: !!form.isOpen,
        electionLayout: {
          pollType: form.electionLayout?.pollType,
          electionCardId: form.electionLayout?.electionCardId,
        },
        options: form.options.map(o => ({ optionName: o.optionName, optionId: o.optionId })).filter(o => o.optionName && o.optionName.trim().length > 0),
        voters: form.isOpen ? [] : form.voters,
      };
  const res = await api.updateElection(payload);
      setMessages([{ type: "success", text: res?.message || "All changes saved" }]);
    } catch (e) { setError(e?.data?.message || e.message); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="flex items-center justify-center py-10"><Spinner size={18} /><span className="sr-only">Loading</span></div>;
  if (!form) return <div>Not found</div>;

  return (
    <AuthGuard>
      <div>
        <div className="rounded-2xl border-[0.5px] border-black dark:border-white bg-white/50 dark:bg-neutral-900/30 backdrop-blur-2xl shadow-sm p-5 sm:p-6 relative overflow-hidden text-black dark:text-white">
          {/* blurred animated accents to match Overview */}
          <div className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 bg-white/30 dark:bg-white/10 blur-3xl rounded-full animate-float" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 bg-black/10 dark:bg-white/10 blur-3xl rounded-full animate-float-delayed" />
          <div className="max-w-2xl mx-auto space-y-5">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Edit election</h1>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => router.push(`/user/election/${id}`)}>Cancel</Button>
                  <Button
                    onClick={onSave}
                    disabled={saving || lockInfo.locked}
                    title={
                      lockInfo.reason === "prelock"
                        ? "Editing locked within 15 minutes of start"
                        : lockInfo.reason === "running"
                        ? "Election is running"
                        : lockInfo.reason === "ended"
                        ? "Election has ended"
                        : undefined
                    }
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              {lockInfo.reason === "prelock" && (
                <Alert type="warning" message="Editing is locked within 15 minutes of the election start." />
              )}
              {lockInfo.reason === "running" && (
                <Alert type="error" message="Election is already running. You cannot edit it." />
              )}
              {lockInfo.reason === "ended" && (
                <Alert type="error" message="Election has ended. You cannot edit it." />
              )}
              {error && <Alert type="error" message={error} />}
              {messages.map((m, i) => <Alert key={i} type={m.type} message={m.text} />)}

              <div className="space-y-4">
                <Input label="Name" value={form.electionName} onChange={(e) => updateField("electionName", e.target.value)} disabled={lockInfo.locked} />
                <TextArea label="Description" value={form.electionDescription} onChange={(e) => updateField("electionDescription", e.target.value)} disabled={lockInfo.locked} />

                <div className="grid sm:grid-cols-2 gap-3">
                  <Input label="Start time" type="datetime-local" value={form.startTime} onChange={(e) => updateField("startTime", e.target.value)} disabled={lockInfo.locked} />
                  <Input label="End time" type="datetime-local" value={form.endTime} onChange={(e) => updateField("endTime", e.target.value)} disabled={lockInfo.locked} />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Select label="Poll type" value={form.electionLayout.pollType} onChange={(e) => updateLayout("pollType", e.target.value)} disabled={lockInfo.locked}>
                    <option value="radio">Single choice</option>
                    <option value="checkbox">Multiple choice</option>
                  </Select>
                  <Input label="Card ID" value={form.electionLayout.electionCardId} onChange={(e) => updateLayout("electionCardId", e.target.value)} disabled={lockInfo.locked} />
                </div>

                <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" className="sr-only" checked={!!form.isOpen} onChange={(e) => updateField("isOpen", e.target.checked)} disabled={lockInfo.locked} />
                  <span className={`relative inline-flex h-6 w-11 items-center rounded-full border-[0.5px] border-black/40 dark:border-white/50 backdrop-blur transition-all duration-200 ease-in-out ${form.isOpen ? 'bg-emerald-600 border-emerald-600' : 'bg-white/60 dark:bg-neutral-900/50'}`}>
                    <span className={`inline-block h-5 w-5 rounded-full shadow-sm transition-all duration-200 ease-in-out ${form.isOpen ? 'translate-x-5 bg-white' : 'translate-x-0.5 bg-black'}`} />
                  </span>
                  <span>Open election (anyone with the link can vote)</span>
                </label>

                <div>
                  <h2 className="font-medium mb-2">Options</h2>
                  {form.options.map((o, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <div className="inline-flex items-center justify-center w-8 shrink-0">
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200">{idx+1}</span>
                      </div>
                      <Input className="flex-1" value={o.optionName} onChange={(e) => updateArray("options", idx, "optionName", e.target.value)} placeholder={`Option ${idx + 1}`} disabled={lockInfo.locked} />
                      <Button type="button" variant="secondary" onClick={() => removeItem("options", idx)} disabled={lockInfo.locked}>Remove</Button>
                    </div>
                  ))}
                  <Button type="button" variant="ghost" onClick={() => addItem("options")} disabled={lockInfo.locked}>Add option</Button>
                </div>

                <div>
                  <h2 className="font-medium mb-2">Voters</h2>
                  {form.voters.map((v, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <div className="inline-flex items-center justify-center w-8 shrink-0">
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200">{idx+1}</span>
                      </div>
                      <Input className="flex-1" type="email" value={v.voterEmail} onChange={(e) => updateArray("voters", idx, "voterEmail", e.target.value)} placeholder={`voter${idx + 1}@email.com`} disabled={lockInfo.locked || !!form.isOpen} />
                      <Button type="button" variant="secondary" onClick={() => removeItem("voters", idx)} disabled={lockInfo.locked || !!form.isOpen}>Remove</Button>
                    </div>
                  ))}
                  <Button type="button" variant="ghost" onClick={() => addItem("voters")} disabled={lockInfo.locked || !!form.isOpen}>Add voter</Button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
