import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Bell,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  BookOpen,
  Users,
  Building2,
  PhoneCall,
  MessageSquare,
  Search,
  Settings,
  User,
  BarChart3,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { NavCategory } from "@/types";

export const campusNavigation: NavCategory[] = [
  {
    title: "Portals",
    items: [
      {
        title: "Student Portal",
        href: "/dashboard/student",
        icon: GraduationCap,
        roles: ["student", "admin"],
      },
      {
        title: "Faculty Portal",
        href: "/dashboard/faculty",
        icon: Briefcase,
        roles: ["faculty", "admin"],
      },
      {
        title: "Admin Command",
        href: "/dashboard/admin",
        icon: ShieldAlert,
        badge: "Admin",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Admin Management",
    items: [
      {
        title: "User Directory",
        href: "/dashboard/admin/users",
        icon: Users,
        roles: ["admin"],
      },
      {
        title: "Students Roster",
        href: "/dashboard/admin/students",
        icon: GraduationCap,
        roles: ["admin"],
      },
      {
        title: "Faculty Roster",
        href: "/dashboard/admin/faculty",
        icon: UserCheck,
        roles: ["admin"],
      },
      {
        title: "Campus Analytics",
        href: "/dashboard/admin/analytics",
        icon: BarChart3,
        badge: "Pro",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Academic Hub",
    items: [
      {
        title: "Timetable",
        href: "/timetable",
        icon: Clock,
      },
      {
        title: "Attendance",
        href: "/attendance",
        icon: CheckCircle2,
      },
      {
        title: "Assignments",
        href: "/assignments",
        icon: FileText,
      },
      {
        title: "Study Materials",
        href: "/materials",
        icon: BookOpen,
      },
      {
        title: "Faculty Directory",
        href: "/faculty",
        icon: Users,
      },
    ],
  },
  {
    title: "Campus Life & Safety",
    items: [
      {
        title: "Announcements",
        href: "/announcements",
        icon: Bell,
        badge: "Live",
      },
      {
        title: "Campus Events",
        href: "/events",
        icon: Calendar,
      },
      {
        title: "Facilities & Labs",
        href: "/facilities",
        icon: Building2,
      },
      {
        title: "Emergency SOS",
        href: "/emergency",
        icon: PhoneCall,
        badge: "24/7",
      },
      {
        title: "Feedback & Grievances",
        href: "/feedback",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Account & Preferences",
    items: [
      {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
      },
      {
        title: "Global Search",
        href: "/search",
        icon: Search,
      },
      {
        title: "My Profile",
        href: "/profile",
        icon: User,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];
