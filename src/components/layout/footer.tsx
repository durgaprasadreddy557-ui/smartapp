import * as React from "react";
import Link from "next/link";
import { GraduationCap, Heart, ExternalLink, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200/80 bg-white/70 py-10 dark:border-zinc-800/80 dark:bg-zinc-950/70 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-sm">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                SMART CAMPUS
              </span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              The next-generation unified academic operations and campus management
              platform. Built with Next.js App Router, Tailwind CSS, and Supabase
              PostgreSQL.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-zinc-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Campus Services Operational</span>
              <span>•</span>
              <Link href="/api/health" className="hover:underline text-blue-600 dark:text-blue-400">
                Status API
              </Link>
            </div>
          </div>

          {/* Quick Portals */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
              Portals
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/dashboard/student" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/faculty" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Faculty Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Admin Command
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Secure Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Modules */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
              Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/timetable" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Timetable
                </Link>
              </li>
              <li>
                <Link href="/attendance" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Attendance Tracking
                </Link>
              </li>
              <li>
                <Link href="/assignments" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Assignments
                </Link>
              </li>
              <li>
                <Link href="/materials" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Study Materials
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Facilities & Labs
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Help */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
              Support & Safety
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/emergency" className="text-rose-600 dark:text-rose-400 font-medium hover:underline">
                  Emergency SOS
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Student Grievances
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Contact Helpdesk
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">
                  About Platform
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-zinc-200/80 pt-6 text-[11px] text-zinc-500 sm:flex-row dark:border-zinc-800/80 dark:text-zinc-400">
          <p>© 2026 Smart Campus Platform. Enterprise Academic Edition.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/features" className="hover:underline">
              Features
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/settings" className="hover:underline">
              Privacy & Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
