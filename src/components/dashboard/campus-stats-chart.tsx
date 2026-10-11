"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const activityData = [
  { day: "Mon", activeUsers: 1420, submissions: 320 },
  { day: "Tue", activeUsers: 1890, submissions: 480 },
  { day: "Wed", activeUsers: 2100, submissions: 540 },
  { day: "Thu", activeUsers: 1950, submissions: 410 },
  { day: "Fri", activeUsers: 1780, submissions: 610 },
  { day: "Sat", activeUsers: 920, submissions: 190 },
  { day: "Sun", activeUsers: 640, submissions: 110 },
];

export function CampusActivityChart() {
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
        <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} stroke="#888888" />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} stroke="#888888" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-zinc-200 bg-white p-2.5 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                      {payload[0].payload.day}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Active Users: <span className="font-bold">{payload[0].value}</span>
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      Submissions: <span className="font-bold">{payload[1]?.value}</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="activeUsers"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#userGrad)"
          />
          <Area
            type="monotone"
            dataKey="submissions"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#subGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
