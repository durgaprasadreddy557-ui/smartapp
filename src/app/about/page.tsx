import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Shield,
  Zap,
  Users,
  Award,
  Globe2,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-zinc-200/80 bg-white/60 py-20 dark:border-zinc-800/80 dark:bg-zinc-900/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="info" className="mb-4">
              Academic Infrastructure 2.0
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              About <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">SMART CAMPUS</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Smart Campus is a comprehensive, enterprise-grade digital platform engineered to unify university academic workflows, student self-service, faculty course administration, and executive institutional governance.
            </p>
          </div>
        </section>

        {/* Pillars / Values */}
        <section className="py-16 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Core Pillars of the Platform
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Engineered with modern architecture principles for academic reliability and security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all border-blue-500/10">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2 dark:bg-blue-500/20 dark:text-blue-400">
                  <Zap className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Realtime Campus Synchronization</CardTitle>
                <CardDescription className="text-xs">
                  Instant updates for urgent notices, class cancellations, timetable shifts, and emergency alerts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Leveraging PostgreSQL listen/notify channels and Supabase Realtime websocket subscriptions, the platform keeps thousands of active devices synchronized without manual page refreshes.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-indigo-500/10">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-2 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <Shield className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Zero-Trust Role-Based Security</CardTitle>
                <CardDescription className="text-xs">
                  Row-Level Security (RLS) policies protecting gradebooks, records, and student privacy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Fine-grained access controls ensure students only read their own academic transcripts, faculty govern their designated course cohorts, and administrative audit trails log critical changes.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-violet-500/10">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center mb-2 dark:bg-violet-500/20 dark:text-violet-400">
                  <Award className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Production Performance</CardTitle>
                <CardDescription className="text-xs">
                  Next.js App Router, SSR, Turbopack, and Tailwind CSS.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Engineered with server-side caching, fluid typography, responsive tables, and accessibility standards to provide smooth load times across devices on campus Wi-Fi or mobile networks.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* System Stats Showcase */}
        <section className="py-12 bg-white/50 border-y border-zinc-200/80 dark:bg-zinc-900/40 dark:border-zinc-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">99.9%</p>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">Uptime Reliability</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">18+</p>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">Integrated Campus Modules</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">3</p>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">Dedicated User Roles</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">&lt;50ms</p>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">Realtime Event Latency</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center max-w-4xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Ready to experience the unified campus portal?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 mb-6 max-w-lg mx-auto">
            Choose your designated portal or authenticate with your university email.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Sign In to Portal <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg">
                Explore Modules
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
