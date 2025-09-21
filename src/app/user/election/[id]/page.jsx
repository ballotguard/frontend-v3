"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/context/NotificationContext";
import { Spinner } from "@/components/ui/Spinner";

export default function ElectionManagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { notifyError, notifySuccess } = useNotifications();
  const [loading, setLoading] = useState(true);

  const fetchElection = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.findElection({ electionId: id });
      setData(res?.electionInfo || res);
    } catch (e) { setError(e?.data?.message || e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    // Guard against invalid id
    if (!id || id === "undefined" || id === "null") {
      setError("Invalid election id.");
      setLoading(false);
      return;
    }
    fetchElection();
  }, [id, authLoading, isAuthenticated]);

  useEffect(() => { if (error) notifyError(error); }, [error, notifyError]);
  useEffect(() => { if (message) notifySuccess(message); }, [message, notifySuccess]);

  async function onDelete() {
    if (!confirm("Delete this election?")) return;
    try {
      await api.deleteElection({ electionId: id });
      router.replace("/dashboard");
    } catch (e) { setError(e?.data?.message || e.message); }
  }

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
      let h12 = h24 % 12; if (h12 === 0) h12 = 12;
      const hh = String(h12).padStart(2, "0");
      return `${dd}/${mm}/${yyyy} - ${hh}:${mi} ${suffix}`;
    } catch { return String(dt); }
  }

  return (
    <AuthGuard>
  <div className="rounded-2xl border-[0.5px] border-black dark:border-white bg-white/50 dark:bg-neutral-900/30 backdrop-blur-2xl shadow-sm p-5 sm:p-6 relative overflow-hidden text-black dark:text-white">
        <div className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 bg-white/30 dark:bg-white/10 blur-3xl rounded-full animate-float" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 bg-black/10 dark:bg-white/10 blur-3xl rounded-full animate-float-delayed" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-inherit">Election Details</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={fetchElection} disabled={loading}>Refresh</Button>
            <Button variant="danger" onClick={onDelete} disabled={loading || !data}>Delete</Button>
          </div>
        </div>

  {/* Inline alerts removed in favor of global notifications */}

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner size={18} />
            <span className="sr-only">Loading</span>
          </div>
        ) : !data ? (
          <div className="text-center py-8 text-inherit">{error || "Election not found"}</div>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="rounded-lg border-[0.5px] border-black/20 dark:border-white/20 p-4 bg-white/50 dark:bg-neutral-900/30">
              <div className="font-medium text-inherit text-lg mb-1">{data.electionName || "Untitled"}</div>
              <div className="text-inherit opacity-80">{data.electionDescription || "No description"}</div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
                <div className="text-xs text-inherit opacity-70 mb-1">Start Time</div>
                <div className="font-medium text-inherit">{fmtWithTime(data.startTime)}</div>
              </div>
              <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
                <div className="text-xs text-inherit opacity-70 mb-1">End Time</div>
                <div className="font-medium text-inherit">{fmtWithTime(data.endTime)}</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
                <div className="text-xs text-inherit opacity-70 mb-1">Poll Type</div>
                <div className="font-medium text-inherit">{data.electionLayout?.pollType === "radio" ? "Single vote" : "Multiple vote"}</div>
              </div>
              <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
                <div className="text-xs text-inherit opacity-70 mb-1">Page Layout</div>
                <div className="font-medium text-inherit">{data.electionLayout?.electionCardId === "grid" || data.electionLayout?.electionCardId === 1 ? "Grid" : data.electionLayout?.electionCardId === "list" || data.electionLayout?.electionCardId === 2 ? "List" : (data.electionLayout?.electionCardId || "-")}</div>
              </div>
              <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30 sm:col-span-2">
                <div className="text-xs text-inherit opacity-70 mb-1">Election Access</div>
                <div className="font-medium text-inherit">{data.isOpen ? "Open" : "Closed"}</div>
                {data.isOpen && (
                  <div className="mt-2 text-xs">
                    <span className="opacity-70 mr-1">Open voting link:</span>
                    <a
                      className="underline decoration-dotted underline-offset-2 break-all"
                      href={`${data.openElectionLink || `https://ballotguard.vercel.app/election/open/${id}`}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {(data.openElectionLink || "https://ballotguard.vercel.app/election/open/" + id)}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
              <div className="text-xs text-inherit opacity-70 mb-2">Options ({data.options?.length || 0})</div>
              <div className="space-y-1">
                {data.options && data.options.length > 0 ? (
                  data.options.map((o, idx) => (
                    <div key={o.optionId || idx} className="text-inherit">{idx + 1}. {o.optionName}</div>
                  ))
                ) : (
                  <div className="text-inherit opacity-60">No options added</div>
                )}
              </div>
            </div>

            <div className="rounded-md border-[0.5px] border-black/20 dark:border-white/20 p-3 bg-white/50 dark:bg-neutral-900/30">
              <div className="text-xs text-inherit opacity-70 mb-2">Voters ({data.voters?.length || 0})</div>
              <div className="space-y-1">
                {data.voters && data.voters.length > 0 ? (
                  data.voters.map((v, idx) => (
                    <div key={v.voterEmail || idx} className="text-inherit">{idx + 1}. {v.voterEmail}</div>
                  ))
                ) : (
                  <div className="text-inherit opacity-60">No voters added</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
