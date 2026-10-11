"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface AttendanceChartProps {
  data?: Array<{ subject: string; percentage: number }>;
}

const defaultData = [
  { subject: "Data Structures", percentage: 88 },
  { subject: "Database Sys", percentage: 92 },
  { subject: "Algorithms", percentage: 81 },
  { subject: "Computer Networks", percentage: 76 },
  { subject: "Software Eng", percentage: 95 },
];

export function AttendanceChart({ data = defaultData }: AttendanceChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-zinc-400">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis
            dataKey="subject"
            tick={{ fontSize: 11 }}
            tickLine={false}
            stroke="#888888"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
            tickLine={false}
            stroke="#888888"
            unit="%"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-zinc-200 bg-white p-2.5 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {payload[0].payload.subject}
                    </p>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Attendance: {payload[0].value}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="percentage"
            fill="url(#blueGradient)"
            radius={[6, 6, 0, 0]}
          />
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
