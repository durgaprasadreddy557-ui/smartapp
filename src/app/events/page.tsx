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
import { Calendar, MapPin, Users, Clock, Plus, Trash2, CheckCircle2, Ticket } from "lucide-react";
import {
  getEventsAction,
  createEventAction,
  deleteEventAction,
  rsvpEventAction,
} from "@/actions/announcements";

export default function EventsPage() {
  const { success, error } = useToast();
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Create Event Modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    venue: "",
    organizer: "",
    category: "Academic",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchEvents = React.useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getEventsAction();
      if (res.success && res.data) {
        setEvents(res.data);
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
    fetchEvents();
  }, [fetchEvents]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createEventAction(formData);
      if (res.success) {
        success("Event Scheduled", "New campus activity created and added to university calendar.");
        setModalOpen(false);
        setFormData({
          title: "",
          description: "",
          startTime: "",
          endTime: "",
          venue: "",
          organizer: "",
          category: "Academic",
        });
        fetchEvents();
      } else {
        error("Submission Failed", res.message || "Please check required fields.");
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteEventAction(id);
      if (res.success) {
        success("Event Deleted");
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
      } else {
        error("Deletion Failed", res.message);
      }
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const handleRSVP = async (id: string) => {
    try {
      const res = await rsvpEventAction(id);
      if (res.success) {
        success("RSVP Confirmed", "Your seat is registered! Digital badge sent to notification center.");
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === id ? { ...ev, rsvp_count: (ev.rsvp_count || 0) + 1 } : ev
          )
        );
      } else {
        error("RSVP Failed", res.message);
      }
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const filtered = events.filter((e) => {
    return (
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase()) ||
      e.organizer.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <DashboardShell
      title="Campus Events & Activities"
      description="Upcoming symposiums, hackathons, seminars, and student club activities"
      actions={
        <Button size="sm" onClick={() => setModalOpen(true)} className="gap-1.5 shadow-sm shadow-blue-500/20">
          <Plus className="h-4 w-4" />
          <span>Schedule Event</span>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/60 backdrop-blur-md">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search events by title, venue, organizer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
          <div className="text-xs text-zinc-500">
            Total Activities: <strong className="text-zinc-800 dark:text-zinc-200">{filtered.length}</strong>
          </div>
        </div>

        {/* State Views */}
        {loading ? (
          <LoadingState message="Fetching campus activities calendar..." />
        ) : hasError ? (
          <ErrorState onRetry={fetchEvents} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Events Scheduled"
            description="There are currently no events matching your query."
            actionLabel="Schedule Event"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((e) => (
              <Card key={e.id} className="flex flex-col justify-between hover:border-blue-500/50 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="info">{e.category}</Badge>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {e.rsvp_count || 0} Attending
                      </span>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        aria-label="Delete event"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <CardTitle className="text-base font-bold">{e.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed mt-1">
                    {e.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      <span>{new Date(e.start_time).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{e.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Organized by: <strong className="text-zinc-700 dark:text-zinc-300">{e.organizer}</strong></span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                    <Button
                      size="sm"
                      className="w-full gap-1.5 text-xs shadow-sm shadow-blue-500/20"
                      onClick={() => handleRSVP(e.id)}
                    >
                      <Ticket className="h-3.5 w-3.5" />
                      <span>RSVP Attending</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Event Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Campus Event"
        description="Creates official event record in PostgreSQL events table"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Event Title"
            required
            placeholder="e.g. AI & Quantum Computing Symposium"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Outline event agenda, key speakers, and prerequisites..."
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="datetime-local"
              required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
            <Input
              label="End Time"
              type="datetime-local"
              required
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Venue / Location"
              required
              placeholder="e.g. Central Auditorium"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
            <Input
              label="Organizer / Club"
              required
              placeholder="e.g. ACM Student Chapter"
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
            <select
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Academic</option>
              <option>Tech Competition</option>
              <option>Cultural</option>
              <option>Career & Placement</option>
              <option>Sports</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Confirm & Schedule"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
