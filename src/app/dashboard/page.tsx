import Link from "next/link";
import { GraduationCap, Briefcase, ShieldAlert, ArrowRight } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPortal() {
  return (
    <DashboardShell
      title="Role-Based Command Portals"
      description="Choose your persona or role view to access tailored campus tools"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Student Portal Card */}
        <Card className="hover:border-blue-500/50 hover:shadow-lg transition-all border-zinc-200 dark:border-zinc-800">
          <CardContent className="pt-6 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Student Portal</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                View real-time timetable, track course attendance percentages, submit assignments, and download study notes.
              </p>
            </div>
            <Link href="/dashboard/student" className="block pt-2">
              <Button className="w-full" size="md">
                <span>Enter Student Portal</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Faculty Portal Card */}
        <Card className="hover:border-amber-500/50 hover:shadow-lg transition-all border-zinc-200 dark:border-zinc-800">
          <CardContent className="pt-6 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Faculty Console</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Mark student attendance, create assignment rubrics, review submissions, and publish academic circulars.
              </p>
            </div>
            <Link href="/dashboard/faculty" className="block pt-2">
              <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/40" size="md">
                <span>Enter Faculty Console</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Admin Portal Card */}
        <Card className="hover:border-rose-500/50 hover:shadow-lg transition-all border-zinc-200 dark:border-zinc-800">
          <CardContent className="pt-6 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Admin Command Center</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Manage campus infrastructure, supervise user accounts, dispatch campus emergency broadcasts, and monitor database health.
              </p>
            </div>
            <Link href="/dashboard/admin" className="block pt-2">
              <Button variant="outline" className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40" size="md">
                <span>Enter Admin Center</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
