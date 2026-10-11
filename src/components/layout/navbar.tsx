"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Bell,
  Search,
  PhoneCall,
  Menu,
  X,
  LogIn,
  UserPlus,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-md shadow-blue-500/20 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                SMART CAMPUS
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                Enterprise Portal
              </span>
            </div>
          </Link>

          {/* Quick Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link
              href="/about"
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                pathname === "/about"
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 font-semibold"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              About
            </Link>
            <Link
              href="/features"
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                pathname === "/features"
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 font-semibold"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              Features
            </Link>
            <Link
              href="/contact"
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                pathname === "/contact"
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 font-semibold"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              Contact
            </Link>

            <span className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

            <Link
              href="/dashboard/student"
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                pathname.startsWith("/dashboard/student")
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-semibold"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              Student
            </Link>
            <Link
              href="/dashboard/faculty"
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                pathname.startsWith("/dashboard/faculty")
                  ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 font-semibold"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              Faculty
            </Link>
            <Link
              href="/dashboard/admin"
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                pathname.startsWith("/dashboard/admin")
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 font-semibold"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              Admin
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <Link
            href="/search"
            aria-label="Search Campus"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search modules...</span>
            <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
              /
            </kbd>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white/80 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
              3
            </span>
          </Link>

          {/* Emergency SOS Shortcut */}
          <Link
            href="/emergency"
            className="hidden lg:flex items-center gap-1.5 rounded-xl bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>SOS</span>
          </Link>

          {/* Auth Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-semibold">
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-sm shadow-blue-500/20">
                <UserPlus className="h-3.5 w-3.5" />
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 md:hidden hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-zinc-200 bg-white/95 px-4 pt-3 pb-6 md:hidden dark:border-zinc-800 dark:bg-zinc-950/95 animate-fade-in backdrop-blur-lg">
          <div className="space-y-1 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-sm font-medium">
            <p className="px-3 py-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Navigation
            </p>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              About Platform
            </Link>
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Features & Modules
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Contact Support
            </Link>
          </div>

          <div className="space-y-1 py-3 border-b border-zinc-100 dark:border-zinc-800 text-sm font-medium">
            <p className="px-3 py-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Portals
            </p>
            <Link
              href="/dashboard/student"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
            >
              <span>Student Dashboard</span>
              <Badge variant="info">Portal</Badge>
            </Link>
            <Link
              href="/dashboard/faculty"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
            >
              <span>Faculty Dashboard</span>
              <Badge variant="warning">Portal</Badge>
            </Link>
            <Link
              href="/dashboard/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              <span>Admin Command Center</span>
              <Badge variant="destructive">Admin</Badge>
            </Link>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center">Create Account</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
