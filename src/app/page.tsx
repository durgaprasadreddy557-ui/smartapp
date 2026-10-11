import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  BookOpen,
  Users,
  Building2,
  PhoneCall,
  Bell,
  MessageSquare,
  Search,
  Settings,
  ArrowRight,
  Database,
  Radio,
  Server,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const modules = [
    {
      title: "Student Dashboard",
      desc: "Course attendance, timetable schedule, assignment submissions, and progress metrics.",
      icon: GraduationCap,
      href: "/dashboard/student",
      badge: "Student",
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      title: "Faculty Dashboard",
      desc: "Attendance markers, grading workflows, curriculum tracking, and announcements.",
      icon: Briefcase,
      href: "/dashboard/faculty",
      badge: "Faculty",
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      title: "Admin Dashboard",
      desc: "Operations command center, user roles, emergency broadcasts, and facility control.",
      icon: ShieldAlert,
      href: "/dashboard/admin",
      badge: "Admin",
      color: "text-rose-600 bg-rose-500/10",
    },
    {
      title: "Announcements",
      desc: "Realtime institutional circulars, academic notices, and department updates.",
      icon: Bell,
      href: "/announcements",
      badge: "Realtime",
      color: "text-indigo-600 bg-indigo-500/10",
    },
    {
      title: "Campus Events",
      desc: "Conferences, hackathons, guest seminars, and cultural festivals with registration.",
      icon: Calendar,
      href: "/events",
      color: "text-purple-600 bg-purple-500/10",
    },
    {
      title: "Class Timetable",
      desc: "Weekly schedule by department, classroom numbers, and faculty instructor slots.",
      icon: Clock,
      href: "/timetable",
      color: "text-cyan-600 bg-cyan-500/10",
    },
    {
      title: "Attendance Tracking",
      desc: "Live subject-wise attendance statistics with automated 75% minimum alert checks.",
      icon: CheckCircle2,
      href: "/attendance",
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: "Assignments",
      desc: "Faculty assignment briefs, deadline countdowns, and student submission portal.",
      icon: FileText,
      href: "/assignments",
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      title: "Study Materials",
      desc: "Lecture notes, syllabus references, and PDFs backed by Supabase Storage.",
      icon: BookOpen,
      href: "/materials",
      color: "text-sky-600 bg-sky-500/10",
    },
    {
      title: "Faculty Directory",
      desc: "Professor profiles, research specializations, office hours, and consultation links.",
      icon: Users,
      href: "/faculty",
      color: "text-teal-600 bg-teal-500/10",
    },
    {
      title: "Campus Facilities",
      desc: "Digital reservation and live availability for libraries, labs, and auditoriums.",
      icon: Building2,
      href: "/facilities",
      color: "text-orange-600 bg-orange-500/10",
    },
    {
      title: "Emergency Contacts",
      desc: "Instant 24/7 one-touch access to campus police, ambulance, and safety hotlines.",
      icon: PhoneCall,
      href: "/emergency",
      badge: "24/7",
      color: "text-rose-600 bg-rose-500/10",
    },
    {
      title: "Notifications",
      desc: "Personalized alert inbox for exam results, class shifts, and submission marks.",
      icon: Bell,
      href: "/notifications",
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      title: "Feedback & Grievances",
      desc: "Direct grievance redressal mechanism for academic, hostel, or facility concerns.",
      icon: MessageSquare,
      href: "/feedback",
      color: "text-violet-600 bg-violet-500/10",
    },
    {
      title: "Global Search",
      desc: "Instant search across all notices, faculty, courses, and campus resources.",
      icon: Search,
      href: "/search",
      color: "text-zinc-600 bg-zinc-500/10",
    },
    {
      title: "Account Settings",
      desc: "Personal preferences, notification channels, and security settings.",
      icon: Settings,
      href: "/settings",
      color: "text-slate-600 bg-slate-500/10",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      {/* Emergency / High-Priority Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white px-4 py-2.5 text-xs text-center font-medium shadow-inner flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0 text-amber-300" />
        <span>
          SMART CAMPUS Platform Online • Realtime connection active • PostgreSQL Database synced
        </span>
        <Link href="/announcements" className="underline font-bold hover:text-white/80 ml-1">
          View Notices →
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.950),transparent)] opacity-60" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 backdrop-blur-md dark:bg-blue-950/60 dark:text-blue-300 mb-6">
            <Radio className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
            <span>Next-Generation College Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-4xl mx-auto leading-tight">
            Unified Digital Infrastructure for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Smart Higher Education
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A cohesive full-stack web application connecting Students, Faculty, and Administrators. Powered by Next.js, Supabase PostgreSQL, Realtime sync, and enterprise role-based security.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/login">
              <Button size="lg" className="shadow-lg shadow-blue-500/25">
                <span>Access Campus Portal</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                <span>Explore Role Views</span>
              </Button>
            </Link>
            <Link href="/api/health" target="_blank">
              <Button variant="ghost" size="lg" className="text-xs">
                <Database className="h-4 w-4 mr-1 text-emerald-500" />
                <span>Backend Health Status</span>
              </Button>
            </Link>
          </div>

          {/* Architecture Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 max-w-3xl mx-auto">
            <Badge variant="outline" className="text-xs py-1 px-3">
              Next.js 16 (App Router)
            </Badge>
            <Badge variant="outline" className="text-xs py-1 px-3">
              TypeScript
            </Badge>
            <Badge variant="outline" className="text-xs py-1 px-3">
              Tailwind CSS
            </Badge>
            <Badge variant="outline" className="text-xs py-1 px-3">
              Supabase PostgreSQL
            </Badge>
            <Badge variant="outline" className="text-xs py-1 px-3">
              Supabase Auth & RLS
            </Badge>
            <Badge variant="outline" className="text-xs py-1 px-3">
              Supabase Realtime
            </Badge>
            <Badge variant="outline" className="text-xs py-1 px-3">
              Zod Validation
            </Badge>
            <Badge variant="outline" className="text-xs py-1 px-3">
              Recharts Analytics
            </Badge>
          </div>
        </div>
      </section>

      {/* Role Selector Grid */}
      <section className="py-12 bg-white/40 dark:bg-zinc-900/40 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Dedicated Role Experiences</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Select your persona to enter customized workflows and metrics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student */}
            <Card className="hover:border-blue-500 transition-all border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <Badge variant="info">Student Role</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Student Workspace</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Personalized timetable, subject-wise attendance charts, assignment submissions, and study materials repository.
                  </p>
                </div>
                <Link href="/dashboard/student" className="block pt-2">
                  <Button className="w-full" size="sm">
                    Open Student Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Faculty */}
            <Card className="hover:border-amber-500 transition-all border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <Badge variant="warning">Faculty Role</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Faculty Console</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Attendance recording, assignment rubric builder, submission review queue, and lecture timetable management.
                  </p>
                </div>
                <Link href="/dashboard/faculty" className="block pt-2">
                  <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300" size="sm">
                    Open Faculty Console
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin */}
            <Card className="hover:border-rose-500 transition-all border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-rose-500/10 text-rose-600 rounded-2xl">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <Badge variant="danger">Admin Role</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Admin Command Center</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Campus facility bookings, grievance redressal, emergency broadcasts, and Supabase infrastructure supervision.
                  </p>
                </div>
                <Link href="/dashboard/admin" className="block pt-2">
                  <Button variant="outline" className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300" size="sm">
                    Open Admin Command
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Complete Modules Showcase */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Enterprise Application Modules</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Explore all 18 core services architected into SMART CAMPUS
              </p>
            </div>
            <Link href="/search">
              <Button variant="outline" size="sm">
                <Search className="h-3.5 w-3.5" />
                <span>Search Modules</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.title} href={m.href} className="group">
                  <Card className="h-full hover:border-blue-500/40 hover:-translate-y-0.5 transition-all p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl ${m.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {m.badge && <Badge variant="outline">{m.badge}</Badge>}
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      {m.desc}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
