"use client";
import { useEffect, useState } from "react";
import { AuthGuard } from "../../components/AuthGuard";
import { api } from "../../lib/api";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    (async () => {
      try {
        const res = await api.getUserSettings();
        setSettings(res?.userSettings || null);
      } catch (e) { setError(e?.data?.message || e.message); }
      finally { setLoading(false); }
    })();
  }, [authLoading, isAuthenticated]);

  async function saveSettings() {
    setError(""); setMessage("");
    try {
      const res = await api.updateUserSettings(settings);
      setSettings(res?.userSettings || settings);
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

  return (
    <AuthGuard>
      <div className="max-w-xl space-y-6">
        <h1 className="text-xl font-semibold">Settings</h1>
        {message && <Alert type="success" message={message} />}
        {error && <Alert type="error" message={error} />}

        {loading ? <div>Loading...</div> : settings ? (
          <>
            <section className="space-y-3">
              <Input label="Email" value={settings.userEmail || ""} onChange={(e) => setSettings({ ...settings, userEmail: e.target.value })} />
              <Select label="Language" value={settings.preferredLanguage || "English"} onChange={(e) => setSettings({ ...settings, preferredLanguage: e.target.value })}>
                <option>English</option>
                <option>Spanish</option>
              </Select>
              <Select label="Theme" value={settings.preferredTheme || "Light"} onChange={(e) => setSettings({ ...settings, preferredTheme: e.target.value })}>
                <option>Light</option>
                <option>Dark</option>
              </Select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!settings.pushNotificationsEnabled} onChange={(e) => setSettings({ ...settings, pushNotificationsEnabled: e.target.checked })} />
                Push notifications
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!settings.emailNotificationsEnabled} onChange={(e) => setSettings({ ...settings, emailNotificationsEnabled: e.target.checked })} />
                Email notifications
              </label>
              <Button onClick={saveSettings}>Save</Button>
            </section>

            <section className="space-y-3 pt-6 border-t">
              <h2 className="font-medium">Change password</h2>
              <Input label="Old password" type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} />
              <Input label="New password" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
              <Button onClick={resetPassword}>Update password</Button>
            </section>
          </>
        ) : <div>No settings found.</div>}
      </div>
    </AuthGuard>
  );
}
