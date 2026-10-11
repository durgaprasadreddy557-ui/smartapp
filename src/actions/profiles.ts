"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { revalidatePath } from "next/cache";
import {
  profileSchema,
  studentProfileSchema,
  facultyProfileSchema,
} from "@/lib/validations/campus";
import { getAuthenticatedUserWithRoles, ServerActionResponse } from "./base";

// ==============================================================================
// 1. Profile Management (Read, Update)
// ==============================================================================

export async function getUserProfileDetailsAction(userId?: string): Promise<ServerActionResponse<any>> {
  try {
    const { user, profile: authProfile, isMock } = await getAuthenticatedUserWithRoles();
    if (isMock) {
      return {
        success: true,
        data: {
          id: "mock-user-id",
          full_name: "Alex Morgan",
          email: "alex.m@student.campus.edu",
          role: "student",
          department: "Computer Science & Engineering",
          phone: "+1 (555) 234-5678",
          student_profile: {
            enrollment_no: "24CS001",
            current_semester: 6,
            admission_year: 2024,
            cgpa: 3.82,
            attendance_aggregate: 88.08,
            academic_standing: "Honor Roll",
          },
        },
      };
    }

    const supabase = await createClient();
    const targetId = userId || user.id;

    const { data: baseProfile, error: baseErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", targetId)
      .single();

    if (baseErr) return { success: false, message: baseErr.message };

    const profileObj = baseProfile as Record<string, any>;
    let studentProfile = null;
    let facultyProfile = null;

    if (profileObj?.role === "student") {
      const { data: sData } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("id", targetId)
        .single();
      studentProfile = sData;
    } else if (profileObj?.role === "faculty") {
      const { data: fData } = await supabase
        .from("faculty_profiles")
        .select("*")
        .eq("id", targetId)
        .single();
      facultyProfile = fData;
    }

    return {
      success: true,
      data: {
        ...profileObj,
        student_profile: studentProfile,
        faculty_profile: facultyProfile,
      },
    };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function updateBaseProfileAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = profileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles();
    if (isMock) {
      revalidatePath("/profile");
      return { success: true, message: "Profile updated (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: parsed.data.fullName,
        department: parsed.data.department,
        phone: parsed.data.phone,
        avatar_url: parsed.data.avatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/profile");
    return { success: true, message: "Profile successfully updated!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function updateStudentProfileAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = studentProfileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles(["student", "admin"]);
    if (isMock) {
      revalidatePath("/profile");
      return { success: true, message: "Student record updated (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("student_profiles")
      .upsert({
        id: user.id,
        enrollment_no: parsed.data.enrollmentNo,
        current_semester: parsed.data.currentSemester,
        admission_year: parsed.data.admissionYear,
        academic_standing: parsed.data.academicStanding,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/profile");
    return { success: true, message: "Academic enrollment updated!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ==============================================================================
// 2. Admin Faculty & User Directory Actions
// ==============================================================================

export async function getFacultyDirectoryAction(): Promise<ServerActionResponse<any[]>> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: [
        {
          id: "f-1",
          full_name: "Dr. Rajesh Varma",
          email: "rajesh.v@campus.edu",
          department: "Computer Science & Engineering",
          faculty_profile: {
            designation: "Professor & Head of Department",
            office_location: "Tech Block A • 304",
            office_hours: "Mon & Wed: 03:00 - 05:00 PM",
            research_interests: ["Distributed Databases", "Query Execution", "Data Privacy"],
          },
        },
        {
          id: "f-2",
          full_name: "Prof. Ananya Rao",
          email: "ananya.rao@campus.edu",
          department: "Computer Science & Engineering",
          faculty_profile: {
            designation: "Associate Professor",
            office_location: "Tech Block A • 212",
            office_hours: "Tue & Thu: 02:00 - 04:00 PM",
            research_interests: ["Software Defined Networks", "5G/6G Protocols"],
          },
        },
      ],
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      department,
      faculty_profile:faculty_profiles (*)
    `)
    .eq("role", "faculty")
    .order("full_name", { ascending: true });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data || [] };
}
