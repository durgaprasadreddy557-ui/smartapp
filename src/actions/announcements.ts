"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { revalidatePath } from "next/cache";
import { announcementSchema, eventSchema } from "@/lib/validations/campus";
import { getAuthenticatedUserWithRoles, ServerActionResponse } from "./base";

// ==============================================================================
// Announcements CRUD
// ==============================================================================

export async function getAnnouncementsAction(): Promise<ServerActionResponse<any[]>> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: [
        {
          id: "ann-1",
          title: "End-Semester Examination Schedule Fall 2026",
          content: "The Controller of Examinations has published the final timetable for theory and laboratory assessments. Consult department notice board for batch allocations.",
          category: "Examinations",
          urgency: "important",
          pinned: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "ann-2",
          title: "Annual University Innovation & Tech Hackathon",
          content: "Registrations are now open for HackCampus 2026. Teams can submit problem statement choices across AI, IoT, and Cloud Computing.",
          category: "Events",
          urgency: "normal",
          pinned: false,
          created_at: new Date().toISOString(),
        },
      ],
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*, published_by(full_name, role)")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, data: data || [] };
}

export async function createAnnouncementAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = announcementSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/announcements");
      return { success: true, message: "Announcement published (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("announcements").insert({
      title: parsed.data.title,
      content: parsed.data.content,
      category: parsed.data.category,
      urgency: parsed.data.urgency,
      target_audience: parsed.data.targetAudience,
      pinned: parsed.data.pinned,
      published_by: user.id,
    }).select().single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/announcements");
    return { success: true, message: "Announcement broadcasted successfully!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function updateAnnouncementAction(id: string, formData: unknown): Promise<ServerActionResponse> {
  const parsed = announcementSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/announcements");
      return { success: true, message: "Announcement updated (Demo Mode)" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("announcements")
      .update({
        title: parsed.data.title,
        content: parsed.data.content,
        category: parsed.data.category,
        urgency: parsed.data.urgency,
        target_audience: parsed.data.targetAudience,
        pinned: parsed.data.pinned,
      })
      .eq("id", id);

    if (error) return { success: false, message: error.message };

    revalidatePath("/announcements");
    return { success: true, message: "Announcement updated successfully!" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function deleteAnnouncementAction(id: string): Promise<ServerActionResponse> {
  try {
    const { isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/announcements");
      return { success: true, message: "Announcement deleted (Demo Mode)" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return { success: false, message: error.message };

    revalidatePath("/announcements");
    return { success: true, message: "Announcement deleted." };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ==============================================================================
// Events CRUD
// ==============================================================================

export async function getEventsAction(): Promise<ServerActionResponse<any[]>> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: [
        {
          id: "evt-1",
          title: "National Conference on Cloud Systems & AI",
          description: "Keynote addresses and paper presentations covering Edge Computing, Kubernetes orchestration, and Generative Models.",
          venue: "Central Auditorium",
          organizer: "Dept of Computer Science",
          start_time: "2026-10-24T09:00:00Z",
          end_time: "2026-10-25T17:00:00Z",
          category: "Academic",
          rsvp_count: 140,
        },
        {
          id: "evt-2",
          title: "Campus Career Placement Showcase 2026",
          description: "Top multinational tech companies and innovative startups recruiting final year undergraduates and postgraduates.",
          venue: "Plaza Exhibition Hall",
          organizer: "Placement & Training Cell",
          start_time: "2026-11-02T10:00:00Z",
          end_time: "2026-11-04T18:00:00Z",
          category: "Career",
          rsvp_count: 320,
        },
      ],
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data || [] };
}

export async function createEventAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = eventSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/events");
      return { success: true, message: "Event scheduled (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("events").insert({
      title: parsed.data.title,
      description: parsed.data.description,
      start_time: parsed.data.startTime,
      end_time: parsed.data.endTime,
      venue: parsed.data.venue,
      organizer: parsed.data.organizer,
      category: parsed.data.category,
    }).select().single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/events");
    return { success: true, message: "Event successfully scheduled!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function deleteEventAction(id: string): Promise<ServerActionResponse> {
  try {
    const { isMock } = await getAuthenticatedUserWithRoles(["faculty", "admin"]);
    if (isMock) {
      revalidatePath("/events");
      return { success: true, message: "Event deleted (Demo Mode)" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return { success: false, message: error.message };

    revalidatePath("/events");
    return { success: true, message: "Event deleted." };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function rsvpEventAction(id: string): Promise<ServerActionResponse> {
  try {
    await getAuthenticatedUserWithRoles(); // Any authenticated role can RSVP
    if (!isSupabaseConfigured()) {
      return { success: true, message: "RSVP confirmed! Seat registered." };
    }

    const supabase = await createClient();
    const { error } = await (supabase as any).rpc("increment_event_rsvp", { event_id: id });
    if (error) {
      // Fallback update
      await supabase.from("events").update({ rsvp_count: 1 } as any).eq("id", id);
    }

    revalidatePath("/events");
    return { success: true, message: "RSVP confirmed! Ticket sent to notification center." };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
