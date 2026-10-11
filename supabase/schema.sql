-- ==============================================================================
-- SMART CAMPUS PLATFORM - Enterprise PostgreSQL Database Architecture
-- ==============================================================================

-- Enable UUID Extension
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 1. Custom Types & Enums
-- ==============================================================================
do $$ begin
  create type user_role as enum ('student', 'faculty', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type announcement_urgency as enum ('normal', 'important', 'emergency');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type attendance_status as enum ('present', 'absent', 'late', 'excused');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type assignment_status as enum ('pending', 'submitted', 'graded', 'late');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type feedback_status as enum ('pending', 'under_review', 'resolved', 'dismissed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type facility_status as enum ('available', 'booked', 'maintenance');
exception
  when duplicate_object then null;
end $$;

-- ==============================================================================
-- 2. Core University Organization (Departments & Academic Programs)
-- ==============================================================================
create table if not exists public.departments (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  name text not null,
  building text,
  hod_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 3. Base Identity Profiles (Extends auth.users securely)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role user_role default 'student'::user_role not null,
  department_id uuid references public.departments(id) on delete set null,
  department text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 4. Role-Specific Profiles (Student & Faculty Details)
-- ==============================================================================
create table if not exists public.student_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  enrollment_no text unique not null,
  current_semester integer default 1 not null,
  admission_year integer not null,
  cgpa numeric(3,2) default 0.00 not null,
  attendance_aggregate numeric(5,2) default 100.00 not null,
  academic_standing text default 'Good' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.faculty_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  employee_id text unique,
  designation text not null,
  office_location text,
  office_hours text,
  research_interests text[],
  qualifications text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 5. Academic Courses & Subjects
-- ==============================================================================
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  title text not null,
  department_id uuid references public.departments(id) on delete set null,
  faculty_id uuid references public.profiles(id) on delete set null,
  credits integer default 3 not null,
  semester integer not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 6. Announcements & Broadcast Circulars
-- ==============================================================================
create table if not exists public.announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  category text default 'General' not null,
  urgency announcement_urgency default 'normal'::announcement_urgency not null,
  published_by uuid references public.profiles(id) on delete set null,
  target_audience text default 'all' not null, -- 'all', 'student', 'faculty', 'admin'
  pinned boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 7. Campus Events
-- ==============================================================================
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  venue text not null,
  organizer text not null,
  category text default 'Academic' not null,
  rsvp_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 8. Timetable & Weekly Lecture Schedule
-- ==============================================================================
create table if not exists public.timetable (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  faculty_id uuid references public.profiles(id) on delete set null,
  day_of_week text not null, -- 'Monday', 'Tuesday', ...
  start_time time not null,
  end_time time not null,
  room_number text not null,
  session_type text default 'Lecture' not null, -- 'Lecture', 'Lab', 'Tutorial'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 9. Attendance Tracking
-- ==============================================================================
create table if not exists public.attendance (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  timetable_id uuid references public.timetable(id) on delete set null,
  date date not null,
  status attendance_status default 'present'::attendance_status not null,
  recorded_by uuid references public.profiles(id) on delete set null,
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (student_id, course_id, date)
);

-- ==============================================================================
-- 10. Assignments & Student Submissions
-- ==============================================================================
create table if not exists public.assignments (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text not null,
  due_date timestamp with time zone not null,
  max_marks integer default 100 not null,
  file_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.assignment_submissions (
  id uuid default uuid_generate_v4() primary key,
  assignment_id uuid references public.assignments(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  file_url text not null,
  submission_notes text,
  marks_received integer,
  feedback text,
  status assignment_status default 'submitted'::assignment_status not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  graded_at timestamp with time zone,
  unique (assignment_id, student_id)
);

-- ==============================================================================
-- 11. Study Materials (Storage bucket integration)
-- ==============================================================================
create table if not exists public.study_materials (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  file_url text not null,
  file_size text,
  format text default 'PDF' not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  download_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 12. Campus Facilities & Booking Permits
-- ==============================================================================
create table if not exists public.campus_facilities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  location text not null,
  capacity integer default 50 not null,
  operating_hours text not null,
  status facility_status default 'available'::facility_status not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.facility_bookings (
  id uuid default uuid_generate_v4() primary key,
  facility_id uuid references public.campus_facilities(id) on delete cascade not null,
  booked_by uuid references public.profiles(id) on delete cascade not null,
  booking_date date not null,
  time_slot text not null,
  purpose text not null,
  status text default 'approved' not null, -- 'pending', 'approved', 'rejected'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 13. Emergency SOS Contacts
-- ==============================================================================
create table if not exists public.emergency_contacts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  designation text not null,
  phone text not null,
  alternate_phone text,
  available_hours text default '24/7' not null,
  category text default 'Emergency' not null, -- 'Medical', 'Security', 'Helpline'
  priority integer default 1 not null
);

-- ==============================================================================
-- 14. Realtime Notifications Center
-- ==============================================================================
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'general' not null, -- 'academic', 'schedule', 'emergency', 'admin'
  link text,
  is_read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 15. Student Grievances & Feedback
-- ==============================================================================
create table if not exists public.feedback (
  id uuid default uuid_generate_v4() primary key,
  submitted_by uuid references public.profiles(id) on delete set null,
  is_anonymous boolean default false not null,
  category text not null,
  subject text not null,
  description text not null,
  status feedback_status default 'pending'::feedback_status not null,
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 16. Performance Indexes
-- ==============================================================================
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_student_profiles_enrollment on public.student_profiles(enrollment_no);
create index if not exists idx_courses_code on public.courses(code);
create index if not exists idx_courses_dept on public.courses(department_id);
create index if not exists idx_timetable_day on public.timetable(day_of_week);
create index if not exists idx_attendance_student_date on public.attendance(student_id, date);
create index if not exists idx_assignments_course on public.assignments(course_id);
create index if not exists idx_assignment_submissions_asg on public.assignment_submissions(assignment_id);
create index if not exists idx_study_materials_course on public.study_materials(course_id);
create index if not exists idx_notifications_user_unread on public.notifications(user_id, is_read);
create index if not exists idx_announcements_created on public.announcements(created_at desc);

-- ==============================================================================
-- 17. Automatic Profile & Student/Faculty Sub-Record Synchronization Trigger
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_role public.user_role;
  v_dept text;
  v_enrollment text;
begin
  v_role := coalesce(new.raw_user_meta_data->>'role', 'student')::public.user_role;
  v_dept := coalesce(new.raw_user_meta_data->>'department', 'General Academics');
  v_enrollment := coalesce(new.raw_user_meta_data->>'enrollment_no', '26CS' || floor(random() * 900 + 100)::text);

  -- Insert base profile
  insert into public.profiles (id, email, full_name, role, department, phone, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    v_role,
    v_dept,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    department = excluded.department;

  -- Create sub-profile based on role
  if v_role = 'student' then
    insert into public.student_profiles (id, enrollment_no, current_semester, admission_year)
    values (new.id, v_enrollment, 1, extract(year from now())::integer)
    on conflict (id) do nothing;
  elsif v_role = 'faculty' then
    insert into public.faculty_profiles (id, designation, office_location)
    values (new.id, 'Assistant Professor', 'Faculty Office Block')
    on conflict (id) do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 18. Row Level Security (RLS) Policies
-- ==============================================================================
alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.faculty_profiles enable row level security;
alter table public.courses enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.timetable enable row level security;
alter table public.attendance enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.study_materials enable row level security;
alter table public.campus_facilities enable row level security;
alter table public.facility_bookings enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.notifications enable row level security;
alter table public.feedback enable row level security;

-- Profiles: Authenticated users can read all profiles; users can only update their own profile; admins can update all
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id or (select role from public.profiles where id = auth.uid()) = 'admin');

-- Student Profiles: Students view own profile; Faculty & Admins view all
create policy "Students view own profile, faculty and admin view all"
  on public.student_profiles for select
  to authenticated
  using (
    auth.uid() = id
    or (select role from public.profiles where id = auth.uid()) in ('faculty', 'admin')
  );

-- Faculty Profiles: Viewable by all authenticated
create policy "Faculty profiles viewable by all"
  on public.faculty_profiles for select
  to authenticated
  using (true);

-- Announcements: Viewable by everyone; created/updated by faculty and admin only
create policy "Announcements are viewable by authenticated users"
  on public.announcements for select
  to authenticated
  using (true);

create policy "Faculty and Admin can publish announcements"
  on public.announcements for insert
  to authenticated
  with check (
    (select role from public.profiles where id = auth.uid()) in ('faculty', 'admin')
  );

-- Events: Viewable by everyone; manageable by Admin and Faculty
create policy "Events are viewable by authenticated users"
  on public.events for select
  to authenticated
  using (true);

create policy "Faculty and Admin can manage events"
  on public.events for insert
  to authenticated
  with check (
    (select role from public.profiles where id = auth.uid()) in ('faculty', 'admin')
  );

-- Timetable & Courses: Viewable by all
create policy "Courses viewable by all authenticated"
  on public.courses for select
  to authenticated
  using (true);

create policy "Timetable viewable by all authenticated"
  on public.timetable for select
  to authenticated
  using (true);

-- Attendance: Students can only view their own attendance; Faculty & Admin can insert/update
create policy "Students view own attendance"
  on public.attendance for select
  to authenticated
  using (
    auth.uid() = student_id
    or (select role from public.profiles where id = auth.uid()) in ('faculty', 'admin')
  );

create policy "Faculty and Admin can record attendance"
  on public.attendance for insert
  to authenticated
  with check (
    (select role from public.profiles where id = auth.uid()) in ('faculty', 'admin')
  );

-- Assignment Submissions: Students view/insert their own; Faculty & Admin can view and grade
create policy "Students can view own submissions"
  on public.assignment_submissions for select
  to authenticated
  using (
    auth.uid() = student_id
    or (select role from public.profiles where id = auth.uid()) in ('faculty', 'admin')
  );

create policy "Students can submit assignments"
  on public.assignment_submissions for insert
  to authenticated
  with check (auth.uid() = student_id);

create policy "Faculty and Admin can grade submissions"
  on public.assignment_submissions for update
  to authenticated
  using (
    (select role from public.profiles where id = auth.uid()) in ('faculty', 'admin')
  );

-- Study Materials: Viewable by all; uploaded by Faculty & Admin
create policy "Study materials are viewable by all"
  on public.study_materials for select
  to authenticated
  using (true);

create policy "Faculty and Admin can upload materials"
  on public.study_materials for insert
  to authenticated
  with check (
    (select role from public.profiles where id = auth.uid()) in ('faculty', 'admin')
  );

-- Notifications: Users only see their own notifications
create policy "Users only view their own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update their own notification read status"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id);

-- Feedback: Students view own submitted feedback; Admins view all
create policy "Users view own feedback, admin views all"
  on public.feedback for select
  to authenticated
  using (
    auth.uid() = submitted_by
    or (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Authenticated users can submit feedback"
  on public.feedback for insert
  to authenticated
  with check (auth.uid() = submitted_by or is_anonymous = true);

-- Emergency Contacts & Facilities: Read accessible to all
create policy "Emergency contacts viewable by all"
  on public.emergency_contacts for select
  using (true);

create policy "Facilities viewable by all"
  on public.campus_facilities for select
  to authenticated
  using (true);

create policy "Users can book facilities"
  on public.facility_bookings for insert
  to authenticated
  with check (auth.uid() = booked_by);

-- ==============================================================================
-- 19. Initial Seed Data (Departments, Emergency Hotlines, Campus Facilities)
-- ==============================================================================
insert into public.departments (code, name, building, hod_name)
values
  ('CSE', 'Computer Science & Engineering', 'Tech Block A', 'Dr. Rajesh Varma'),
  ('ECE', 'Electronics & Communication', 'Tech Block B', 'Prof. Ananya Rao'),
  ('ME', 'Mechanical Engineering', 'Engineering Workshop Block', 'Dr. Sanjay Deshmukh')
on conflict (code) do nothing;

insert into public.emergency_contacts (name, designation, phone, alternate_phone, available_hours, category, priority)
values
  ('Campus Security Control Room', 'Chief Security Warden', '+1 (800) 555-0911', '+1 (800) 555-0912', '24/7', 'Security', 1),
  ('University Health Center & Ambulance', 'Chief Medical Officer', '+1 (800) 555-0108', '+1 (800) 555-0109', '24/7', 'Medical', 2),
  ('Women Safety & Anti-Ragging Cell', 'Convenor & Senior Dean', '+1 (800) 555-0181', null, '24/7', 'Helpline', 3)
on conflict do nothing;

insert into public.campus_facilities (name, category, location, capacity, operating_hours, status, description)
values
  ('Turing Advanced Computing Lab', 'Specialized Lab', 'Tech Block A • 3rd Floor', 65, '08:00 AM - 10:00 PM', 'available', 'Equipped with 65 high-end GPU workstations for ML, AI, and Cloud Virtualization.'),
  ('Sir C.V. Raman Central Auditorium', 'Auditorium', 'Central Campus Plaza', 850, '09:00 AM - 09:00 PM', 'booked', 'Acoustically treated auditorium with Dolby surround audio and 4K projection.'),
  ('Collaborative Study Pods (Library)', 'Library Space', 'Central Library • 2nd Floor', 12, '24/7 Open', 'available', 'Sound-isolated breakout room equipped with smart digital whiteboards.')
on conflict do nothing;
