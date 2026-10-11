"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { revalidatePath } from "next/cache";

export interface ServerActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Helper to securely get current user & profile and check authorized roles
 */
export async function getAuthenticatedUserWithRoles(allowedRoles?: Array<"student" | "faculty" | "admin">) {
  if (!isSupabaseConfigured()) {
    // Development fallback mock
    return {
      user: { id: "mock-user-id", email: "demo@campus.edu" },
      profile: { id: "mock-user-id", full_name: "Demo User", role: "admin" },
      isMock: true,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized. Please log in to perform this action.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userRole = (profile as { role?: "student" | "faculty" | "admin" } | null)?.role || "student";

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    throw new Error(`Forbidden: Action requires one of [${allowedRoles.join(", ")}] permissions.`);
  }

  return { user, profile, isMock: false };
}
