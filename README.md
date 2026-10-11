# Smart Campus — Next-Generation Institutional Management System

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20Auth%20%7C%20Storage-emerald?logo=supabase)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A unified, production-ready Academic and Operations Operating System designed for modern higher-education colleges and universities. Powered by **Next.js 16 (App Router + Turbopack)**, **Vanilla CSS Design Tokens**, and **Supabase (PostgreSQL 15, RLS, Storage, Realtime)**.

---

## 1. Project Overview

**Smart Campus** is an institutional digital hub connecting students, faculty members, and campus administrators through a single unified portal. The platform replaces disparate legacy software by centralizing real-time attendance compliance, assignment submissions, course study materials, automated timetable orchestration, emergency safety dispatch, grievance/feedback resolution, and campus announcement broadcasting.

---

## 2. Problem Statement

Most collegiate institutions suffer from fragmented digital experiences:
- **Siloed Systems:** Attendance recorded on physical rosters or closed-source portals; courseware distributed through ad-hoc chat channels; assignments handled via unorganized emails.
- **Attendance Blackouts:** Students and parents discover low attendance only when examination hall tickets are blocked at semester end.
- **Security & Authorization Risks:** Insecure authorization models where student roles can access faculty grading or administrative control centers.
- **Sub-par User Experience:** Clunky, slow, non-responsive portals that break on mobile screens.

---

## 3. Solution

Smart Campus addresses these challenges through:
1. **Cryptographically Enforced RBAC:** Role guards at both the Next.js Edge Middleware layer and PostgreSQL Row-Level Security (RLS) tables.
2. **Attendance Intelligence Engine:** Automated calculation of the institutional 75% examination eligibility threshold with early warning alerts.
3. **Unified Academic Operations:** Faculty-managed roll calls, syllabus materials, and assignment lifecycles with student submission tracking.
4. **Campus Safety & Facilities Hub:** One-click SOS emergency contacts and classroom/lab facility directories.
5. **Ultra-Fast Modern SaaS UX:** Built on zero-runtime Tailwind-free Vanilla CSS tokens with dynamic dark/light aesthetics and seamless mobile layout adapters.

---

## 4. Key Features

### 4.1 Public & Institutional Portals
- **Landing Showcase:** Premium hero presentation, platform metrics, campus overview, and interactive system previews.
- **About & Governance:** Institutional mission, departmental directory, and academic council guidelines.
- **Features Matrix:** Functional breakdowns for prospective students and institutional visitors.
- **Contact & Helpdesk:** Department-directed inquiries and campus location information.

### 4.2 Student Experience
- **Consolidated Dashboard:** Academic metrics (CGPA, attendance aggregate, enrolled courses, upcoming deadlines).
- **Attendance & Compliance:** Course-by-course breakdown with visual progress meters and 75% cutoff compliance badges.
- **Academic Timetable:** Interactive weekly grid view with lecture rooms, faculty assignments, and time slots.
- **Coursework & Assignments:** View published assignments, deadlines, submission status, and faculty grading remarks.
- **Study Materials Library:** Filter and download lecture slides, lab manuals, and syllabus roadmaps.
- **Realtime Notifications:** Push notifications for urgent broadcasts, assignment releases, and class reschedules.
- **Grievance & Feedback Submission:** Direct confidential feedback channel to campus administrative heads.

### 4.3 Faculty Workspace
- **Faculty Command Center:** Overview of assigned courses, today's lecture schedule, and pending grading submissions.
- **Digital Attendance Roll Call:** Mark and update course lecture attendance records with real-time aggregate recalculation.
- **Assignment Publisher:** Create assignments with deadlines, attachments, and max scores.
- **Study Repository Management:** Upload documents and resources directly to Supabase Storage with MIME-type verification.
- **Department Notices:** Publish targeted announcements to registered cohort streams.

### 4.4 Administrator Control Center
- **Institutional Governance Dashboard:** Real-time analytics, user distribution metrics, active cohort counts.
- **User & Role Governance:** Activate, review, and manage student and faculty accounts.
- **Academic Scheduling:** Global timetable allocation and classroom conflict resolution.
- **Campus Facilities & Labs:** Directory management for libraries, auditoriums, hostels, and sports grounds.
- **Emergency Safety Dispatch:** Manage campus hospital, security control room, and fire dispatch contacts.
- **Feedback & Incident Resolution:** Review, triage, and resolve student-submitted campus concerns.

---

## 5. User Roles & Access Hierarchy

| Role | Access Level | Description |
|---|---|---|
| **STUDENT** | Read-only Academic, Personal Mutations | Accesses own attendance, assignments, study materials, timetable, feedback, notifications, and profile settings. |
| **FACULTY** | Department Academic Authority | Conducts roll calls, creates assignments, uploads course materials, and publishes course notices. |
| **ADMIN** | Full Institutional Authority | Controls global campus configuration, users, departments, facilities, safety contacts, and analytics. |

---

## 6. Technology Stack

- **Framework:** [Next.js 16 (App Router + Turbopack)](https://nextjs.org/)
- **Language:** [TypeScript 5.x](https://www.typescriptlang.org/) (Strict mode enabled)
- **Database:** [PostgreSQL 15](https://www.postgresql.org/) managed via [Supabase](https://supabase.com/)
- **Security & Auth:** Supabase Auth (JWT, Cookie Session Persistence, PKCE flow)
- **File Storage:** Supabase Storage (MIME validated, strict size boundaries)
- **Validation:** [Zod](https://zod.dev/) type-safe schemas across all Server Actions
- **Styling:** Handcrafted Vanilla CSS Design System (Custom variables, glassmorphism, responsive grid)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 7. Architecture Overview

```
                          ┌────────────────────────┐
                          │   Browser / Mobile     │
                          └───────────┬────────────┘
                                      │  HTTPS / WSS
                                      ▼
             ┌──────────────────────────────────────────────────┐
             │       Next.js 16 App Router (Edge / Node)        │
             │  ┌────────────────────┐  ┌────────────────────┐  │
             │  │  Proxy / Middleware│  │  Server Actions    │  │
             │  │  (Session & RBAC)  │  │  (Zod Validated)   │  │
             │  └─────────┬──────────┘  └─────────┬──────────┘  │
             └────────────┼───────────────────────┼─────────────┘
                          │                       │
           Auth / JWT     │                       │ PostgREST Queries
                          ▼                       ▼
             ┌──────────────────────────────────────────────────┐
             │               Supabase Cloud Platform            │
             │  ┌───────────────┐  ┌──────────────┐  ┌────────┐ │
             │  │ Supabase Auth │  │  PostgreSQL  │  │Storage │ │
             │  │ (GoTrue / JWT)│  │ (15 Tables)  │  │Buckets │ │
             │  └───────────────┘  │ (RLS Enforced│  └────────┘ │
             │                     └──────────────┘             │
             └──────────────────────────────────────────────────┘
```

---

## 8. Database Schema & RLS

The database is built on 15 relational tables with cascading foreign keys, update triggers, and Row-Level Security:

1. `profiles` — Stores full name, email, avatar, and system role (`student`, `faculty`, `admin`).
2. `departments` — Academic branches (e.g., Computer Science, Electrical Engineering).
3. `student_profiles` — Student USN/Roll number, semester, batch year, CGPA.
4. `faculty_profiles` — Faculty employee ID, designation, qualification.
5. `courses` — Course code, credits, department mapping.
6. `announcements` — Campus notifications with priority levels.
7. `campus_events` — Hackathons, workshops, cultural fests.
8. `timetable_entries` — Class periods, day of week, time slots, and rooms.
9. `attendance` — Roll-call log (`present`, `absent`, `late`, `excused`).
10. `assignments` — Course assignment prompts and deadlines.
11. `assignment_submissions` — Student document uploads and faculty grades.
12. `study_materials` — Course syllabus, lecture slides, and notes.
13. `campus_facilities` — Campus grounds, labs, libraries, opening hours.
14. `emergency_contacts` — Campus ambulance, security desks, crisis helplines.
15. `feedback` — Student grievances, categorized with resolution statuses.

*The complete DDL and RLS policies are available in [`supabase/schema.sql`](supabase/schema.sql).*

---

## 9. Installation & Local Development

### Prerequisites
- **Node.js:** v18.17.0 or later (v20+ recommended)
- **Package Manager:** npm or pnpm
- **Supabase Account:** Free tier at [supabase.com](https://supabase.com)

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/smart-campus.git
cd smart-campus
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CAMPUS_NAME="Smart Campus Institute of Technology"
```

### Step 4: Run Database Migrations
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql).
3. Run the script. This provisions all 15 tables, indexes, triggers, and RLS policies.

### Step 5: Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 10. Running Tests & Verifying Build

Verify TypeScript typing integrity:
```bash
npx tsc --noEmit
```

Test production Next.js bundling:
```bash
npm run build
```

Run linter:
```bash
npm run lint
```

---

## 11. Git & GitHub Preparation

Execute the exact sequence below to prepare and publish the clean repository to GitHub:

```bash
# 1. Initialize git
git init

# 2. Add all tracked project files (safe; .env.local and node_modules are ignored)
git add .

# 3. Create initial production release commit
git commit -m "feat: complete production-ready Smart Campus application"

# 4. Set main branch
git branch -M main

# 5. Connect to your GitHub repository
git remote add origin https://github.com/your-username/smart-campus.git

# 6. Push to GitHub
git push -u origin main
```

---

## 12. Production Deployment Guide

### A. Supabase Setup (Database & Backend)
1. Log in to [Supabase Console](https://supabase.com/dashboard) and click **New Project**.
2. Select your closest region and set a secure database password.
3. In **SQL Editor**, execute [`supabase/schema.sql`](supabase/schema.sql).
4. In **Storage**, create 3 buckets:
   * `avatars` (Public: Yes, 2MB size limit)
   * `assignments` (Public: No, authenticated download, 25MB size limit)
   * `materials` (Public: Yes, 50MB size limit)
5. In **Authentication -> URL Configuration**:
   * Set **Site URL** to your production domain: `https://your-project.vercel.app`.
   * Set **Redirect URLs** to include `https://your-project.vercel.app/**`.

### B. Vercel Setup (Frontend Deployment)
1. Go to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select and import your GitHub `smart-campus` repository.
3. Under **Framework Preset**, select **Next.js**.
4. In **Environment Variables**, add:
   * `NEXT_PUBLIC_SUPABASE_URL`: `https://<your-project>.supabase.co`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<your-supabase-anon-key>`
   * `SUPABASE_SERVICE_ROLE_KEY`: `<your-supabase-service-role-key>`
   * `NEXT_PUBLIC_SITE_URL`: `https://<your-project>.vercel.app`
   * `NEXT_PUBLIC_CAMPUS_NAME`: `Smart Campus Institute of Technology`
5. Click **Deploy**. Vercel will build the project with Turbopack and deploy to their global CDN edge in ~60 seconds.

---

## 13. Project Status & Portfolio Summary

- **Project Status:** Production Ready (100% complete)
- **Completed Features:**
  - Full Authentication & Session Engine (Student / Faculty / Admin roles)
  - Edge Middleware RBAC Protection
  - Dynamic Subject Attendance with 75% Compliance Alerts
  - Faculty Assignment Creation & Student Submissions
  - Timetable Grid View & Conflict Monitoring
  - Study Materials Document Repository
  - Campus Facility & Emergency Contact Directory
  - Real-time Campus Broadcast Announcements
  - Grievance / Feedback Tracking Portal
  - 100% Mobile Responsive Layouts
- **Repository Placeholder:** `https://github.com/your-username/smart-campus`
- **Live Demo Placeholder:** `https://smart-campus-demo.vercel.app`
- **Future Improvements:**
  - Automated SMS/WhatsApp attendance alerts for parents
  - RFID / QR code integrated classroom scanner hardware support
  - Integrated fee payment gateway (Stripe / Razorpay)
