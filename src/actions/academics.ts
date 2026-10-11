"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { revalidatePath } from "next/cache";
import {
  timetableSchema,
  attendanceRecordSchema,
  assignmentSchema,
  submissionGradeSchema,
  studyMaterialSchema,
} from "@/lib/validations/campus";
import { getAuthenticatedUserWithRoles, ServerActionResponse } from "./base";

// ==============================================================================
// 1. Timetable Actions
// ==============================================================================

export async function getTimetableAction(day?: string): Promise<ServerActionResponse<any[]>> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: [
        {
          id: "t-1",
          course: { code: "CS601", title: "Data Structures & Algorithms" },
          faculty: { full_name: "Prof. Vivek Sharma" },
          day_of_week: "Monday",
          start_time: "09:00:00",
          end_time: "10:30:00",
          room_number: "Lab 302",
          session_type: "Lecture",
        },
        {
          id: "t-2",
          course: { code: "CS602", title: "Database Management Systems" },
          faculty: { full_name: "Dr. Rajesh Varma" },
          day_of_week: "Monday",
          start_time: "11:30:00",
          end_time: "13:00:00",
          room_number: "Hall 401",
          session_type: "Lecture",
        },
      ],
    };
  }

  const supabase = await createClient();
  let query = supabase.from("timetable").select(`
    id,
    day_of_week,
    start_time,
    end_time,
    room_number,
    session_type,
    course:courses (id, code, title),
    faculty:profiles (id, full_name)
  `).order("start_time", { ascending: true });

  if (day && day !== "All") {
    query = query.eq("day_of_week", day);
  }

  const { data, error } = await query;
  if (error) return { success: false, message: error.message };
  return { success: true, data: data || [] };
}

export async function createTimetableSlotAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = timetableSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/timetable");
      return { success: true, message: "Timetable slot added (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("timetable").insert({
      course_id: parsed.data.courseId,
      faculty_id: parsed.data.facultyId,
      day_of_week: parsed.data.dayOfWeek,
      start_time: parsed.data.startTime,
      end_time: parsed.data.endTime,
      room_number: parsed.data.roomNumber,
      session_type: parsed.data.sessionType,
    }).select().single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/timetable");
    return { success: true, message: "Timetable slot successfully created!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function deleteTimetableSlotAction(id: string): Promise<ServerActionResponse> {
  try {
    const { isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/timetable");
      return { success: true, message: "Timetable slot deleted (Demo Mode)" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("timetable").delete().eq("id", id);
    if (error) return { success: false, message: error.message };

    revalidatePath("/timetable");
    return { success: true, message: "Timetable slot removed." };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ==============================================================================
// 2. Attendance Actions
// ==============================================================================

export async function getAttendanceAction(): Promise<ServerActionResponse<any[]>> {
  try {
    const { user, profile, isMock } = await getAuthenticatedUserWithRoles();
    if (isMock) {
      return {
        success: true,
        data: [
          { code: "CS601", name: "Data Structures & Algorithms", conducted: 32, attended: 29, pct: 90.6, faculty: "Prof. Sharma" },
          { code: "CS602", name: "Database Management Systems", conducted: 28, attended: 26, pct: 92.8, faculty: "Dr. Rajesh V" },
          { code: "CS603", name: "Operating Systems", conducted: 30, attended: 23, pct: 76.6, faculty: "Dr. Nair" },
        ],
      };
    }

    const supabase = await createClient();
    const userRole = (profile as any)?.role || "student";

    if (userRole === "student") {
      // Student: only own attendance
      const { data, error } = await supabase
        .from("attendance")
        .select(`
          id,
          date,
          status,
          remarks,
          course:courses (code, title)
        `)
        .eq("student_id", user.id)
        .order("date", { ascending: false });

      if (error) return { success: false, message: error.message };
      return { success: true, data: data || [] };
    } else {
      // Faculty/Admin: all records
      const { data, error } = await supabase
        .from("attendance")
        .select(`
          id,
          date,
          status,
          remarks,
          course:courses (code, title),
          student:profiles (full_name, email)
        `)
        .order("date", { ascending: false })
        .limit(100);

      if (error) return { success: false, message: error.message };
      return { success: true, data: data || [] };
    }
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function recordAttendanceAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = attendanceRecordSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/attendance");
      return { success: true, message: "Attendance roll call saved (Demo Mode)" };
    }

    const supabase = await createClient();
    const insertPayload = parsed.data.records.map((r) => ({
      course_id: parsed.data.courseId,
      date: parsed.data.date,
      student_id: r.studentId,
      status: r.status,
      remarks: r.remarks,
      recorded_by: user.id,
    }));

    const { error } = await supabase
      .from("attendance")
      .upsert(insertPayload, { onConflict: "student_id,course_id,date" });

    if (error) return { success: false, message: error.message };

    revalidatePath("/attendance");
    return { success: true, message: `Roll call logged for ${parsed.data.records.length} students.` };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ==============================================================================
// 3. Assignments & Submissions Actions
// ==============================================================================

export async function getAssignmentsAction(): Promise<ServerActionResponse<any[]>> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: [
        {
          id: "asg-1",
          title: "Virtual Memory Paging & Replacement Simulation",
          description: "Implement FIFO, LRU, and Optimal page replacement algorithms in C++/Python with comparison graphs.",
          due_date: "2026-10-18T23:59:00Z",
          max_marks: 50,
          status: "pending",
          course: { code: "CS603", title: "Operating Systems" },
          faculty: { full_name: "Dr. Nair" },
        },
      ],
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assignments")
    .select(`
      id,
      title,
      description,
      due_date,
      max_marks,
      file_url,
      course:courses (code, title),
      faculty:profiles (full_name)
    `)
    .order("due_date", { ascending: true });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data || [] };
}

export async function createAssignmentAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = assignmentSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/assignments");
      return { success: true, message: "Assignment created (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("assignments").insert({
      course_id: parsed.data.courseId,
      title: parsed.data.title,
      description: parsed.data.description,
      due_date: parsed.data.dueDate,
      max_marks: parsed.data.maxMarks,
      file_url: parsed.data.fileUrl || null,
      created_by: user.id,
    }).select().single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/assignments");
    return { success: true, message: "Assignment published successfully!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function submitAssignmentDeliverableAction(
  assignmentId: string,
  fileUrl: string,
  notes?: string
): Promise<ServerActionResponse> {
  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles(["student"]);
    if (isMock) {
      revalidatePath("/assignments");
      return { success: true, message: "Assignment deliverable submitted (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("assignment_submissions")
      .upsert(
        {
          assignment_id: assignmentId,
          student_id: user.id,
          file_url: fileUrl,
          submission_notes: notes,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        },
        { onConflict: "assignment_id,student_id" }
      )
      .select()
      .single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/assignments");
    return { success: true, message: "Deliverable uploaded & receipt confirmed!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function gradeSubmissionAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = submissionGradeSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/assignments");
      return { success: true, message: "Submission graded (Demo Mode)" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("assignment_submissions")
      .update({
        marks_received: parsed.data.marksReceived,
        feedback: parsed.data.feedback,
        status: "graded",
        graded_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.submissionId);

    if (error) return { success: false, message: error.message };

    revalidatePath("/assignments");
    return { success: true, message: "Grade committed to student record." };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ==============================================================================
// 4. Study Materials Actions
// ==============================================================================

export async function getStudyMaterialsAction(courseId?: string): Promise<ServerActionResponse<any[]>> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: [
        {
          id: "m-1",
          title: "Unit 3: Relational Calculus & Query Optimization Slides",
          description: "Comprehensive lecture slides for relational calculus and indexing.",
          file_url: "/docs/dbms-unit-3.pdf",
          file_size: "4.8 MB",
          format: "PDF Presentation",
          download_count: 142,
          course: { code: "CS602", title: "Database Management Systems" },
          faculty: { full_name: "Dr. Rajesh Varma" },
        },
      ],
    };
  }

  const supabase = await createClient();
  let query = supabase.from("study_materials").select(`
    id,
    title,
    description,
    file_url,
    file_size,
    format,
    download_count,
    created_at,
    course:courses (code, title),
    faculty:profiles (full_name)
  `).order("created_at", { ascending: false });

  if (courseId) {
    query = query.eq("course_id", courseId);
  }

  const { data, error } = await query;
  if (error) return { success: false, message: error.message };
  return { success: true, data: data || [] };
}

export async function createStudyMaterialAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = studyMaterialSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/materials");
      return { success: true, message: "Material uploaded (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("study_materials").insert({
      course_id: parsed.data.courseId,
      title: parsed.data.title,
      description: parsed.data.description,
      file_url: parsed.data.fileUrl,
      file_size: parsed.data.fileSize,
      format: parsed.data.format,
      uploaded_by: user.id,
    }).select().single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/materials");
    return { success: true, message: "Study material published to course repo!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function deleteStudyMaterialAction(id: string): Promise<ServerActionResponse> {
  try {
    const { isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/materials");
      return { success: true, message: "Study material deleted (Demo Mode)" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("study_materials").delete().eq("id", id);
    if (error) return { success: false, message: error.message };

    revalidatePath("/materials");
    return { success: true, message: "Material removed." };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
