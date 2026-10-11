import { z } from "zod";

// ==========================================
// 1. Profile Schemas
// ==========================================
export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  department: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const studentProfileSchema = z.object({
  enrollmentNo: z.string().min(3, "Enrollment number is required"),
  currentSemester: z.coerce.number().min(1).max(10).default(1),
  admissionYear: z.coerce.number().min(2015).max(2035).default(2026),
  academicStanding: z.string().default("Good"),
});

export const facultyProfileSchema = z.object({
  employeeId: z.string().optional(),
  designation: z.string().min(2, "Designation is required"),
  officeLocation: z.string().optional(),
  officeHours: z.string().optional(),
  researchInterests: z.array(z.string()).optional(),
  qualifications: z.string().optional(),
});

// ==========================================
// 2. Announcements Schema
// ==========================================
export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  urgency: z.enum(["normal", "important", "emergency"]).default("normal"),
  targetAudience: z.enum(["all", "students", "faculty"]).default("all"),
  pinned: z.boolean().default(false),
});

// ==========================================
// 3. Events Schema
// ==========================================
export const eventSchema = z.object({
  title: z.string().min(3, "Event title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  venue: z.string().min(2, "Venue is required"),
  organizer: z.string().min(2, "Organizer is required"),
  category: z.string().default("Academic"),
});

// ==========================================
// 4. Timetable Schema
// ==========================================
export const timetableSchema = z.object({
  courseId: z.string().uuid("Valid course ID is required"),
  facultyId: z.string().uuid().optional(),
  dayOfWeek: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  sessionType: z.enum(["Lecture", "Lab", "Tutorial"]).default("Lecture"),
});

// ==========================================
// 5. Attendance Schema
// ==========================================
export const attendanceRecordSchema = z.object({
  courseId: z.string().uuid("Valid course ID required"),
  date: z.string().min(1, "Date required"),
  records: z.array(
    z.object({
      studentId: z.string().uuid(),
      status: z.enum(["present", "absent", "late", "excused"]),
      remarks: z.string().optional(),
    })
  ),
});

// ==========================================
// 6. Assignments & Submissions
// ==========================================
export const assignmentSchema = z.object({
  courseId: z.string().uuid("Valid course ID required"),
  title: z.string().min(3, "Assignment title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dueDate: z.string().min(1, "Due date is required"),
  maxMarks: z.coerce.number().min(1).default(100),
  fileUrl: z.string().url().optional().or(z.literal("")),
});

export const submissionGradeSchema = z.object({
  submissionId: z.string().uuid(),
  marksReceived: z.coerce.number().min(0),
  feedback: z.string().optional(),
  status: z.enum(["submitted", "graded"]).default("graded"),
});

// ==========================================
// 7. Study Materials
// ==========================================
export const studyMaterialSchema = z.object({
  courseId: z.string().uuid("Valid course ID required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  fileUrl: z.string().min(1, "File URL or path is required"),
  fileSize: z.string().optional(),
  format: z.string().default("PDF"),
});

// ==========================================
// 8. Campus Facilities & Booking
// ==========================================
export const facilitySchema = z.object({
  name: z.string().min(3, "Facility name is required"),
  category: z.string().min(2, "Category is required"),
  location: z.string().min(2, "Location is required"),
  capacity: z.coerce.number().min(1).default(50),
  operatingHours: z.string().min(1, "Operating hours required"),
  status: z.enum(["available", "booked", "maintenance"]).default("available"),
  description: z.string().optional(),
});

export const facilityBookingSchema = z.object({
  facilityId: z.string().uuid(),
  bookingDate: z.string().min(1, "Booking date required"),
  timeSlot: z.string().min(1, "Time slot required"),
  purpose: z.string().min(5, "Purpose must be at least 5 characters"),
});

// ==========================================
// 9. Emergency Contacts
// ==========================================
export const emergencyContactSchema = z.object({
  name: z.string().min(3, "Contact name required"),
  designation: z.string().min(2, "Designation required"),
  phone: z.string().min(5, "Phone number required"),
  alternatePhone: z.string().optional(),
  availableHours: z.string().default("24/7"),
  category: z.enum(["Emergency", "Medical", "Security", "Helpline"]).default("Emergency"),
  priority: z.coerce.number().default(1),
});

// ==========================================
// 10. Notifications
// ==========================================
export const notificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(3, "Title required"),
  message: z.string().min(5, "Message required"),
  type: z.enum(["general", "academic", "schedule", "emergency", "admin"]).default("general"),
  link: z.string().optional(),
});

// ==========================================
// 11. Feedback Schema
// ==========================================
export const feedbackSchema = z.object({
  category: z.enum(["Academic", "Hostel", "Canteen", "Infrastructure", "Other"]),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Please provide at least 20 characters of detail"),
  isAnonymous: z.boolean().default(false),
});

export const feedbackResolutionSchema = z.object({
  feedbackId: z.string().uuid(),
  status: z.enum(["pending", "under_review", "resolved", "dismissed"]),
  adminNotes: z.string().optional(),
});

// ==========================================
// 12. Search Schema
// ==========================================
export const searchSchema = z.object({
  query: z.string().min(1, "Search term cannot be empty"),
  category: z.enum(["all", "announcements", "events", "faculty", "facilities", "courses"]).default("all"),
});
