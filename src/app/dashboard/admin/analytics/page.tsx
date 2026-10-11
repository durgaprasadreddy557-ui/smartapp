"use client";

import * as React from "react";
import { BarChart3, TrendingUp, Users, BookOpen, Clock, ShieldCheck, Download } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CampusActivityChart } from "@/components/dashboard/campus-stats-chart";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { useToast } from "@/components/ui/toast";

export default function AdminAnalyticsPage() {
  const { success } = useToast();

  return (
    <DashboardShell
      title="Campus Institutional Analytics & Intelligence"
      description="Aggregate statistics across academic courses, attendance compliance, facility utilization, and user traffic"
      actions={
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => success("Intelligence Report Exported", "Comprehensive Institutional Audit PDF generated.")}
        >
          <Download className="h-4 w-4" />
          Export Institutional Report
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Daily Active Users (DAU)
              </span>
              <p className="mt-1 text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                3,420
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">↑ +14.2% this semester</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Average Campus Attendance
              </span>
              <p className="mt-1 text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                87.8%
              </p>
              <span className="text-[11px] text-zinc-500">Above 75% regulatory line</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Assignment Turn-in Rate
              </span>
              <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                93.4%
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">On-time submissions</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Lab & Facility Utilization
              </span>
              <p className="mt-1 text-2xl font-extrabold text-purple-600">
                82.1%
              </p>
              <span className="text-[11px] text-zinc-500">Peak hours: 11 AM - 3 PM</span>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Realtime Portal Traffic Trends</CardTitle>
              <CardDescription className="text-xs">Hourly user interaction volume across portals</CardDescription>
            </CardHeader>
            <CardContent>
              <CampusActivityChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance Compliance by Subject</CardTitle>
              <CardDescription className="text-xs">University-wide average attendance across core departments</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceChart />
            </CardContent>
          </Card>
        </div>

        {/* Department Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Departmental Performance Summary</CardTitle>
            <CardDescription className="text-xs">Key metrics aggregated for institutional review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase">
                  <tr>
                    <th className="pb-3 font-semibold">Department</th>
                    <th className="pb-3 font-semibold">Students</th>
                    <th className="pb-3 font-semibold">Faculty</th>
                    <th className="pb-3 font-semibold">Avg Attendance</th>
                    <th className="pb-3 font-semibold">Research Output</th>
                    <th className="pb-3 font-semibold">Facility Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <tr>
                    <td className="py-3 font-semibold">Computer Science & Engineering</td>
                    <td>1,240</td>
                    <td>68</td>
                    <td className="text-emerald-600 font-bold">89.4%</td>
                    <td>42 Papers</td>
                    <td>94% (Turing Lab)</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Electronics & Communication</td>
                    <td>980</td>
                    <td>54</td>
                    <td className="text-emerald-600 font-bold">87.1%</td>
                    <td>28 Papers</td>
                    <td>86% (VLSI Lab)</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Mechanical & Mechatronics</td>
                    <td>850</td>
                    <td>48</td>
                    <td className="text-amber-500 font-bold">81.6%</td>
                    <td>19 Papers</td>
                    <td>78% (Workshop)</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Management & Information Systems</td>
                    <td>1,120</td>
                    <td>58</td>
                    <td className="text-emerald-600 font-bold">88.5%</td>
                    <td>31 Papers</td>
                    <td>82% (Case Pods)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
