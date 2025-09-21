"use client";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { api } from "@/lib/api";
import { storage, TOKEN_KEYS } from "@/lib/storage";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Spinner";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { notifyError, notifySuccess } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    (async () => {
      try {
        const res = await api.getUserSettings();
        setSettings(res?.userSettings || null);
        
        // Get user name from current user context or localStorage
        let name = user?.name || "";
        if (!name && user?.firstName && user?.lastName) {
          name = `${user.firstName} ${user.lastName}`;
        }
        if (!name) {
          const userData = storage.get(TOKEN_KEYS.user);
          name = userData?.name || "";
          if (!name && userData?.firstName && userData?.lastName) {
            name = `${userData.firstName} ${userData.lastName}`;
          }
        }
        setUserName(name);
      } catch (e) {
        setError(e?.data?.message || e.message);
      } finally { setLoading(false); }
    })();
  }, [authLoading, isAuthenticated, user]);

  async function saveSettings() {
    setError(""); setMessage("");
    try {
      // Detect current theme from the document
      const isDark = document.documentElement.classList.contains('dark');
      const currentTheme = isDark ? 'Dark' : 'Light';
      
      // Include current theme in the settings payload
      const settingsWithTheme = { ...settings, preferredTheme: currentTheme };
      
      const res = await api.updateUserSettings(settingsWithTheme);
      setSettings(res?.userSettings || settingsWithTheme);
      setMessage(res.message || "Settings saved");
    } catch (e) { setError(e?.data?.message || e.message); }
  }

  async function resetPassword() {
    setError(""); setMessage("");
    try {
      const res = await api.resetPasswordLoggedIn(passwords);
      setMessage(res.message || "Password updated");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (e) { setError(e?.data?.message || e.message); }
  }

  useEffect(() => { if (error) notifyError(error); }, [error, notifyError]);
  useEffect(() => { if (message) notifySuccess(message); }, [message, notifySuccess]);

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto min-h-[70vh] flex flex-col justify-center items-center space-y-6 text-black dark:text-white">
        <h1 className="text-2xl font-bold text-center">Profile</h1>
  {/* Inline alerts removed; using notifications */}
        {loading ? (
          <div className="flex items-center justify-center py-10"><Spinner size={24} /><span className="sr-only">Loading</span></div>
        ) : settings ? (
          <>
            <section className="space-y-4 w-full flex flex-col items-center">
              <div className="w-full max-w-md">
                <label className="block text-sm font-medium mb-1">Name</label>
                <div className="text-base text-gray-700 dark:text-gray-300">{userName || "No name set"}</div>
              </div>
              <div className="w-full max-w-md">
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="text-base text-gray-700 dark:text-gray-300">{settings.userEmail || "No email set"}</div>
              </div>
              <label className="w-full max-w-md text-sm font-medium mb-1">Language
                <select className="mt-1 block w-full rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-neutral-900/60 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={settings.preferredLanguage || "English"} onChange={(e) => setSettings({ ...settings, preferredLanguage: e.target.value })}>
                  <option>English</option>
                </select>
              </label>
              <label className="flex items-center gap-3 text-base font-medium select-none w-full max-w-md">
                <input type="checkbox" checked={!!settings.pushNotificationsEnabled} onChange={(e) => setSettings({ ...settings, pushNotificationsEnabled: e.target.checked })}
                  className="sr-only peer" />
                <span className="inline-flex h-7 w-7 items-center justify-center border-2 border-black/30 dark:border-white/40 rounded-lg bg-white dark:bg-neutral-900/60">
                  {settings.pushNotificationsEnabled && (
                    <svg className="h-5 w-5 text-indigo-600 dark:text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="5 10 9 14 15 6" />
                    </svg>
                  )}
                </span>
                Push notifications
              </label>
              <label className="flex items-center gap-3 text-base font-medium select-none w-full max-w-md">
                <input type="checkbox" checked={!!settings.emailNotificationsEnabled} onChange={(e) => setSettings({ ...settings, emailNotificationsEnabled: e.target.checked })}
                  className="sr-only peer" />
                <span className="inline-flex h-7 w-7 items-center justify-center border-2 border-black/30 dark:border-white/40 rounded-lg bg-white dark:bg-neutral-900/60">
                  {settings.emailNotificationsEnabled && (
                    <svg className="h-5 w-5 text-indigo-600 dark:text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="5 10 9 14 15 6" />
                    </svg>
                  )}
                </span>
                Email notifications
              </label>
              <Button onClick={saveSettings} className="w-full max-w-md">Save</Button>
            </section>

            <section className="space-y-4 pt-8 border-t border-black/10 dark:border-white/10 w-full flex flex-col items-center">
              <h2 className="font-semibold text-lg text-center">Change password</h2>
              <Input label="Old password" type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} className="w-full max-w-md" />
              <Input label="New password" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full max-w-md" />
              <Button onClick={resetPassword} className="w-full max-w-md">Update password</Button>
            </section>
          </>
        ) : <div className="text-center">No settings found.</div>}
      </div>
    </AuthGuard>
  );
}
