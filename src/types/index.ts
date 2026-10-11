import { LucideIcon } from "lucide-react";

export type Role = "student" | "faculty" | "admin";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  roles?: Role[];
}

export interface NavCategory {
  title: string;
  items: NavItem[];
}

export interface CampusUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  department?: string;
  enrollmentNo?: string;
  avatarUrl?: string;
}

export interface QuickStat {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  description: string;
}
