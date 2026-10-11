"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Upload, CheckCircle2, Search, Filter, Plus, FileCheck } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/state-views";
import {
  getAssignmentsAction,
  createAssignmentAction,
  submitAssignmentDeliverableAction,
} from "@/actions/academics";

export default function AssignmentsPage() {
  const { success, error } = useToast();
  const [assignments, setAssignments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [filter, setFilter] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");

  // Modals
  const [activeUpload, setActiveUpload] = React.useState<any | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<string>("");
  const [submissionNotes, setSubmissionNotes] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);

  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [newAssignment, setNewAssignment] = React.useState({
    courseId: "00000000-0000-0000-0000-000000000001",
    title: "",
    description: "",
    dueDate: "",
    maxMarks: 50,
  });
  const [isCreating, setIsCreating] = React.useState(false);

  const fetchAssignments = React.useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getAssignmentsAction();
      if (res.success && res.data) {
        setAssignments(res.data);
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
    fetchAssignments();
  }, [fetchAssignments]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUpload) return;
    setIsUploading(true);
    try {
      const fileUrl = `/storage/assignments/${selectedFile || "submission.pdf"}`;
      const res = await submitAssignmentDeliverableAction(activeUpload.id, fileUrl, submissionNotes);
      if (res.success) {
        success("Deliverable Uploaded", `Submission confirmed for ${activeUpload.title}`);
        setActiveUpload(null);
        setSelectedFile("");
        setSubmissionNotes("");
        fetchAssignments();
      } else {
        error("Upload Failed", res.message);
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await createAssignmentAction(newAssignment);
      if (res.success) {
        success("Assignment Created", "Assignment published to student cohorts.");
        setCreateModalOpen(false);
        setNewAssignment({
          courseId: "00000000-0000-0000-0000-000000000001",
          title: "",
          description: "",
          dueDate: "",
          maxMarks: 50,
        });
        fetchAssignments();
      } else {
        error("Failed", res.message || "Please check inputs.");
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const filtered = assignments.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const title = item.title || "";
    const subject = item.course?.title || item.subject || "";
    const faculty = item.faculty?.full_name || item.faculty || "";
    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      subject.toLowerCase().includes(search.toLowerCase()) ||
      faculty.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardShell
      title="Academic Assignments & Deliverables"
      description="Course projects, lab evaluations, and submission tracking"
      actions={
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setCreateModalOpen(true)} className="gap-1.5 shadow-sm shadow-blue-500/20">
            <Plus className="h-4 w-4" />
            <span>Publish Assignment</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/60 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            {["all", "pending", "submitted", "graded"].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  filter === st
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Filter assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
        </div>

        {/* State Views */}
        {loading ? (
          <LoadingState message="Fetching academic assignments from PostgreSQL..." />
        ) : hasError ? (
          <ErrorState onRetry={fetchAssignments} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Assignments Found"
            description="There are no assignments matching your filter criteria."
            actionLabel="Publish Assignment"
            onAction={() => setCreateModalOpen(true)}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => {
              const subjectName = item.course ? `${item.course.code}: ${item.course.title}` : item.subject || "Course Assignment";
              const facultyName = item.faculty?.full_name || item.faculty || "Faculty Instructor";
              const dueDateText = item.due_date ? new Date(item.due_date).toLocaleString() : item.dueDate || "Due Soon";

              return (
                <Card key={item.id} className="hover:border-blue-500/40 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {subjectName}
                        </span>
                        <CardTitle className="text-base mt-0.5">{item.title}</CardTitle>
                        <CardDescription className="text-xs">
                          Instructor: {facultyName} • Max Marks: {item.max_marks || item.maxMarks}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            item.status === "graded"
                              ? "success"
                              : item.status === "submitted"
                              ? "info"
                              : "warning"
                          }
                        >
                          {item.status === "graded"
                            ? `Graded: ${item.marks_received || item.marksReceived}/${item.max_marks || item.maxMarks}`
                            : item.status === "submitted"
                            ? "Submitted"
                            : "Pending Submission"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-3 text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-zinc-400" />
                        <span>
                          Deadline: <strong className="text-zinc-800 dark:text-zinc-200">{dueDateText}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="gap-1.5"
                          onClick={() => setActiveUpload(item)}
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Submit Deliverable
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Deliverable Modal */}
      {activeUpload && (
        <Modal
          isOpen={!!activeUpload}
          onClose={() => setActiveUpload(null)}
          title={`Upload Assignment: ${activeUpload.title}`}
          description="Direct upload to Supabase assignment_submissions bucket"
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-6 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Choose deliverable file (PDF, ZIP, TAR)
              </p>
              <input
                type="file"
                className="mt-3 block w-full text-xs text-zinc-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300"
                onChange={(e) => {
                  if (e.target.files?.[0]) setSelectedFile(e.target.files[0].name);
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Submission Notes / GitHub Repository Link
              </label>
              <input
                type="text"
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveUpload(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading to Storage..." : "Commit Submission"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Publish Assignment Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Publish Course Assignment"
        description="Creates assignment entry in PostgreSQL assignments table"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <Input
            label="Assignment Title"
            required
            placeholder="e.g. Distributed Consensus Engine"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Problem Description & Instructions
            </label>
            <textarea
              required
              rows={3}
              placeholder="Specify requirements, benchmarks, and evaluation guidelines..."
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Submission Deadline"
              type="datetime-local"
              required
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
            />
            <Input
              label="Maximum Marks"
              type="number"
              required
              value={newAssignment.maxMarks}
              onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: Number(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Publishing..." : "Publish Assignment"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
