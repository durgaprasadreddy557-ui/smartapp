import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Bell,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  BookOpen,
  Users,
  Building2,
  PhoneCall,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FeaturesPage() {
  const featureList = [
    {
      title: "Student Academic Self-Service",
      description: "Everything a student needs in one unified dashboard: dynamic schedule, attendance trends, assignment submissions, and downloadable notes.",
      icon: GraduationCap,
      color: "blue",
      href: "/dashboard/student",
      badge: "Student",
    },
    {
      title: "Faculty Course & Gradebook Suite",
      description: "Class rosters, lecture scheduling, one-click attendance recording, assignment publishing, and student grading tools.",
      icon: Briefcase,
      color: "amber",
      href: "/dashboard/faculty",
      badge: "Faculty",
    },
    {
      title: "Admin Command & Governance",
      description: "User directory management, campus-wide broadcast announcements, event curation, facility booking oversight, and system analytics.",
      icon: ShieldAlert,
      color: "rose",
      href: "/dashboard/admin",
      badge: "Admin",
    },
    {
      title: "Dynamic Smart Timetable",
      description: "Conflict-free weekly schedule visualization filtered by day, semester, room number, and professor with real-time room shift alerts.",
      icon: Clock,
      color: "indigo",
      href: "/timetable",
      badge: "Academic",
    },
    {
      title: "Attendance Intelligence",
      description: "Track present/absent logs, subject-wise attendance percentage against the mandatory 75% threshold, and shortfall warnings.",
      icon: CheckCircle2,
      color: "emerald",
      href: "/attendance",
      badge: "Tracking",
    },
    {
      title: "Digital Assignment Workflows",
      description: "View deadlines, submission status, upload assignment deliverables directly to secure storage, and receive graded feedback.",
      icon: FileText,
      color: "violet",
      href: "/assignments",
      badge: "Evaluation",
    },
    {
      title: "Course Study Materials & Respository",
      description: "Organized repository of syllabi, lecture slides, lab manuals, and reference notes with instant search and download links.",
      icon: BookOpen,
      color: "sky",
      href: "/materials",
      badge: "Storage",
    },
    {
      title: "Live Campus Announcements",
      description: "Categorized urgent, academic, and administrative campus notifications with real-time websocket broadcasting.",
      icon: Bell,
      color: "amber",
      href: "/announcements",
      badge: "Realtime",
    },
    {
      title: "Campus Events & Workshops",
      description: "Explore tech symposiums, cultural fests, hackathons, and sports tournaments with one-click RSVP and venue details.",
      icon: Calendar,
      color: "purple",
      href: "/events",
      badge: "Engagement",
    },
    {
      title: "Facilities & Lab Status",
      description: "Real-time occupancy tracking and booking requests for advanced computer labs, library study cubes, and seminar auditoriums.",
      icon: Building2,
      color: "teal",
      href: "/facilities",
      badge: "Campus",
    },
    {
      title: "24/7 Campus Emergency SOS",
      description: "Direct speed-dial hotlines for campus medical centre, security control desk, women's helpline, and ambulance dispatch.",
      icon: PhoneCall,
      color: "rose",
      href: "/emergency",
      badge: "Safety",
    },
    {
      title: "Anonymous Grievance & Feedback",
      description: "Submit suggestions and issues regarding campus facilities, cafeteria, or curriculum with confidential tracking numbers.",
      icon: MessageSquare,
      color: "cyan",
      href: "/feedback",
      badge: "Support",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-zinc-200/80 bg-white/60 py-16 text-center dark:border-zinc-800/80 dark:bg-zinc-900/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Badge variant="secondary" className="mb-3">
              Comprehensive Feature Suite
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Engineered for Modern Academic Life
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Explore the 18+ modular capabilities included in the Smart Campus platform, built for students, professors, and university leadership.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureList.map((feat) => {
              const Icon = feat.icon;
              return (
                <Card
                  key={feat.title}
                  className="flex flex-col justify-between hover:shadow-lg transition-all border-zinc-200/90 dark:border-zinc-800/90"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center dark:bg-blue-500/20 dark:text-blue-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline">{feat.badge}</Badge>
                    </div>
                    <CardTitle className="text-base font-bold">{feat.title}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed mt-2">
                      {feat.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link href={feat.href} className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 gap-1.5 transition-colors">
                      Open Module <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
