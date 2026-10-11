"use client";

import * as React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  Building,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

export default function ContactPage() {
  const { success } = useToast();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    department: "Computer Science",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      success("Inquiry Dispatched", "Your message has been routed to the campus IT & Academic Helpdesk.");
      setFormData({
        name: "",
        email: "",
        department: "Computer Science",
        subject: "",
        message: "",
      });
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="info" className="mb-3">
              Support & Helpdesk
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Campus Operations & Technical Support
            </h1>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Have questions regarding portal access, student records, timetable disputes, or IT services? Reach out directly to campus administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information & Channels */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    Administrative Headquarters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                    <span>Academic Block A, Floor 3, University Tech Campus, Innovation Corridor</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span>Monday – Friday: 08:30 AM – 05:30 PM</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    Direct Contact Lines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span>General Enquiries: +1 (800) 555-CAMPUS</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span>IT Support: support@smartcampus.edu</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span>Registrar: registrar@smartcampus.edu</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-rose-500/20 bg-rose-50/30 dark:bg-rose-950/20">
                <CardHeader>
                  <CardTitle className="text-base text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Immediate Emergency?
                  </CardTitle>
                  <CardDescription className="text-xs">
                    For on-campus medical or security incidents, bypass email and dial the 24/7 SOS helpline.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="tel:911"
                    className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Dial 24/7 Emergency Line: +1 (800) 911-CAMP
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submit a Support Ticket</CardTitle>
                  <CardDescription className="text-xs">
                    Please provide detailed context so we can forward your ticket to the correct department.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <Input
                        label="Campus Email"
                        type="email"
                        required
                        placeholder="alex.m@student.campus.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Academic Department
                        </label>
                        <select
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        >
                          <option>Computer Science & Engineering</option>
                          <option>Electrical & Electronics</option>
                          <option>Mechanical & Mechatronics</option>
                          <option>Business & Management</option>
                          <option>General Administration</option>
                        </select>
                      </div>

                      <Input
                        label="Subject"
                        required
                        placeholder="e.g. Student ID Card Synchronization Issue"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Inquiry Details
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Explain your request or issue in detail..."
                        className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button type="submit" disabled={isSubmitting} className="gap-2">
                        <Send className="h-3.5 w-3.5" />
                        {isSubmitting ? "Routing Ticket..." : "Submit Ticket"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
