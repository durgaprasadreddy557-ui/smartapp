"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  CheckCircle,
  FileCheck,
  PlusCircle,
  Bell,
  Clock,
  ArrowRight,
  Upload,
  Calendar,
  BookOpen,
  FileText,
  Search,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function FacultyDashboardPage() {
  const { success } = useToast();
  const [activeTab, setActiveTab] = React.useState<"overview" | "roster" | "materials">("overview");

  // Modal States
  const [attendanceModalOpen, setAttendanceModalOpen] = React.useState(false);
  const [materialModalOpen, setMaterialModalOpen] = React.useState(false);

  // Quick Attendance Form State
  const [courseCode, setCourseCode] = React.useState("CS602");
  const [presentCount, setPresentCount] = React.useState("58");
  const [absentStudents, setAbsentStudents] = React.useState("24CS012, 24CS045");

  // New Material Form State
  const [materialTitle, setMaterialTitle] = React.useState("");
  const [materialCourse, setMaterialCourse] = React.useState("CS602: Database Systems");

  const handleRecordAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    setAttendanceModalOpen(false);
    success("Attendance Saved", `Roll call logged for ${courseCode} (${presentCount} Present, Absentees: ${absentStudents}).`);
  };

  const handleUploadMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    setMaterialModalOpen(false);
    success("Study Material Published", `${materialTitle} uploaded to Supabase Storage bucket.`);
    setMaterialTitle("");
  };

  return (
    <DashboardShell
      title="Faculty Instructor Console"
      description="Welcome, Dr. Rajesh Varma • Department of Computer Science & Engineering"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setMaterialModalOpen(true)} className="gap-1.5">
            <Upload className="h-4 w-4" />
            <span>Upload Notes</span>
          </Button>
          <Button size="sm" onClick={() => setAttendanceModalOpen(true)} className="gap-1.5 shadow-sm shadow-blue-500/20">
            <CheckCircle className="h-4 w-4" />
            <span>Take Attendance</span>
          </Button>
        </div>
      }
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Active Courses</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">3 Batches</h3>
              <p className="text-[11px] text-zinc-500 mt-1">184 Enrolled Students</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Today&apos;s Lectures</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">3 Sessions</h3>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">Next: Hall 401 at 11:30 AM</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Submissions to Grade</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">42 Papers</h3>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-medium">DBMS ER Diagrams</p>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl">
              <FileCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Batch Attendance Avg</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">91.4%</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Healthy compliance</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Teaching Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Today&apos;s Lecture Schedule</CardTitle>
                <CardDescription className="text-xs">Classes scheduled for Monday, Fall 2026</CardDescription>
              </div>
              <Badge variant="outline">Live Roster</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time & Venue</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Batch Size</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">09:00 - 10:30 AM</span>
                    <span className="block text-[11px] text-zinc-500">Hall 401</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">CS602: Database Management Systems</span>
                    <span className="block text-[11px] text-blue-600 dark:text-blue-400">Relational Algebra & SQL</span>
                  </TableCell>
                  <TableCell>62 Students</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => setAttendanceModalOpen(true)} className="text-xs text-blue-600">
                      Take Roll
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">11:30 - 01:00 PM</span>
                    <span className="block text-[11px] text-zinc-500">Hall 401</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">CS605: Advanced Database Systems</span>
                    <span className="block text-[11px] text-blue-600 dark:text-blue-400">Concurrency Control</span>
                  </TableCell>
                  <TableCell>58 Students</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => setAttendanceModalOpen(true)} className="text-xs text-blue-600">
                      Take Roll
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">02:00 - 04:00 PM</span>
                    <span className="block text-[11px] text-zinc-500">Database Lab 201</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">CS605L: Database Systems Practical</span>
                    <span className="block text-[11px] text-blue-600 dark:text-blue-400">PostgreSQL Triggers & SPs</span>
                  </TableCell>
                  <TableCell>32 Students</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => setAttendanceModalOpen(true)} className="text-xs text-blue-600">
                      Take Roll
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Tools & Shortcuts */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base">Quick Course Administration</CardTitle>
            <CardDescription className="text-xs">Shortcuts to manage deliverables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/announcements"
              className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-semibold">Post Class Announcement</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
            </Link>

            <Link
              href="/assignments"
              className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-semibold">Grade Assignment Papers</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
            </Link>

            <Link
              href="/materials"
              className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-semibold">Course Study Materials</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
            </Link>

            <Link
              href="/events"
              className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold">Department Seminars</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Roll Call Modal */}
      <Modal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        title="Record Lecture Attendance"
        description="Mark roll call entries into PostgreSQL `attendance_records`"
      >
        <form onSubmit={handleRecordAttendance} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Course Code</label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              >
                <option value="CS602">CS602: Database Management Systems</option>
                <option value="CS605">CS605: Advanced Database Systems</option>
                <option value="CS605L">CS605L: Database Lab Practical</option>
              </select>
            </div>
            <Input
              label="Present Count"
              type="number"
              required
              value={presentCount}
              onChange={(e) => setPresentCount(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Absent Roll Numbers (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="e.g. 24CS012, 24CS045, 24CS089"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
              value={absentStudents}
              onChange={(e) => setAbsentStudents(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setAttendanceModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Commit Attendance Log</Button>
          </div>
        </form>
      </Modal>

      {/* Material Upload Modal */}
      <Modal
        isOpen={materialModalOpen}
        onClose={() => setMaterialModalOpen(false)}
        title="Publish Course Study Material"
        description="Upload slides or notes to Supabase Storage `study_materials` bucket"
      >
        <form onSubmit={handleUploadMaterial} className="space-y-4">
          <Input
            label="Document Title"
            required
            placeholder="e.g. Chapter 4: B-Tree Indexing and Hashing Guide"
            value={materialTitle}
            onChange={(e) => setMaterialTitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Target Course</label>
            <select
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
              value={materialCourse}
              onChange={(e) => setMaterialCourse(e.target.value)}
            >
              <option>CS602: Database Management Systems</option>
              <option>CS605: Advanced Database Systems</option>
              <option>CS605L: Database Lab Practical</option>
            </select>
          </div>

          <div className="rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-6 text-center">
            <Upload className="h-6 w-6 mx-auto text-blue-500 mb-2" />
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Select presentation or PDF document
            </p>
            <input type="file" className="mt-2 text-xs text-zinc-500" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setMaterialModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Publish to Course Repository</Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
