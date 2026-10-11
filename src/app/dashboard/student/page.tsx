import Link from "next/link";
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  Calendar,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";

export default function StudentDashboardPage() {
  return (
    <DashboardShell
      title="Student Academic Workspace"
      description="Welcome back, Alex • Computer Science & Engineering (Sem 6)"
      actions={
        <div className="flex gap-2">
          <Link href="/materials">
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4" />
              <span>Study Notes</span>
            </Button>
          </Link>
          <Link href="/assignments">
            <Button size="sm">
              <FileText className="h-4 w-4" />
              <span>View Assignments</span>
            </Button>
          </Link>
        </div>
      }
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Attendance</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">86.4%</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3 w-3" />
                Above 75% threshold
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Due Assignments</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">2 Pending</h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                Next: Operating Systems (Tomorrow)
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Cumulative CGPA</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">8.92</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                Top 10% in Department
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <GraduationCap className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Today&apos;s Lectures</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">4 Classes</h3>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
                Next starts at 11:30 AM
              </p>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Schedule + Attendance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Attendance Breakdown (Recharts) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Course-wise Attendance Overview</CardTitle>
              <CardDescription>Live attendance recorded by faculty members</CardDescription>
            </div>
            <Link href="/attendance">
              <Button variant="ghost" size="sm" className="text-xs">
                <span>Detailed Record</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>

        {/* Today's Timetable */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Today&apos;s Timetable</CardTitle>
              <CardDescription>Monday schedule</CardDescription>
            </div>
            <Link href="/timetable">
              <Badge variant="outline">Full Week</Badge>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-zinc-200/80 p-3 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-600 dark:text-blue-400">09:00 - 10:30 AM</span>
                <Badge variant="success">Completed</Badge>
              </div>
              <h4 className="font-semibold text-sm mt-1">Data Structures & Algorithms</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Prof. Sharma • Lab 302</p>
            </div>

            <div className="rounded-xl border border-blue-500/40 p-3 bg-blue-50/30 dark:border-blue-900/40 dark:bg-blue-950/20">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-600 dark:text-blue-400">11:30 - 01:00 PM</span>
                <Badge variant="warning">Upcoming</Badge>
              </div>
              <h4 className="font-semibold text-sm mt-1">Database Management Systems</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Dr. Rajesh V • Hall 401</p>
            </div>

            <div className="rounded-xl border border-zinc-200/80 p-3 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-500">02:00 - 03:30 PM</span>
                <Badge variant="outline">Scheduled</Badge>
              </div>
              <h4 className="font-semibold text-sm mt-1">Computer Networks</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Prof. Ananya Rao • Room 204</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments & Urgent Notice Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Active Assignments</CardTitle>
              <CardDescription>Submissions requiring your attention</CardDescription>
            </div>
            <Link href="/assignments">
              <Button variant="ghost" size="sm">
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
              <div>
                <h4 className="text-xs font-semibold">OS Virtual Memory Simulation</h4>
                <p className="text-[11px] text-zinc-500">Due: Tomorrow at 11:59 PM • Max Marks: 50</p>
              </div>
              <Badge variant="warning">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
              <div>
                <h4 className="text-xs font-semibold">DBMS Normalization Case Study</h4>
                <p className="text-[11px] text-zinc-500">Due: Oct 16, 2026 • Max Marks: 30</p>
              </div>
              <Badge variant="info">In Progress</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Latest Circular</CardTitle>
              <CardDescription>Official campus bulletin</CardDescription>
            </div>
            <Link href="/announcements">
              <Badge variant="info">Announcements</Badge>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold text-xs mb-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Semester End Examination Schedule Released</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                The comprehensive timetable for November 2026 End-Semester Examinations has been published. Check portal notifications for admit card downloads.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
