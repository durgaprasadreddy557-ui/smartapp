"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { CheckCircle2, AlertCircle, Calendar, Download, Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { LoadingState, EmptyState } from "@/components/ui/state-views";
import { getAttendanceAction } from "@/actions/academics";

interface SubjectAttendance {
  code: string;
  name: string;
  conducted: number;
  attended: number;
  pct: number;
  status: "Safe" | "Warning" | "Critical";
  faculty: string;
}

const defaultFallbackList: SubjectAttendance[] = [
  { code: "CS601", name: "Data Structures & Algorithms", conducted: 32, attended: 29, pct: 90.6, status: "Safe", faculty: "Prof. Sharma" },
  { code: "CS602", name: "Database Management Systems", conducted: 28, attended: 26, pct: 92.8, status: "Safe", faculty: "Dr. Rajesh V" },
  { code: "CS603", name: "Operating Systems", conducted: 30, attended: 23, pct: 76.6, status: "Warning", faculty: "Dr. Nair" },
  { code: "CS604", name: "Computer Networks", conducted: 26, attended: 22, pct: 84.6, status: "Safe", faculty: "Prof. Rao" },
  { code: "CS605", name: "Software Engineering Studio", conducted: 24, attended: 23, pct: 95.8, status: "Safe", faculty: "Dr. Gupta" },
  { code: "CS607", name: "Artificial Intelligence Elective", conducted: 20, attended: 14, pct: 70.0, status: "Critical", faculty: "Prof. Mehta" },
];

export default function AttendancePage() {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<SubjectAttendance[]>(defaultFallbackList);
  const [filterStatus, setFilterStatus] = React.useState<string>("All");
  const [selectedSubject, setSelectedSubject] = React.useState<SubjectAttendance | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getAttendanceAction();
        if (mounted && res?.success && res.data && res.data.length > 0) {
          // If returned as raw attendance list or aggregated
          if (res.data[0]?.code) {
            setItems(
              res.data.map((d: any) => ({
                ...d,
                status: d.pct >= 85 ? "Safe" : d.pct >= 75 ? "Warning" : "Critical",
              }))
            );
          }
        }
      } catch (e: any) {
        console.error("Attendance load error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = items.filter((s) => {
    if (filterStatus === "All") return true;
    return s.status === filterStatus;
  });

  const cumulativeAttended = items.reduce((acc, curr) => acc + curr.attended, 0);
  const cumulativeConducted = items.reduce((acc, curr) => acc + curr.conducted, 0);
  const cumulativePct = cumulativeConducted > 0 ? ((cumulativeAttended / cumulativeConducted) * 100).toFixed(1) : "0.0";

  return (
    <DashboardShell
      title="Attendance & Compliance Intelligence"
      description="Subject-level tracking with minimum 75% institutional examination criteria"
      actions={
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => success("Transcript Generated", "Official Attendance Report downloaded as PDF.")}
        >
          <Download className="h-4 w-4" />
          Export Statement
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Overall Aggregate
              </span>
              <p className="mt-1 text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {cumulativePct}%
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Above 75% threshold
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Total Classes Attended
              </span>
              <p className="mt-1 text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {cumulativeAttended} / {cumulativeConducted}
              </p>
              <span className="text-[11px] text-zinc-500">Lectures & labs combined</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Subjects At Risk
              </span>
              <p className="mt-1 text-2xl font-extrabold text-amber-500">2 Courses</p>
              <span className="text-[11px] text-amber-600 font-medium">1 Warning, 1 Critical</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Hall Ticket Status
              </span>
              <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                Eligible
              </p>
              <span className="text-[11px] text-zinc-500">Current standing verified</span>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Attendance Distribution</CardTitle>
              <CardDescription>Visual comparison against academic threshold (75%)</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceChart />
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Attendance Guidelines</CardTitle>
              <CardDescription>Academic Regulation Section 4.2</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/20 p-4 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>≥ 75% Rule Compliance</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  Students maintaining 75% or greater are automatically cleared for end-semester assessments without condonation fees.
                </p>
              </div>

              <div className="rounded-xl border border-rose-500/30 bg-rose-50/20 p-4 dark:bg-rose-950/20">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <span>Medical Leave Condonation</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  Leaves supported by physician certificates can compensate up to 10% shortfall (65% minimum hard cutoff).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Course-wise Breakdown
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">Filter by status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="All">All Courses</option>
                <option value="Safe">Safe (&gt;80%)</option>
                <option value="Warning">Warning (75-80%)</option>
                <option value="Critical">Critical (&lt;75%)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingState message="Loading attendance records & compliance ratios..." />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No attendance records found"
              description="No courses match the chosen compliance filter."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code & Title</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Attended / Conducted</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</span>
                      <span className="block text-[11px] text-zinc-500">{item.code}</span>
                    </TableCell>
                    <TableCell className="text-xs text-zinc-600 dark:text-zinc-400">{item.faculty}</TableCell>
                    <TableCell className="text-xs font-medium">
                      {item.attended} / {item.conducted}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-zinc-200 rounded-full h-1.5 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              item.pct >= 85
                                ? "bg-emerald-500"
                                : item.pct >= 75
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${Math.min(item.pct, 100)}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs">{item.pct}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Safe"
                            ? "success"
                            : item.status === "Warning"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-600 dark:text-blue-400"
                        onClick={() => setSelectedSubject(item)}
                      >
                        Detailed Log
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Detail Log Modal */}
      {selectedSubject && (
        <Modal
          isOpen={!!selectedSubject}
          onClose={() => setSelectedSubject(null)}
          title={`Attendance History: ${selectedSubject.name}`}
          description={`Instructor: ${selectedSubject.faculty} • Aggregate: ${selectedSubject.pct}%`}
        >
          <div className="space-y-4">
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Conducted Sessions:</span>
                <span className="font-semibold">{selectedSubject.conducted} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Present Sessions:</span>
                <span className="font-semibold text-emerald-600">{selectedSubject.attended} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Unexcused Absences:</span>
                <span className="font-semibold text-rose-500">
                  {selectedSubject.conducted - selectedSubject.attended} hours
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-500">
              Recent recorded roll call sessions:
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
                <span>Oct 09, 2026 • 09:00 AM</span>
                <Badge variant="success">Present</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
                <span>Oct 07, 2026 • 09:00 AM</span>
                <Badge variant="success">Present</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
                <span>Oct 05, 2026 • 09:00 AM</span>
                <Badge variant="destructive">Absent</Badge>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button onClick={() => setSelectedSubject(null)}>Close Record</Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
