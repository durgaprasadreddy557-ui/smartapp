"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, MapPin, Clock, BookOpen, Search, Calendar, Phone, MessageSquare } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/state-views";
import { getFacultyDirectoryAction } from "@/actions/profiles";

export default function FacultyDirectoryPage() {
  const { success, error } = useToast();
  const [facultyList, setFacultyList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Consultation Modal
  const [selectedProf, setSelectedProf] = React.useState<any | null>(null);
  const [appointmentSlot, setAppointmentSlot] = React.useState("Next Available Office Hour");
  const [agenda, setAgenda] = React.useState("");

  const fetchFaculty = React.useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getFacultyDirectoryAction();
      if (res.success && res.data) {
        setFacultyList(res.data);
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
    fetchFaculty();
  }, [fetchFaculty]);

  const handleBookOfficeHour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProf) return;
    success("Consultation Booked", `Office hours confirmed with ${selectedProf.full_name || selectedProf.name} (${appointmentSlot}).`);
    setSelectedProf(null);
    setAgenda("");
  };

  const filtered = facultyList.filter((f) => {
    const name = f.full_name || f.name || "";
    const designation = f.faculty_profile?.designation || f.designation || "";
    const dept = f.department || f.dept || "";
    const cabin = f.faculty_profile?.office_location || f.cabin || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      designation.toLowerCase().includes(search.toLowerCase()) ||
      dept.toLowerCase().includes(search.toLowerCase()) ||
      cabin.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <DashboardShell
      title="Faculty Directory & Consultation"
      description="Connect with professors, inspect research specializations, and schedule office hours"
      actions={
        <div className="relative">
          <input
            type="text"
            placeholder="Search faculty, topic, cabin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          />
        </div>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <LoadingState message="Fetching faculty directory from PostgreSQL profiles..." />
        ) : hasError ? (
          <ErrorState onRetry={fetchFaculty} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Faculty Found"
            description="No faculty members match your query."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((f) => {
              const name = f.full_name || f.name || "Faculty Member";
              const designation = f.faculty_profile?.designation || f.designation || "Professor";
              const dept = f.department || f.dept || "Computer Science & Engineering";
              const email = f.email || "faculty@campus.edu";
              const cabin = f.faculty_profile?.office_location || f.cabin || "Faculty Wing • Room 301";
              const hours = f.faculty_profile?.office_hours || f.officeHours || "Mon & Wed: 03:00 - 05:00 PM";
              const research = f.faculty_profile?.research_interests || f.research || ["Computer Science", "Algorithms"];

              return (
                <Card key={f.id || email} className="hover:border-blue-500/40 transition-all flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{name}</CardTitle>
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                          {designation}
                        </p>
                        <p className="text-[11px] text-zinc-400">{dept}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs dark:bg-blue-500/20 dark:text-blue-400">
                        {name.charAt(0)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{cabin}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{hours}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Focus & Research
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {research.map((r: string) => (
                          <span
                            key={r}
                            className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-medium"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2 border-t border-zinc-100 dark:border-zinc-800">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-1/2 gap-1.5 text-xs"
                        onClick={() => {
                          navigator.clipboard?.writeText?.(email);
                          success("Email Copied", `${email} copied to clipboard.`);
                        }}
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Copy Email
                      </Button>
                      <Button
                        size="sm"
                        className="w-1/2 gap-1.5 text-xs shadow-sm shadow-blue-500/20"
                        onClick={() => setSelectedProf(f)}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        Book Slot
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Book Office Hour Modal */}
      {selectedProf && (
        <Modal
          isOpen={!!selectedProf}
          onClose={() => setSelectedProf(null)}
          title={`Book Consultation: ${selectedProf.full_name || selectedProf.name}`}
          description={`Office Location: ${selectedProf.faculty_profile?.office_location || selectedProf.cabin || "Tech Block A"}`}
        >
          <form onSubmit={handleBookOfficeHour} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Select Preferred Slot
              </label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={appointmentSlot}
                onChange={(e) => setAppointmentSlot(e.target.value)}
              >
                <option>Next Regular Office Hour (Mon/Wed 03:00 PM)</option>
                <option>Project Guidance Slot (Fri 04:00 PM)</option>
                <option>Academic Doubts Clinic (Next Class)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Brief Agenda / Query
              </label>
              <textarea
                required
                rows={3}
                placeholder="Mention the subject or research doubt you wish to discuss..."
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setSelectedProf(null)}>
                Cancel
              </Button>
              <Button type="submit">Confirm Consultation</Button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardShell>
  );
}
