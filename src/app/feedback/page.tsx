"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/state-views";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { MessageSquare, Send, CheckCircle2, Clock, ShieldCheck, Eye, Plus } from "lucide-react";
import { getFeedbackAction, submitFeedbackAction, resolveFeedbackAction } from "@/actions/operations";

export default function FeedbackPage() {
  const { success, error } = useToast();
  const [tickets, setTickets] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  // Form State
  const [category, setCategory] = React.useState<"Academic" | "Hostel" | "Canteen" | "Infrastructure" | "Other">("Academic");
  const [subject, setSubject] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Admin Resolution Modal
  const [resolvingTicket, setResolvingTicket] = React.useState<any | null>(null);
  const [newStatus, setNewStatus] = React.useState<"pending" | "under_review" | "resolved" | "dismissed">("under_review");
  const [adminNotes, setAdminNotes] = React.useState("");

  const fetchTickets = React.useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getFeedbackAction();
      if (res.success && res.data) {
        setTickets(res.data);
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
    fetchTickets();
  }, [fetchTickets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await submitFeedbackAction({
        category,
        subject,
        description,
        isAnonymous,
      });

      if (res.success) {
        success("Ticket Logged", "Your grievance report has been registered in PostgreSQL feedback table.");
        setSubject("");
        setDescription("");
        setIsAnonymous(false);
        fetchTickets();
      } else {
        error("Submission Failed", res.message || "Please check inputs.");
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTicket) return;
    try {
      const res = await resolveFeedbackAction({
        feedbackId: resolvingTicket.id,
        status: newStatus,
        adminNotes,
      });

      if (res.success) {
        success("Status Updated", `Ticket resolved as ${newStatus}.`);
        setResolvingTicket(null);
        setAdminNotes("");
        fetchTickets();
      } else {
        error("Failed", res.message);
      }
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  return (
    <DashboardShell
      title="Grievance Redressal & Student Feedback"
      description="Submit confidential feedback or report campus infrastructure and academic concerns"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Submission Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">File a Grievance Ticket</CardTitle>
              <CardDescription className="text-xs">
                Logged to PostgreSQL with administrative oversight
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Category
                  </label>
                  <select
                    className="flex w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                  >
                    <option value="Academic">Academic & Courses</option>
                    <option value="Infrastructure">Infrastructure & Labs</option>
                    <option value="Hostel">Hostel & Housing</option>
                    <option value="Canteen">Canteen & Hygiene</option>
                    <option value="Other">Other University Services</option>
                  </select>
                </div>

                <Input
                  label="Subject Title"
                  required
                  placeholder="e.g. Lab 302 Air Conditioning Issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Detailed Grievance
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide detailed description, room numbers, or specifics (minimum 20 characters)..."
                    className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-900 placeholder-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonCheck"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <label htmlFor="anonCheck" className="text-xs text-zinc-600 dark:text-zinc-400 font-medium cursor-pointer">
                    Submit confidentially (Hide identity)
                  </label>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full gap-2 text-xs">
                  <Send className="h-3.5 w-3.5" />
                  {isSubmitting ? "Logging Ticket..." : "Submit Grievance Ticket"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Existing Tickets Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Active Grievance Tickets
            </h3>
            <span className="text-xs text-zinc-500">
              Total Recorded: <strong className="text-zinc-800 dark:text-zinc-200">{tickets.length}</strong>
            </span>
          </div>

          {loading ? (
            <LoadingState message="Fetching grievance tickets..." />
          ) : hasError ? (
            <ErrorState onRetry={fetchTickets} />
          ) : tickets.length === 0 ? (
            <EmptyState
              title="No Grievance Tickets"
              description="You have not submitted any grievance tickets yet."
            />
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <Card key={t.id} className="hover:border-blue-500/40 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{t.category}</Badge>
                          <Badge
                            variant={
                              t.status === "resolved"
                                ? "success"
                                : t.status === "under_review"
                                ? "warning"
                                : t.status === "dismissed"
                                ? "danger"
                                : "default"
                            }
                            className="capitalize"
                          >
                            {t.status.replace("_", " ")}
                          </Badge>
                          {t.is_anonymous && (
                            <Badge variant="secondary" className="text-[10px]">
                              Anonymous
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-sm font-bold mt-2">{t.subject}</CardTitle>
                      </div>
                      <span className="text-[11px] text-zinc-400 whitespace-nowrap">
                        {new Date(t.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {t.description}
                    </p>

                    {t.admin_notes && (
                      <div className="rounded-xl border border-blue-500/20 bg-blue-50/30 p-2.5 text-xs text-blue-900 dark:text-blue-300">
                        <strong>Admin Resolution Note:</strong> {t.admin_notes}
                      </div>
                    )}

                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-600 dark:text-blue-400"
                        onClick={() => {
                          setResolvingTicket(t);
                          setNewStatus(t.status);
                          setAdminNotes(t.admin_notes || "");
                        }}
                      >
                        Update Ticket Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Resolution Modal */}
      {resolvingTicket && (
        <Modal
          isOpen={!!resolvingTicket}
          onClose={() => setResolvingTicket(null)}
          title={`Update Grievance: ${resolvingTicket.subject}`}
          description={`Category: ${resolvingTicket.category} • ID: ${resolvingTicket.id}`}
        >
          <form onSubmit={handleResolveSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Resolution Status
              </label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
              >
                <option value="pending">Pending Investigation</option>
                <option value="under_review">Under Active Review</option>
                <option value="resolved">Issue Resolved</option>
                <option value="dismissed">Dismissed / Inapplicable</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Administrative Action Notes
              </label>
              <textarea
                rows={3}
                placeholder="Detail corrective measures taken or committee decisions..."
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setResolvingTicket(null)}>
                Cancel
              </Button>
              <Button type="submit">Commit Resolution</Button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardShell>
  );
}
