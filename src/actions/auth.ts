"use server";

import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { redirect } from "next/navigation";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Real Supabase Auth Login Action
 */
export async function loginAction(values: unknown): Promise<ActionResult<{ role?: string; redirectUrl?: string }>> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    // Graceful offline mock response during local inspection without active credentials
    return {
      success: true,
      message: "Demo Mode Authenticated (Supabase credentials not configured in .env.local)",
      data: { role: "student", redirectUrl: "/dashboard/student" },
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // Fetch verified user role from profiles table (server-side verification)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const userRole = (profile as { role?: string } | null)?.role || "student";
  const redirectUrl =
    userRole === "admin"
      ? "/dashboard/admin"
      : userRole === "faculty"
      ? "/dashboard/faculty"
      : "/dashboard/student";

  return {
    success: true,
    message: "Logged in successfully",
    data: { role: userRole, redirectUrl },
  };
}

/**
 * Real Supabase Auth Register Action
 */
export async function registerAction(values: unknown): Promise<ActionResult<{ role?: string }>> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: "Demo Account Staged (Provide real Supabase credentials in .env.local for live persistence)",
      data: { role: parsed.data.role },
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        role: parsed.data.role,
        department: parsed.data.department,
        enrollment_no: parsed.data.enrollmentNo || null,
        phone: parsed.data.phone || null,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Account created successfully! Check your email if confirmation is required.",
    data: { role: parsed.data.role },
  };
}

/**
 * Real Supabase Auth Forgot Password Action
 */
export async function forgotPasswordAction(values: unknown): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: "Password recovery link dispatched (Demo mode)",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "If an account exists with this email, a password reset link has been dispatched.",
  };
}

/**
 * Real Supabase Auth Update Password Action
 */
export async function updatePasswordAction(values: unknown): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: "Password updated successfully (Demo mode)",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Your password has been successfully updated.",
  };
}

/**
 * Sign out current user session
 */
export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}

/**
 * Get current authenticated user and profile securely from server
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      user,
      profile,
    };
  } catch {
    return null;
  }
}
