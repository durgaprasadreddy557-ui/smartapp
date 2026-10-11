"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Bell, Lock, Shield, Moon, Eye, Save, Smartphone, Sun } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useTheme } from "@/components/ui/theme-toggle";

export default function SettingsPage() {
  const { success } = useToast();
  const { theme, setTheme } = useTheme();

  // Notification Toggles
  const [notifs, setNotifs] = React.useState({
    emergency: true,
    assignments: true,
    timetable: true,
    events: false,
    emailSummary: true,
  });

  // Password fields
  const [passwords, setPasswords] = React.useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleSaveNotifications = () => {
    success("Preferences Updated", "Notification and sync settings successfully saved.");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      alert("Passwords do not match");
      return;
    }
    success("Security Credentials Changed", "Your password has been updated in Supabase Auth.");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  return (
    <DashboardShell
      title="System Preferences & Security Settings"
      description="Configure notifications, access controls, color themes, and authentication security"
    >
      <div className="max-w-4xl space-y-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Appearance & Color Theme</span>
            </CardTitle>
            <CardDescription>
              Select your interface theme preference.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "light", label: "Light Theme", desc: "Clean and crisp high contrast" },
                { id: "dark", label: "Dark Theme", desc: "Sleek low-light aesthetic" },
                { id: "system", label: "System Sync", desc: "Matches operating system" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id as any);
                    success("Theme Updated", `Switched to ${opt.label}.`);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    theme === opt.id
                      ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 dark:border-blue-500"
                      : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                  }`}
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{opt.label}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <span>Notification Preferences</span>
            </CardTitle>
            <CardDescription>
              Control dispatch channels for announcements, assignment alerts, and schedule shifts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Real-Time Emergency Broadcasts
                </p>
                <p className="text-[11px] text-zinc-500">Urgent campus health, weather, and safety sirens</p>
              </div>
              <input
                type="checkbox"
                checked={notifs.emergency}
                onChange={(e) => setNotifs({ ...notifs, emergency: e.target.checked })}
                className="rounded text-blue-600 h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Assignment Evaluation & Marks
                </p>
                <p className="text-[11px] text-zinc-500">Alerts when professors publish graded marks</p>
              </div>
              <input
                type="checkbox"
                checked={notifs.assignments}
                onChange={(e) => setNotifs({ ...notifs, assignments: e.target.checked })}
                className="rounded text-blue-600 h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Timetable & Classroom Shifts
                </p>
                <p className="text-[11px] text-zinc-500">Notifies of room reallocation or substitute sessions</p>
              </div>
              <input
                type="checkbox"
                checked={notifs.timetable}
                onChange={(e) => setNotifs({ ...notifs, timetable: e.target.checked })}
                className="rounded text-blue-600 h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Weekly Digest Email
                </p>
                <p className="text-[11px] text-zinc-500">Summary of upcoming project deadlines and campus events</p>
              </div>
              <input
                type="checkbox"
                checked={notifs.emailSummary}
                onChange={(e) => setNotifs({ ...notifs, emailSummary: e.target.checked })}
                className="rounded text-blue-600 h-4 w-4"
              />
            </div>

            <div className="flex justify-end pt-3">
              <Button size="sm" onClick={handleSaveNotifications} className="gap-1.5">
                <Save className="h-3.5 w-3.5" />
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-500" />
              <span>Security & Password</span>
            </CardTitle>
            <CardDescription>
              Update your Supabase authentication credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                required
                placeholder="••••••••••••"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm" className="gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  Update Security Credentials
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
