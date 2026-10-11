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
import { PhoneCall, ShieldAlert, HeartPulse, Flame, PhoneForwarded, Plus, Phone } from "lucide-react";
import { getEmergencyContactsAction, createEmergencyContactAction } from "@/actions/operations";

export default function EmergencyContactsPage() {
  const { success, error } = useToast();
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    designation: "",
    phone: "",
    alternatePhone: "",
    availableHours: "24/7",
    category: "Emergency" as "Emergency" | "Medical" | "Security" | "Helpline",
    priority: 1,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchContacts = React.useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getEmergencyContactsAction();
      if (res.success && res.data) {
        setContacts(res.data);
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
    fetchContacts();
  }, [fetchContacts]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createEmergencyContactAction(formData);
      if (res.success) {
        success("Hotline Added", "Emergency contact record committed to PostgreSQL.");
        setModalOpen(false);
        setFormData({
          name: "",
          designation: "",
          phone: "",
          alternatePhone: "",
          availableHours: "24/7",
          category: "Emergency",
          priority: 1,
        });
        fetchContacts();
      } else {
        error("Failed", res.message || "Please check inputs.");
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell
      title="Campus Emergency Contacts & Hotlines"
      description="Immediate 24/7 crisis numbers for medical, security, fire safety, and counseling"
      actions={
        <Button size="sm" variant="danger" onClick={() => setModalOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Add Emergency Contact</span>
        </Button>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <LoadingState message="Fetching live emergency dispatch hotlines..." />
        ) : hasError ? (
          <ErrorState onRetry={fetchContacts} />
        ) : contacts.length === 0 ? (
          <EmptyState
            title="No Emergency Hotlines"
            description="No contacts have been provisioned in the directory."
            actionLabel="Add Hotline"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((c) => (
              <Card key={c.id || c.name} className="border-l-4 border-l-rose-500 flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <Badge variant="danger">{c.available_hours || "24/7"}</Badge>
                  </div>
                  <CardTitle className="text-base font-bold">{c.name}</CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    {c.designation} • Category: {c.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
                      {c.phone}
                    </p>
                    {c.alternate_phone && (
                      <p className="text-xs text-zinc-500 font-mono">
                        Alternate: {c.alternate_phone}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-1/2 text-xs"
                      onClick={() => {
                        navigator.clipboard?.writeText?.(c.phone);
                        success("Number Copied", `${c.phone} copied to clipboard.`);
                      }}
                    >
                      Copy Number
                    </Button>
                    <a href={`tel:${c.phone}`} className="w-1/2">
                      <Button variant="danger" size="sm" className="w-full gap-1.5 text-xs">
                        <PhoneCall className="h-3.5 w-3.5" />
                        <span>Dial Now</span>
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Emergency Contact Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Campus Emergency Hotline"
        description="Registers emergency phone number in Supabase emergency_contacts table"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Service / Office Name"
            required
            placeholder="e.g. University Ambulance Dispatch"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Designation / Authority"
            required
            placeholder="e.g. Chief Medical Officer"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Primary Hotline Phone"
              required
              placeholder="+1 (800) 555-0108"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Alternate Phone / Extension"
              placeholder="Ext: 108"
              value={formData.alternatePhone}
              onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="Emergency">Emergency Security</option>
                <option value="Medical">Medical / Ambulance</option>
                <option value="Security">Campus Security</option>
                <option value="Helpline">Helpline / Counseling</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Availability</label>
              <input
                type="text"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={formData.availableHours}
                onChange={(e) => setFormData({ ...formData, availableHours: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Commit Hotline"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
