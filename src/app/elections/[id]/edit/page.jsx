"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "../../../../components/AuthGuard";
import { Input } from "../../../../components/ui/Input";
import { TextArea } from "../../../../components/ui/TextArea";
import { Select } from "../../../../components/ui/Select";
import { Button } from "../../../../components/ui/Button";
import { Alert } from "../../../../components/ui/Alert";
import { api } from "../../../../lib/api";

export default function EditElectionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [orig, setOrig] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const isLocked = useMemo(() => {
    const start = orig?.startTime ? new Date(orig.startTime).getTime() : null;
    if (!start) return false;
    const now = Date.now();
    return start - now <= 15 * 60 * 1000; // within 15 minutes to start (or already started)
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
          electionLayout: {
            pollType: e.electionLayout?.pollType || "radio",
            electionCardId: e.electionLayout?.electionCardId || "",
          },
          options: (e.options || []).map(o => ({ optionId: o.optionId, optionName: o.optionName })),
          voters: (e.voters || []).map(v => ({ voterEmail: v.voterEmail })),
        });
      } catch (e) {
        setError(e?.data?.message || e.message);
      } finally { setLoading(false); }
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
    if (!form || !orig) return;
    setSaving(true); setError(""); setMessages([]);
    const results = [];
    const failures = [];

    // helper to run update and capture per-section result
    const run = async (section, fn, payload) => {
      try {
        const r = await fn(payload);
        results.push({ section, ok: true, message: r?.message || "OK" });
      } catch (e) {
        const msg = e?.data?.message || e.message || "Failed";
        failures.push({ section, message: msg });
      }
    };

    try {
      // Detect changes and call endpoints accordingly
      if (form.electionName !== orig.electionName) {
        await run("name", api.updateElectionName, { electionId: id, newElectionName: form.electionName });
      }
      if ((form.electionDescription || "") !== (orig.electionDescription || "")) {
        await run("description", api.updateElectionDescription, { electionId: id, newElectionDescription: form.electionDescription });
      }
      const formPoll = form.electionLayout?.pollType;
      const origPoll = orig.electionLayout?.pollType;
      if (formPoll !== origPoll) {
        await run("pollType", api.updateElectionPollType, { electionId: id, newPollType: formPoll });
      }
      const formCard = form.electionLayout?.electionCardId;
      const origCard = orig.electionLayout?.electionCardId;
      if (formCard !== origCard) {
        await run("cardId", api.updateElectionCardId, { electionId: id, newElectionCardId: formCard });
      }

      const formStartMs = form.startTime ? Date.parse(form.startTime) : null;
      const origStartMs = orig.startTime || null;
      if (formStartMs !== origStartMs) {
        await run("startTime", api.updateElectionStart, { electionId: id, newStartTime: formStartMs });
      }
      const formEndMs = form.endTime ? Date.parse(form.endTime) : null;
      const origEndMs = orig.endTime || null;
      if (formEndMs !== origEndMs) {
        await run("endTime", api.updateElectionEnd, { electionId: id, newEndTime: formEndMs });
      }

      // Always send full lists for voters/options when they changed
      const votersChanged = JSON.stringify(form.voters) !== JSON.stringify((orig.voters || []).map(v => ({ voterEmail: v.voterEmail })));
      if (votersChanged) {
        await run("voters", api.updateElectionVoters, { electionId: id, newVoters: form.voters });
      }
      const optionsChanged = JSON.stringify(form.options) !== JSON.stringify((orig.options || []).map(o => ({ optionId: o.optionId, optionName: o.optionName })));
      if (optionsChanged) {
        await run("options", api.updateElectionOptions, { electionId: id, newOptions: form.options.map(o => ({ optionName: o.optionName })) });
      }

      if (failures.length === 0) {
        setMessages([{ type: "success", text: "All changes saved" }]);
      } else {
        const failedList = failures.map(f => f.section).join(", ");
        setMessages([{ type: "warning", text: `Some updates failed: ${failedList}` }]);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!form) return <div>Not found</div>;

  return (
    <AuthGuard>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Edit election</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => router.push(`/elections/${id}`)}>Cancel</Button>
            <Button onClick={onSave} disabled={saving || isLocked} title={isLocked ? "Editing locked within 15 minutes of start" : undefined}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {isLocked && <Alert type="warning" message="Editing is locked within 15 minutes of the election start." className="mb-3" />}
        {error && <Alert type="error" message={error} className="mb-3" />}
        {messages.map((m, i) => <Alert key={i} type={m.type} message={m.text} className="mb-3" />)}

        <div className="space-y-4">
          <Input label="Name" value={form.electionName} onChange={(e) => updateField("electionName", e.target.value)} />
          <TextArea label="Description" value={form.electionDescription} onChange={(e) => updateField("electionDescription", e.target.value)} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Start time" type="datetime-local" value={form.startTime} onChange={(e) => updateField("startTime", e.target.value)} />
            <Input label="End time" type="datetime-local" value={form.endTime} onChange={(e) => updateField("endTime", e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Select label="Poll type" value={form.electionLayout.pollType} onChange={(e) => updateLayout("pollType", e.target.value)}>
              <option value="radio">Single choice</option>
              <option value="checkbox">Multiple choice</option>
            </Select>
            <Input label="Card ID" value={form.electionLayout.electionCardId} onChange={(e) => updateLayout("electionCardId", e.target.value)} />
          </div>

          <div>
            <h2 className="font-medium mb-2">Options</h2>
            {form.options.map((o, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input className="flex-1" value={o.optionName} onChange={(e) => updateArray("options", idx, "optionName", e.target.value)} placeholder={`Option ${idx + 1}`} />
                <Button type="button" variant="secondary" onClick={() => removeItem("options", idx)}>Remove</Button>
              </div>
            ))}
            <Button type="button" variant="ghost" onClick={() => addItem("options")}>Add option</Button>
          </div>

          <div>
            <h2 className="font-medium mb-2">Voters</h2>
            {form.voters.map((v, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input className="flex-1" type="email" value={v.voterEmail} onChange={(e) => updateArray("voters", idx, "voterEmail", e.target.value)} placeholder={`voter${idx + 1}@email.com`} />
                <Button type="button" variant="secondary" onClick={() => removeItem("voters", idx)}>Remove</Button>
              </div>
            ))}
            <Button type="button" variant="ghost" onClick={() => addItem("voters")}>Add voter</Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
