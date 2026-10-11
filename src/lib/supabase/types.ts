export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "faculty" | "admin";
export type AnnouncementUrgency = "normal" | "important" | "emergency";
export type AttendanceStatus = "present" | "absent" | "late" | "excused";
export type AssignmentStatus = "pending" | "submitted" | "graded" | "late";
export type FeedbackStatus = "pending" | "under_review" | "resolved" | "dismissed";
export type FacilityStatus = "available" | "booked" | "maintenance";

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
        Relationships: any[];
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, any>;
        Relationships: any[];
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, any>;
        Returns: any;
      };
    };
    Enums: {
      user_role: UserRole;
      announcement_urgency: AnnouncementUrgency;
      attendance_status: AttendanceStatus;
      assignment_status: AssignmentStatus;
      feedback_status: FeedbackStatus;
      facility_status: FacilityStatus;
    };
    CompositeTypes: {
      [key: string]: Record<string, any>;
    };
  };
}
