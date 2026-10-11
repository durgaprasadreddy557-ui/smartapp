"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, BookOpen, Users, Bell, Building2, Calendar, FileText, PhoneCall, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { EmptyState } from "@/components/ui/state-views";

interface SearchEntry {
  id: string;
  title: string;
  category: "Courses" | "Faculty" | "Announcements" | "Facilities" | "Events" | "Emergency";
  href: string;
  desc: string;
  badge?: string;
}

const campusDatabase: SearchEntry[] = [
  {
    id: "s-1",
    title: "Data Structures & Algorithms (CS601)",
    category: "Courses",
    href: "/timetable",
    desc: "Core course, instructor Prof. Sharma, timetable Monday 09:00 AM, Lab 302.",
    badge: "CS601",
  },
  {
    id: "s-2",
    title: "Database Management Systems (CS602)",
    category: "Courses",
    href: "/timetable",
    desc: "Relational calculus, SQL normalization, Dr. Rajesh Varma, Hall 401.",
    badge: "CS602",
  },
  {
    id: "s-3",
    title: "Operating Systems & Concurrency (CS603)",
    category: "Courses",
    href: "/timetable",
    desc: "Virtual memory, kernel threads, scheduling algorithms, Dr. Meenakshi Nair.",
    badge: "CS603",
  },
  {
    id: "s-4",
    title: "Dr. Rajesh Varma",
    category: "Faculty",
    href: "/faculty",
    desc: "Professor & Head of Department • Cabin 304, Tech Block A • rajesh.v@campus.edu",
    badge: "HOD",
  },
  {
    id: "s-5",
    title: "Prof. Ananya Rao",
    category: "Faculty",
    href: "/faculty",
    desc: "Associate Professor • Cabin 212, Tech Block A • Software Defined Networks & 5G/6G.",
  },
  {
    id: "s-6",
    title: "Dr. Vivek Sharma",
    category: "Faculty",
    href: "/faculty",
    desc: "Assistant Professor • Cabin 108, Tech Block B • Graph Analytics & Complexity.",
  },
  {
    id: "s-7",
    title: "End-Semester Examination Circular & Hall Tickets",
    category: "Announcements",
    href: "/announcements",
    desc: "Official timetable for November 2026 End-Semester Examinations with mandatory 75% attendance criteria.",
    badge: "Urgent",
  },
  {
    id: "s-8",
    title: "Smart Campus Hackathon 2026 Registrations",
    category: "Events",
    href: "/events",
    desc: "48-hour competitive innovation hackathon covering Generative AI and IoT edge systems.",
    badge: "Oct 24-26",
  },
  {
    id: "s-9",
    title: "Turing Advanced Computing Lab",
    category: "Facilities",
    href: "/facilities",
    desc: "Specialized GPU workstations • Tech Block A • Capacity 65 • Operating 08:00 AM - 10:00 PM.",
    badge: "Available",
  },
  {
    id: "s-10",
    title: "Sir C.V. Raman Central Auditorium",
    category: "Facilities",
    href: "/facilities",
    desc: "850-seat acoustically treated auditorium with Dolby surround audio and dual green rooms.",
  },
  {
    id: "s-11",
    title: "Collaborative Study Pods (Library)",
    category: "Facilities",
    href: "/facilities",
    desc: "Sound-isolated breakout room equipped with smart digital whiteboards in Central Library Floor 2.",
  },
  {
    id: "s-12",
    title: "Campus Security Quick Response Desk",
    category: "Emergency",
    href: "/emergency",
    desc: "Immediate 24/7 security hotline for medical, security, fire safety, and counseling hotlines: +1 (800) 555-0911.",
    badge: "24/7 SOS",
  },
];

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  const [selectedCat, setSelectedCat] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<"relevance" | "title">("relevance");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const categories = ["All", "Courses", "Faculty", "Announcements", "Events", "Facilities", "Emergency"];

  // Filter & Search logic
  const filtered = campusDatabase.filter((item) => {
    const matchCat = selectedCat === "All" || item.category === selectedCat;
    const matchQuery =
      !query ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0; // relevance preserves natural search order
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCategoryChange = (cat: string) => {
    setSelectedCat(cat);
    setCurrentPage(1);
  };

  const handleQueryChange = (q: string) => {
    setQuery(q);
    setCurrentPage(1);
  };

  return (
    <DashboardShell
      title="Global Campus Intelligence Search"
      description="Quickly find faculty, course schedules, examination circulars, events, and facilities"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search across courses, faculty, events, rooms, circulars..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-12 pr-4 text-sm text-zinc-900 shadow-sm placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            autoFocus
          />
        </div>

        {/* Filter Pills & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCat === c
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="relevance">Relevance</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Search Results List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
            <span>
              Showing {paginated.length} of {sorted.length} results
            </span>
            {selectedCat !== "All" && (
              <Badge variant="outline">Filtered by {selectedCat}</Badge>
            )}
          </div>

          {paginated.length === 0 ? (
            <EmptyState
              title="No Results Matched"
              description={`We couldn't find any campus entities matching "${query}". Try searching for course codes like CS601 or faculty names.`}
              actionLabel="Clear Filters"
              onAction={() => {
                setQuery("");
                setSelectedCat("All");
              }}
            />
          ) : (
            paginated.map((r) => (
              <Link key={r.id} href={r.href} className="block group">
                <Card className="hover:border-blue-500/50 hover:shadow-md transition-all">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">
                          {r.category}
                        </Badge>
                        {r.badge && (
                          <Badge variant="info" className="text-[10px]">
                            {r.badge}
                          </Badge>
                        )}
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {r.title}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 text-xs">
            <span className="text-zinc-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="gap-1 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="gap-1 text-xs"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
