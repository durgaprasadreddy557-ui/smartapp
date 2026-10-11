"use client";

import * as React from "react";
import { UserCheck, Search, Download, Mail, Phone, MapPin, Building, Plus } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface FacultyStaff {
  id: string;
  name: string;
  designation: string;
  dept: string;
  email: string;
  coursesHandled: number;
  cabin: string;
  status: "Active" | "On Sabbatical" | "Visiting";
}

const facultyList: FacultyStaff[] = [
  { id: "f-1", name: "Dr. Rajesh Varma", designation: "Professor & HOD", dept: "Computer Science", email: "rajesh.v@campus.edu", coursesHandled: 3, cabin: "Tech Block A • 304", status: "Active" },
  { id: "f-2", name: "Prof. Ananya Rao", designation: "Associate Professor", dept: "Computer Science", email: "ananya.rao@campus.edu", coursesHandled: 2, cabin: "Tech Block A • 212", status: "Active" },
  { id: "f-3", name: "Dr. Vivek Sharma", designation: "Assistant Professor", dept: "Computer Science", email: "vivek.sharma@campus.edu", coursesHandled: 3, cabin: "Tech Block B • 108", status: "Active" },
  { id: "f-4", name: "Dr. Meenakshi Nair", designation: "Professor", dept: "Computer Science", email: "meenakshi.nair@campus.edu", coursesHandled: 2, cabin: "Tech Block A • 310", status: "Active" },
  { id: "f-5", name: "Dr. Sanjay Deshmukh", designation: "Professor", dept: "Mechanical", email: "sanjay.d@campus.edu", coursesHandled: 2, cabin: "Mech Block • 201", status: "On Sabbatical" },
];

export default function AdminFacultyPage() {
  const { success } = useToast();
  const [search, setSearch] = React.useState("");

  const filtered = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.designation.toLowerCase().includes(search.toLowerCase()) ||
      f.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell
      title="Faculty Roster & Department Governance"
      description="Faculty teaching assignments, workload metrics, and departmental offices"
      actions={
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => success("Export Generated", "Faculty Directory exported as CSV.")}
        >
          <Download className="h-4 w-4" />
          Export Faculty CSV
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search faculty by name, department, cabin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Total Faculty: <strong className="text-zinc-800 dark:text-zinc-200">264 Professors</strong></span>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Faculty Name & Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email Contact</TableHead>
              <TableHead>Cabin Location</TableHead>
              <TableHead>Active Courses</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((f) => (
              <TableRow key={f.id}>
                <TableCell>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{f.name}</span>
                  <span className="block text-[11px] text-zinc-500">{f.designation}</span>
                </TableCell>
                <TableCell className="text-xs text-zinc-600 dark:text-zinc-400">{f.dept}</TableCell>
                <TableCell className="text-xs font-mono">{f.email}</TableCell>
                <TableCell className="text-xs text-zinc-500">{f.cabin}</TableCell>
                <TableCell className="font-bold text-xs">{f.coursesHandled} Batches</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      f.status === "Active"
                        ? "success"
                        : f.status === "Visiting"
                        ? "info"
                        : "warning"
                    }
                  >
                    {f.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 dark:text-blue-400"
                    onClick={() => success("Faculty Load", `Workload sheet opened for ${f.name}`)}
                  >
                    Workload
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
