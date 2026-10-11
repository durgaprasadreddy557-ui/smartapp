"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/state-views";
import { Bell, AlertTriangle, Pin, Calendar, Radio, Plus, Trash2, Edit3, Search } from "lucide-react";
import {
  getAnnouncementsAction,
  createAnnouncementAction,
  deleteAnnouncementAction,
} from "@/actions/announcements";

export default function AnnouncementsPage() {
  const { success, error } = useToast();
  const [announcements, setAnnouncements] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");

  // Create Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    content: "",
    category: "Academic",
    urgency: "normal" as "normal" | "important" | "emergency",
    targetAudience: "all" as "all" | "students" | "faculty",
    pinned: false,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchAnnouncements = React.useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getAnnouncementsAction();
      if (res.success && res.data) {
        setAnnouncements(res.data);
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createAnnouncementAction(formData);
      if (res.success) {
        success("Broadcast Published", "Announcement distributed across campus channels.");
        setModalOpen(false);
        setFormData({
          title: "",
          content: "",
          category: "Academic",
          urgency: "normal",
          targetAudience: "all",
          pinned: false,
        });
        fetchAnnouncements();
      } else {
        error("Publish Failed", res.message || "Please check inputs.");
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteAnnouncementAction(id);
      if (res.success) {
        success("Announcement Removed");
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      } else {
        error("Deletion Failed", res.message);
      }
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const filtered = announcements.filter((a) => {
    const matchCat = categoryFilter === "All" || a.category === categoryFilter;
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <DashboardShell
      title="Campus Circulars & Announcements"
      description="Official university notices, emergency broadcasts, and department advisories"
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="info" className="gap-1.5 py-1 hidden sm:inline-flex">
            <Radio className="h-3 w-3 animate-pulse text-blue-500" />
            <span>Supabase Realtime Channel</span>
          </Badge>
          <Button size="sm" onClick={() => setModalOpen(true)} className="gap-1.5 shadow-sm shadow-blue-500/20">
            <Plus className="h-4 w-4" />
            <span>New Announcement</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/60 backdrop-blur-md">
          <div className="flex items-center gap-1.5 flex-wrap">
            {["All", "Academic", "Examinations", "Events", "Hostel"].map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  categoryFilter === c
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
        </div>

        {/* State Views */}
        {loading ? (
          <LoadingState message="Fetching live announcements from Supabase PostgreSQL..." />
        ) : hasError ? (
          <ErrorState onRetry={fetchAnnouncements} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Announcements Found"
            description="There are no broadcast notices matching your filter criteria."
            actionLabel="Post New Notice"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <Card
                key={item.id}
                className={`transition-all hover:border-blue-500/40 ${
                  item.pinned || item.urgency === "emergency"
                    ? "border-l-4 border-l-rose-500 bg-rose-50/20 dark:bg-rose-950/10"
                    : item.urgency === "important"
                    ? "border-l-4 border-l-amber-500"
                    : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={
                          item.urgency === "emergency"
                            ? "danger"
                            : item.urgency === "important"
                            ? "warning"
                            : "info"
                        }
                      >
                        {item.category}
                      </Badge>
                      {item.pinned && (
                        <Badge variant="outline" className="gap-1 text-rose-600 border-rose-300">
                          <Pin className="h-3 w-3" />
                          <span>Pinned</span>
                        </Badge>
                      )}
                      <span className="text-[11px] text-zinc-400">
                        Audience: <strong className="capitalize">{item.target_audience || "all"}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-xs text-zinc-400 hidden sm:inline">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-2"
                        aria-label="Delete announcement"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* New Announcement Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast Campus Announcement"
        description="Creates announcement record in PostgreSQL and pushes to Supabase Realtime channel"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Announcement Title"
            required
            placeholder="e.g. Schedule for Mid-Term Assessments"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Academic</option>
                <option>Examinations</option>
                <option>Events</option>
                <option>Hostel</option>
                <option>Campus Life</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Urgency Level</label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
              >
                <option value="normal">Normal Information</option>
                <option value="important">Important Priority</option>
                <option value="emergency">Emergency Alert</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Full Content</label>
            <textarea
              required
              rows={4}
              placeholder="Provide complete circular details, dates, and instructions..."
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinnedCheck"
              checked={formData.pinned}
              onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
              className="rounded text-blue-600 h-4 w-4"
            />
            <label htmlFor="pinnedCheck" className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
              Pin to top of campus dashboard
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Broadcast"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
