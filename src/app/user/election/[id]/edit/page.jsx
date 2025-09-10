"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/context/NotificationContext";
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
  const { notifyError, notifySuccess } = useNotifications();
  const [isLocked, setIsLocked] = useState(false);
  const [currentOption, setCurrentOption] = useState("");
  const [currentVoter, setCurrentVoter] = useState("");

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

  // Check if election is within 15 minutes of start time
  useEffect(() => {
    if (!form?.startTime) return;
    
    const checkLockStatus = () => {
      const now = new Date();
      const startTime = new Date(form.startTime);
      const timeDiff = startTime.getTime() - now.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      // Lock if we are within 15 minutes of the start time
      setIsLocked(minutesDiff <= 15 && minutesDiff > 0);
    };
    
    checkLockStatus();
    const interval = setInterval(checkLockStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [form?.startTime]);

  function updateField(k, v) { setForm((s) => ({ ...s, [k]: v })); }
  function updateLayout(k, v) { setForm((s) => ({ ...s, electionLayout: { ...s.electionLayout, [k]: v } })); }
  function updateArray(field, idx, k, v) {
    setForm((s) => ({ ...s, [field]: s[field].map((it,i) => i===idx ? { ...it, [k]: v } : it ) }));
  }
  function addItem(field) { setForm((s) => ({ ...s, [field]: [...s[field], field === "options" ? { optionName: "" } : { voterEmail: "" }] })); }
  function removeItem(field, idx) { setForm((s) => ({ ...s, [field]: s[field].filter((_, i) => i !== idx) })); }
  function addOption() {
    if (!currentOption.trim()) return;
    setForm(s => ({ ...s, options: [...s.options, { optionName: currentOption.trim() }] }));
    setCurrentOption("");
  }
  function addVoter() {
    if (!currentVoter.trim()) return;
    setForm(s => ({ ...s, voters: [...s.voters, { voterEmail: currentVoter.trim() }] }));
    setCurrentVoter("");
  }

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
      // Redirect to overview after successful save
      setTimeout(() => {
        router.push(`/user/election/${id}`);
      }, 1000);
    } catch (e) { setError(e?.data?.message || e.message); }
    finally { setSaving(false); }
  }

  // Emit notifications for errors and success messages
  useEffect(() => {
    if (error) notifyError(error);
  }, [error, notifyError]);
  useEffect(() => {
    messages.forEach(m => {
      if (m.type === 'success') notifySuccess(m.text);
      else notifyError(m.text);
    });
  }, [messages, notifyError, notifySuccess]);

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
                    disabled={saving || isLocked}
                    title={isLocked ? "Editing locked within 15 minutes of start time" : undefined}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              {/* Show lock message at the top */}
              {isLocked && (
                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-3 rounded-md">
                  Election is uneditable 15 minutes before the start time.
                </div>
              )}

              <div className="space-y-4">
                <Input label="Name" value={form.electionName} onChange={(e) => updateField("electionName", e.target.value)} disabled={isLocked} />
                <TextArea label="Description" value={form.electionDescription} onChange={(e) => updateField("electionDescription", e.target.value)} disabled={isLocked} />

                <div className="grid sm:grid-cols-2 gap-3">
                  <Input label="Start time" type="datetime-local" value={form.startTime} onChange={(e) => updateField("startTime", e.target.value)} disabled={isLocked} />
                  <Input label="End time" type="datetime-local" value={form.endTime} onChange={(e) => updateField("endTime", e.target.value)} disabled={isLocked} />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Select label="Poll type" value={form.electionLayout.pollType} onChange={(e) => updateLayout("pollType", e.target.value)} disabled={isLocked}>
                    <option value="radio">Single choice</option>
                    <option value="checkbox">Multiple choice</option>
                  </Select>
                  <Input label="Card ID" value={form.electionLayout.electionCardId} onChange={(e) => updateLayout("electionCardId", e.target.value)} disabled={isLocked} />
                </div>

                <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" className="sr-only" checked={!!form.isOpen} onChange={(e) => updateField("isOpen", e.target.checked)} disabled={isLocked} />
                  <span className={`relative inline-flex h-6 w-11 items-center rounded-full border-[0.5px] border-black/40 dark:border-white/50 backdrop-blur transition-all duration-200 ease-in-out ${form.isOpen ? 'bg-emerald-600 border-emerald-600' : 'bg-white/60 dark:bg-neutral-900/50'}`}>
                    <span className={`inline-block h-5 w-5 rounded-full shadow-sm transition-all duration-200 ease-in-out ${form.isOpen ? 'translate-x-5 bg-white' : 'translate-x-0.5 bg-black'}`} />
                  </span>
                  <span>Open election (anyone with the link can vote)</span>
                </label>

                <div>
                  <div className="mb-2">
                    <h2 className="font-medium">Options</h2>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <Input className="flex-1" value={currentOption} onChange={(e) => setCurrentOption(e.target.value)} placeholder="Enter options" disabled={isLocked} onKeyPress={(e) => e.key === 'Enter' && addOption()} />
                    <Button type="button" onClick={addOption} disabled={isLocked || !currentOption.trim()}>Add option</Button>
                  </div>
                  {form.options.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Added options:</h3>
                      {form.options.map((o, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                          <span className="text-sm">{idx + 1}. {o.optionName}</span>
                          <Button type="button" variant="secondary" size="sm" onClick={() => removeItem("options", idx)} disabled={isLocked}>Remove</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-2">
                    <h2 className="font-medium">Voters</h2>
                  </div>
                  {form.isOpen && <div className="text-xs opacity-70 mb-3">Voter list is disabled while election is open.</div>}
                  <div className="flex gap-2 mb-4">
                    <Input className="flex-1" type="email" value={currentVoter} onChange={(e) => setCurrentVoter(e.target.value)} placeholder="Enter email address" disabled={isLocked || form.isOpen} onKeyPress={(e) => e.key === 'Enter' && addVoter()} />
                    <Button type="button" onClick={addVoter} disabled={isLocked || form.isOpen || !currentVoter.trim() || !/@/.test(currentVoter.trim())}>Add voter</Button>
                  </div>
                  {!form.isOpen && form.voters.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Added voters:</h3>
                      {form.voters.map((v, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                          <span className="text-sm">{idx + 1}. {v.voterEmail}</span>
                          <Button type="button" variant="secondary" size="sm" onClick={() => removeItem("voters", idx)} disabled={isLocked}>Remove</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}