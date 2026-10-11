"use client";

import * as React from "react";
import { Users, UserPlus, Search, Filter, Shield, MoreVertical, CheckCircle2, Lock } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin";
  dept: string;
  status: "Active" | "Pending" | "Suspended";
  joined: string;
}

const initialUsers: UserProfile[] = [
  { id: "usr-1", name: "Alex Morgan", email: "alex.m@student.campus.edu", role: "student", dept: "Computer Science", status: "Active", joined: "Aug 2024" },
  { id: "usr-2", name: "Dr. Rajesh Varma", email: "rajesh.v@campus.edu", role: "faculty", dept: "Computer Science", status: "Active", joined: "Jul 2021" },
  { id: "usr-3", name: "Samantha Cole", email: "samantha.c@admin.campus.edu", role: "admin", dept: "Central Registrar", status: "Active", joined: "Jan 2020" },
  { id: "usr-4", name: "David Kim", email: "david.k@student.campus.edu", role: "student", dept: "Electronics", status: "Active", joined: "Aug 2024" },
  { id: "usr-5", name: "Prof. Ananya Rao", email: "ananya.rao@campus.edu", role: "faculty", dept: "Computer Science", status: "Active", joined: "Jan 2022" },
  { id: "usr-6", name: "Elena Rostova", email: "elena.r@student.campus.edu", role: "student", dept: "Mechanical", status: "Pending", joined: "Oct 2026" },
];

export default function AdminUsersPage() {
  const { success, info } = useToast();
  const [users, setUsers] = React.useState<UserProfile[]>(initialUsers);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [addUserModalOpen, setAddUserModalOpen] = React.useState(false);

  // New User Form State
  const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    role: "student" as const,
    dept: "Computer Science",
  });

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.dept.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created: UserProfile = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      dept: newUser.dept,
      status: "Active",
      joined: "Just now",
    };
    setUsers([created, ...users]);
    setAddUserModalOpen(false);
    success("User Account Provisioned", `${newUser.name} registered in Supabase Auth & profiles table.`);
    setNewUser({ name: "", email: "", role: "student", dept: "Computer Science" });
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "Active" ? "Suspended" : "Active";
          info(`User status modified to ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  return (
    <DashboardShell
      title="Campus User Accounts & Access Control"
      description="Manage student, faculty, and administrative identity records in Supabase PostgreSQL"
      actions={
        <Button size="sm" onClick={() => setAddUserModalOpen(true)} className="gap-1.5">
          <UserPlus className="h-4 w-4" />
          Provision Account
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/60 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            {["all", "student", "faculty", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  roleFilter === r
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {r === "all" ? "All Accounts" : r}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
        </div>

        {/* User Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User / Identity</TableHead>
              <TableHead>Assigned Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{u.name}</span>
                  <span className="block text-[11px] text-zinc-500">{u.email}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      u.role === "admin"
                        ? "destructive"
                        : u.role === "faculty"
                        ? "warning"
                        : "info"
                    }
                    className="capitalize"
                  >
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-zinc-600 dark:text-zinc-300">{u.dept}</TableCell>
                <TableCell className="text-xs text-zinc-500">{u.joined}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      u.status === "Active"
                        ? "success"
                        : u.status === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => toggleStatus(u.id)}
                  >
                    {u.status === "Active" ? "Suspend" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Provision Account Modal */}
      <Modal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        title="Provision University Account"
        description="Creates credential record in Supabase Auth and seeds database profile"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Jordan Lee"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />

          <Input
            label="Institutional Email"
            type="email"
            required
            placeholder="jordan.l@campus.edu"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Designated Role
              </label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty Instructor</option>
                <option value="admin">Campus Administrator</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Department
              </label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={newUser.dept}
                onChange={(e) => setNewUser({ ...newUser, dept: e.target.value })}
              >
                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Management</option>
                <option>Central Registrar</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setAddUserModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Identity</Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
