"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Building2,
  Activity,
  AlertTriangle,
  Server,
  Database,
  Radio,
  ArrowRight,
  UserCheck,
  GraduationCap,
  Bell,
  Calendar,
  MessageSquare,
  BarChart3,
  Clock,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CampusActivityChart } from "@/components/dashboard/campus-stats-chart";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function AdminDashboardPage() {
  const { success, warning } = useToast();
  const [emergencyModalOpen, setEmergencyModalOpen] = React.useState(false);
  const [broadcastTitle, setBroadcastTitle] = React.useState("");
  const [broadcastMessage, setBroadcastMessage] = React.useState("");

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setEmergencyModalOpen(false);
    warning("EMERGENCY BROADCAST TRANSMITTED", `Campus-wide notification pushed: "${broadcastTitle}"`);
    setBroadcastTitle("");
    setBroadcastMessage("");
  };

  return (
    <DashboardShell
      title="Admin Command & Operations Console"
      description="Campus-wide operations, security alerts, and system health monitoring"
      actions={
        <div className="flex gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setEmergencyModalOpen(true)}
            className="gap-1.5"
          >
            <Radio className="h-4 w-4" />
            <span>Broadcast Emergency</span>
          </Button>
          <Link href="/dashboard/admin/analytics">
            <Button variant="outline" size="sm" className="gap-1.5">
              <BarChart3 className="h-4 w-4" />
              <span>Full Analytics</span>
            </Button>
          </Link>
        </div>
      }
    >
      {/* High Level Operations Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Enrolled</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">4,820</h3>
              <p className="text-[11px] text-zinc-500 mt-1">Across 8 Departments</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Faculty Staff</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">264</h3>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">98% On-Campus Active</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <UserCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Facilities Status</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">48 / 52</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Operational & Cleared</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <Building2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Active Grievances</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">12 Open</h3>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-medium">8 Under Review</p>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl">
              <MessageSquare className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Modules Quick Launch */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Admin Governance Sub-Modules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { title: "User Directory", href: "/dashboard/admin/users", icon: Users, color: "text-blue-600" },
            { title: "Students", href: "/dashboard/admin/students", icon: GraduationCap, color: "text-indigo-600" },
            { title: "Faculty", href: "/dashboard/admin/faculty", icon: UserCheck, color: "text-amber-600" },
            { title: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3, color: "text-emerald-600" },
            { title: "Announcements", href: "/announcements", icon: Bell, color: "text-purple-600" },
            { title: "Feedback", href: "/feedback", icon: MessageSquare, color: "text-rose-600" },
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                href={mod.href}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-zinc-200/80 bg-white/70 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 transition-all text-center group"
              >
                <Icon className={`h-5 w-5 mb-1.5 ${mod.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{mod.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Analytics & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Realtime Campus Operations Throughput</CardTitle>
                <CardDescription className="text-xs">Daily active transactions and portal usage</CardDescription>
              </div>
              <Badge variant="outline">Live Stream</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CampusActivityChart />
          </CardContent>
        </Card>

        {/* Cloud Infrastructure Health */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base">System Health & Latency</CardTitle>
            <CardDescription className="text-xs">Database, Auth & Realtime Channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">PostgreSQL Engine</span>
                </div>
                <Badge variant="success">Healthy • 12ms</Badge>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">Supabase Auth SSR</span>
                </div>
                <Badge variant="success">Operational</Badge>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">Realtime WebSockets</span>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Storage Buckets</span>
                </div>
                <Badge variant="info">3 Buckets Active</Badge>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 p-3 text-[11px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40">
              Zero security vulnerabilities reported in last 24h cycle. All PostgreSQL RLS tables verified.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Broadcast Modal */}
      <Modal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        title="Trigger Emergency Broadcast Siren"
        description="Pushes high-priority alerts to all Student, Faculty, and Staff devices simultaneously."
      >
        <form onSubmit={handleBroadcastAlert} className="space-y-4">
          <Input
            label="Emergency Title"
            required
            placeholder="e.g. Severe Weather Campus Advisory"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Severity Level
            </label>
            <select className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900">
              <option>Level 3: Critical / Immediate Action Required</option>
              <option>Level 2: Urgent Campus Operational Notice</option>
              <option>Level 1: General Safety Advisory</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Broadcast Message
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide exact instructions for building evacuation, class suspension, or emergency assembly..."
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEmergencyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger">
              Transmit Siren Broadcast
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
