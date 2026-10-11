"use client";

import * as React from "react";
import { GraduationCap, Search, Download, Filter, UserCheck, AlertCircle } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface StudentRecord {
  id: string;
  name: string;
  enrollmentNo: string;
  dept: string;
  semester: string;
  attendancePct: number;
  cgpa: number;
  standing: "Good" | "Probation" | "Honor Roll";
}

const studentRoster: StudentRecord[] = [
  { id: "s-1", name: "Alex Morgan", enrollmentNo: "24CS001", dept: "Computer Science", semester: "Sem 6", attendancePct: 88.0, cgpa: 3.82, standing: "Honor Roll" },
  { id: "s-2", name: "David Kim", enrollmentNo: "24CS042", dept: "Computer Science", semester: "Sem 6", attendancePct: 91.2, cgpa: 3.65, standing: "Good" },
  { id: "s-3", name: "Elena Rostova", enrollmentNo: "24ME019", dept: "Mechanical", semester: "Sem 4", attendancePct: 71.4, cgpa: 2.78, standing: "Probation" },
  { id: "s-4", name: "Maya Patel", enrollmentNo: "24EC031", dept: "Electronics", semester: "Sem 6", attendancePct: 94.6, cgpa: 3.95, standing: "Honor Roll" },
  { id: "s-5", name: "Marcus Vance", enrollmentNo: "24CS088", dept: "Computer Science", semester: "Sem 6", attendancePct: 78.5, cgpa: 3.12, standing: "Good" },
];

export default function AdminStudentsPage() {
  const { success } = useToast();
  const [search, setSearch] = React.useState("");

  const filtered = studentRoster.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
      s.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell
      title="Student Enrollment Roster & Academic Records"
      description="Active student directory, attendance standing, and CGPA metrics"
      actions={
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => success("Export Generated", "Student Roster exported as CSV.")}
        >
          <Download className="h-4 w-4" />
          Export Roster CSV
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, roll no, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Enrolled Total: <strong className="text-zinc-800 dark:text-zinc-200">4,820</strong></span>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name & Roll No</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>Standing</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{s.name}</span>
                  <span className="block text-[11px] text-zinc-500 font-mono">{s.enrollmentNo}</span>
                </TableCell>
                <TableCell className="text-xs text-zinc-600 dark:text-zinc-400">{s.dept}</TableCell>
                <TableCell className="text-xs">{s.semester}</TableCell>
                <TableCell>
                  <span
                    className={`font-bold text-xs ${
                      s.attendancePct >= 80 ? "text-emerald-600" : "text-amber-500"
                    }`}
                  >
                    {s.attendancePct}%
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-xs">{s.cgpa}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      s.standing === "Honor Roll"
                        ? "success"
                        : s.standing === "Good"
                        ? "info"
                        : "warning"
                    }
                  >
                    {s.standing}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 dark:text-blue-400"
                    onClick={() => success("Profile Loaded", `Loaded academic dossier for ${s.name}`)}
                  >
                    View Dossier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardShell>
  );
}
