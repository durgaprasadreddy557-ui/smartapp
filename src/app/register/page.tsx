"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Briefcase, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { registerAction } from "@/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = React.useState<"student" | "faculty" | "admin">("student");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [department, setDepartment] = React.useState("Computer Science & Engineering");
  const [enrollmentNo, setEnrollmentNo] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    try {
      const result = await registerAction({
        fullName,
        email,
        password,
        confirmPassword,
        role,
        department,
        enrollmentNo: enrollmentNo || undefined,
      });

      if (result.success) {
        setSuccessMessage(result.message || "Registration completed successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        if (result.errors) {
          setFieldErrors(result.errors);
        } else if (result.message) {
          setErrorMessage(result.message);
        }
      }
    } catch (err) {
      setErrorMessage((err as Error).message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-blue-50/40 to-indigo-50/30 p-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="text-left">
              <span className="block text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                SMART CAMPUS
              </span>
              <span className="block text-xs font-semibold text-blue-600 dark:text-blue-400">
                Campus Identity Registration
              </span>
            </div>
          </Link>
        </div>

        <Card className="border-zinc-200/90 shadow-xl dark:border-zinc-800">
          <CardHeader className="text-center">
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Register your official student, faculty, or administrative credentials
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Role Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                    role === "student"
                      ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-700 dark:text-blue-400"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("faculty")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                    role === "faculty"
                      ? "bg-white text-amber-600 shadow-sm dark:bg-zinc-700 dark:text-amber-400"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Faculty</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                    role === "admin"
                      ? "bg-white text-rose-600 shadow-sm dark:bg-zinc-700 dark:text-rose-400"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {successMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3.5">
              <Input
                label="Full Legal Name"
                type="text"
                placeholder="e.g. Alex Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={fieldErrors.fullName?.[0]}
                required
              />

              <Input
                label="Institutional Email"
                type="email"
                placeholder="alex.johnson@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email?.[0]}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white/70 px-3.5 py-2 text-xs text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Business Administration">Business Administration</option>
                  </select>
                </div>

                <Input
                  label={role === "student" ? "Roll / Enrollment No." : "Employee ID"}
                  type="text"
                  placeholder={role === "student" ? "CS2026-084" : "FAC-409"}
                  value={enrollmentNo}
                  onChange={(e) => setEnrollmentNo(e.target.value)}
                  error={fieldErrors.enrollmentNo?.[0]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={fieldErrors.password?.[0]}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={fieldErrors.confirmPassword?.[0]}
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
                {loading ? "Registering..." : `Create ${role.toUpperCase()} Account`}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>

            <div className="text-center text-xs text-zinc-500">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                Log in to portal
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
