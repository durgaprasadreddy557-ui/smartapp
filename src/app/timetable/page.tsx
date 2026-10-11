"use client";

import * as React from "react";
import {
  Clock,
  Calendar,
  Building2,
  User,
  Filter,
  Plus,
  BookOpen,
  MapPin,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/state-views";
import { getTimetableAction, createTimetableSlotAction, deleteTimetableSlotAction } from "@/actions/academics";

export default function TimetablePage() {
  const { success, error } = useToast();
  const [slots, setSlots] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<string>("All");
  const [selectedType, setSelectedType] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // New slot form state
  const [newSlot, setNewSlot] = React.useState({
    courseId: "00000000-0000-0000-0000-000000000001",
    dayOfWeek: "Monday" as any,
    startTime: "09:00",
    endTime: "10:30",
    roomNumber: "Lab 302",
    sessionType: "Lecture" as any,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const fetchTimetable = React.useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getTimetableAction(selectedDay);
      if (res.success && res.data) {
        setSlots(res.data);
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [selectedDay]);

  React.useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createTimetableSlotAction(newSlot);
      if (res.success) {
        success("Timetable Slot Staged", `Schedule slot added for ${newSlot.dayOfWeek}.`);
        setIsModalOpen(false);
        fetchTimetable();
      } else {
        error("Submission Failed", res.message || "Please check inputs.");
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      const res = await deleteTimetableSlotAction(id);
      if (res.success) {
        success("Timetable Slot Removed");
        setSlots((prev) => prev.filter((s) => s.id !== id));
      } else {
        error("Deletion Failed", res.message);
      }
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const filteredSlots = slots.filter((item) => {
    const matchesDay = selectedDay === "All" || item.day_of_week === selectedDay;
    const matchesType = selectedType === "All" || item.session_type === selectedType;
    const courseTitle = item.course?.title || item.name || "";
    const courseCode = item.course?.code || item.code || "";
    const facultyName = item.faculty?.full_name || item.faculty || "";
    const room = item.room_number || item.room || "";

    const matchesSearch =
      courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDay && matchesType && matchesSearch;
  });

  return (
    <DashboardShell
      title="Academic Timetable & Lecture Schedule"
      description="Department of Computer Science & Engineering • Semester 6 (Fall 2026)"
      actions={
        <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 shadow-sm shadow-blue-500/20">
          <Plus className="h-4 w-4" />
          Add Schedule Slot
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filters and Search Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/60 backdrop-blur-md">
          {/* Day selection pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedDay === day
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Search & Type filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="All">All Types</option>
              <option value="Lecture">Lecture</option>
              <option value="Lab">Lab Session</option>
              <option value="Tutorial">Tutorial</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search subject, prof, room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-56 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              />
            </div>
          </div>
        </div>

        {/* State Views */}
        {loading ? (
          <LoadingState message="Loading dynamic lecture schedule from PostgreSQL..." />
        ) : hasError ? (
          <ErrorState onRetry={fetchTimetable} />
        ) : filteredSlots.length === 0 ? (
          <EmptyState
            title="No Slots Scheduled"
            description="There are no classes scheduled for the selected filters."
            actionLabel="Add Class Slot"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day & Time</TableHead>
                <TableHead>Course Code & Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Faculty Instructor</TableHead>
                <TableHead>Venue / Room</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSlots.map((slot) => {
                const courseCode = slot.course?.code || slot.code || "CS601";
                const courseTitle = slot.course?.title || slot.name || "Lecture Session";
                const faculty = slot.faculty?.full_name || slot.faculty || "Faculty Instructor";
                const room = slot.room_number || slot.room || "Room 101";
                const time = slot.start_time && slot.end_time ? `${slot.start_time} - ${slot.end_time}` : slot.time || "09:00 - 10:30 AM";
                const day = slot.day_of_week || slot.day || "Monday";
                const sessionType = slot.session_type || slot.type || "Lecture";

                return (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{day}</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 block ml-5">{time}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          {courseCode}
                        </span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{courseTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sessionType === "Lecture"
                            ? "info"
                            : sessionType === "Lab"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {sessionType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs">
                        <User className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{faculty}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{room}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-600 dark:text-blue-400"
                          onClick={() => success("Schedule Sync", `Reminders set for ${courseTitle}`)}
                        >
                          Sync Alert
                        </Button>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          aria-label="Remove slot"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Request Slot Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Schedule Slot"
        description="Creates lecture slot in PostgreSQL timetable table"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Target Day</label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={newSlot.dayOfWeek}
                onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value as any })}
              >
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Session Type</label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={newSlot.sessionType}
                onChange={(e) => setNewSlot({ ...newSlot, sessionType: e.target.value as any })}
              >
                <option>Lecture</option>
                <option>Lab</option>
                <option>Tutorial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              required
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            />
            <Input
              label="End Time"
              type="time"
              required
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            />
          </div>

          <Input
            label="Room Number / Lab Hall"
            required
            placeholder="e.g. Lab 302 or Hall 401"
            value={newSlot.roomNumber}
            onChange={(e) => setNewSlot({ ...newSlot, roomNumber: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Committing..." : "Commit Slot"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
