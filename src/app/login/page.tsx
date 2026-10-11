"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Briefcase, ShieldAlert, ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = React.useState<"student" | "faculty" | "admin">("student");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const result = await loginAction({
        email,
        password,
      });

      if (result.success) {
        const dest =
          result.data?.redirectUrl ||
          (selectedRole === "admin"
            ? "/dashboard/admin"
            : selectedRole === "faculty"
            ? "/dashboard/faculty"
            : "/dashboard/student");
        router.push(dest);
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
      <div className="w-full max-w-md">
        {/* Brand */}
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
                Single Sign-On Portal
              </span>
            </div>
          </Link>
        </div>

        <Card className="border-zinc-200/90 shadow-xl dark:border-zinc-800">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Select your role and authenticate with your institutional account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Role Switcher */}
            <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80">
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                  selectedRole === "student"
                    ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-700 dark:text-blue-400"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("faculty")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                  selectedRole === "faculty"
                    ? "bg-white text-amber-600 shadow-sm dark:bg-zinc-700 dark:text-amber-400"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                  selectedRole === "admin"
                    ? "bg-white text-rose-600 shadow-sm dark:bg-zinc-700 dark:text-rose-400"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Institutional Email"
                type="email"
                placeholder={
                  selectedRole === "student"
                    ? "student@campus.edu"
                    : selectedRole === "faculty"
                    ? "professor@campus.edu"
                    : "admin@campus.edu"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email?.[0]}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password?.[0]}
                required
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-400">
                  <input type="checkbox" className="rounded border-zinc-300 text-blue-600" />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Authenticating..." : `Log in as ${selectedRole.toUpperCase()}`}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>

            <div className="text-center text-xs text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
