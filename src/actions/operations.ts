"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { revalidatePath } from "next/cache";
import {
  facilitySchema,
  facilityBookingSchema,
  emergencyContactSchema,
  notificationSchema,
  feedbackSchema,
  feedbackResolutionSchema,
} from "@/lib/validations/campus";
import { getAuthenticatedUserWithRoles, ServerActionResponse } from "./base";

// ==============================================================================
// 1. Campus Facilities & Bookings CRUD
// ==============================================================================

export async function getFacilitiesAction(): Promise<ServerActionResponse<any[]>> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: [
        {
          id: "fac-1",
          name: "Turing Advanced Computing Lab",
          category: "Specialized Lab",
          location: "Tech Block A • 3rd Floor",
          capacity: 65,
          operating_hours: "08:00 AM - 10:00 PM",
          status: "available",
          description: "Equipped with 65 high-end GPU workstations for Machine Learning, Deep Learning, and Cloud Virtualization.",
        },
        {
          id: "fac-2",
          name: "Sir C.V. Raman Central Auditorium",
          category: "Auditorium",
          location: "Central Campus Plaza",
          capacity: 850,
          operating_hours: "09:00 AM - 09:00 PM",
          status: "booked",
          description: "Acoustically treated auditorium with Dolby surround audio, 4K digital projection, and dual green rooms.",
        },
      ],
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campus_facilities")
    .select("*")
    .order("name", { ascending: true });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data || [] };
}

export async function createFacilityAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = facilitySchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { isMock } = await getAuthenticatedUserWithRoles(["admin"]);
    if (isMock) {
      revalidatePath("/facilities");
      return { success: true, message: "Facility registered (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("campus_facilities").insert({
      name: parsed.data.name,
      category: parsed.data.category,
      location: parsed.data.location,
      capacity: parsed.data.capacity,
      operating_hours: parsed.data.operatingHours,
      status: parsed.data.status,
      description: parsed.data.description,
    }).select().single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/facilities");
    return { success: true, message: "Facility successfully provisioned!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function bookFacilityAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = facilityBookingSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles();
    if (isMock) {
      revalidatePath("/facilities");
      return { success: true, message: "Booking permit submitted (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("facility_bookings").insert({
      facility_id: parsed.data.facilityId,
      booked_by: user.id,
      booking_date: parsed.data.bookingDate,
      time_slot: parsed.data.timeSlot,
      purpose: parsed.data.purpose,
      status: "approved",
    }).select().single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/facilities");
    return { success: true, message: "Permit approved & schedule slot reserved!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ==============================================================================
// 2. Emergency Contacts CRUD
// ==============================================================================

export async function getEmergencyContactsAction(): Promise<ServerActionResponse<any[]>> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: [
        {
          id: "sos-1",
          name: "Campus Security Control Room",
          designation: "Chief Security Warden",
          phone: "+1 (800) 555-0911",
          alternate_phone: "+1 (800) 555-0912",
          available_hours: "24/7",
          category: "Security",
          priority: 1,
        },
        {
          id: "sos-2",
          name: "University Health Center & Ambulance",
          designation: "Chief Medical Officer",
          phone: "+1 (800) 555-0108",
          alternate_phone: "+1 (800) 555-0109",
          available_hours: "24/7",
          category: "Medical",
          priority: 2,
        },
        {
          id: "sos-3",
          name: "Women Safety & Anti-Ragging Cell",
          designation: "Convenor & Senior Dean",
          phone: "+1 (800) 555-0181",
          available_hours: "24/7",
          category: "Helpline",
          priority: 3,
        },
      ],
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("emergency_contacts")
    .select("*")
    .order("priority", { ascending: true });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data || [] };
}

export async function createEmergencyContactAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = emergencyContactSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { isMock } = await getAuthenticatedUserWithRoles(["admin"]);
    if (isMock) {
      revalidatePath("/emergency");
      return { success: true, message: "SOS contact saved (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("emergency_contacts").insert({
      name: parsed.data.name,
      designation: parsed.data.designation,
      phone: parsed.data.phone,
      alternate_phone: parsed.data.alternatePhone,
      available_hours: parsed.data.availableHours,
      category: parsed.data.category,
      priority: parsed.data.priority,
    }).select().single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/emergency");
    return { success: true, message: "SOS hotline configured!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ==============================================================================
// 3. Notifications CRUD
// ==============================================================================

export async function getNotificationsAction(): Promise<ServerActionResponse<any[]>> {
  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles();
    if (isMock) {
      return {
        success: true,
        data: [
          {
            id: "notif-1",
            title: "Assignment Graded: Data Structures Lab 3",
            message: "Prof. Vivek Sharma has reviewed and graded your shortest path graph implementation. You scored 38/40.",
            is_read: false,
            type: "academic",
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: "notif-2",
            title: "Class Rescheduled: Computer Networks",
            message: "The lecture scheduled for 02:00 PM today has been relocated to Seminar Room 204.",
            is_read: false,
            type: "schedule",
            created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
        ],
      };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return { success: false, message: error.message };
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function markNotificationReadAction(id: string): Promise<ServerActionResponse> {
  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles();
    if (isMock) {
      revalidatePath("/notifications");
      return { success: true };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { success: false, message: error.message };

    revalidatePath("/notifications");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function markAllNotificationsReadAction(): Promise<ServerActionResponse> {
  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles();
    if (isMock) {
      revalidatePath("/notifications");
      return { success: true, message: "All marked as read" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id);

    if (error) return { success: false, message: error.message };

    revalidatePath("/notifications");
    return { success: true, message: "All notifications marked as read." };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ==============================================================================
// 4. Feedback & Grievances CRUD
// ==============================================================================

export async function getFeedbackAction(): Promise<ServerActionResponse<any[]>> {
  try {
    const { user, profile, isMock } = await getAuthenticatedUserWithRoles();
    if (isMock) {
      return {
        success: true,
        data: [
          {
            id: "fb-1",
            category: "Infrastructure",
            subject: "Air conditioning in Turing Lab 302 not functioning properly",
            description: "Workstations generate excessive thermal output during GPU compilation. Room temperature exceeds 30C.",
            status: "under_review",
            is_anonymous: false,
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      };
    }

    const supabase = await createClient();
    const userRole = (profile as any)?.role || "student";

    let query = supabase.from("feedback").select(`
      id,
      category,
      subject,
      description,
      status,
      is_anonymous,
      admin_notes,
      created_at,
      submitted_by:profiles (full_name, email)
    `).order("created_at", { ascending: false });

    // Students only view their own feedback; Admins view all
    if (userRole !== "admin") {
      query = query.eq("submitted_by", user.id);
    }

    const { data, error } = await query;
    if (error) return { success: false, message: error.message };
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function submitFeedbackAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = feedbackSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { user, isMock } = await getAuthenticatedUserWithRoles();
    if (isMock) {
      revalidatePath("/feedback");
      return { success: true, message: "Grievance ticket registered (Demo Mode)" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("feedback").insert({
      category: parsed.data.category,
      subject: parsed.data.subject,
      description: parsed.data.description,
      is_anonymous: parsed.data.isAnonymous,
      submitted_by: parsed.data.isAnonymous ? null : user.id,
      status: "pending",
    }).select().single();

    if (error) return { success: false, message: error.message };

    revalidatePath("/feedback");
    return { success: true, message: "Grievance ticket logged with campus administration!", data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function resolveFeedbackAction(formData: unknown): Promise<ServerActionResponse> {
  const parsed = feedbackResolutionSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { isMock } = await getAuthenticatedUserWithRoles(["admin"]);
    if (isMock) {
      revalidatePath("/feedback");
      return { success: true, message: "Feedback resolved (Demo Mode)" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("feedback")
      .update({
        status: parsed.data.status,
        admin_notes: parsed.data.adminNotes,
      })
      .eq("id", parsed.data.feedbackId);

    if (error) return { success: false, message: error.message };

    revalidatePath("/feedback");
    return { success: true, message: `Feedback ticket status updated to ${parsed.data.status}.` };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
