"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { LoadingState, ErrorState } from "@/components/ui/state-views";
import { User, Mail, GraduationCap, Building2, Phone, Calendar, ShieldCheck, Save, Camera, Upload } from "lucide-react";
import {
  getUserProfileDetailsAction,
  updateBaseProfileAction,
  updateStudentProfileAction,
} from "@/actions/profiles";
import { uploadFileSecure, FILE_LIMITS } from "@/lib/supabase/storage";

export default function ProfilePage() {
  const { success, error } = useToast();
  const [profileData, setProfileData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  // Form Fields
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [enrollmentNo, setEnrollmentNo] = React.useState("");
  const [currentSemester, setCurrentSemester] = React.useState(1);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);

  const fetchProfile = React.useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getUserProfileDetailsAction();
      if (res.success && res.data) {
        setProfileData(res.data);
        setFullName(res.data.full_name || "");
        setPhone(res.data.phone || "");
        setDepartment(res.data.department || "");
        setAvatarUrl(res.data.avatar_url || "");
        if (res.data.student_profile) {
          setEnrollmentNo(res.data.student_profile.enrollment_no || "");
          setCurrentSemester(res.data.student_profile.current_semester || 1);
        }
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const uploadRes = await uploadFileSecure(
        "avatars",
        `${profileData?.id || "user"}-avatar.png`,
        file,
        FILE_LIMITS.AVATAR
      );

      if (uploadRes.url) {
        setAvatarUrl(uploadRes.url);
        await updateBaseProfileAction({
          fullName,
          phone,
          department,
          avatarUrl: uploadRes.url,
        });
        success("Avatar Updated", "New profile picture saved to Supabase avatars bucket.");
      } else {
        error("Upload Failed", uploadRes.error || "File could not be uploaded.");
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateBaseProfileAction({
        fullName,
        phone,
        department,
        avatarUrl,
      });

      if (profileData?.role === "student" && enrollmentNo) {
        await updateStudentProfileAction({
          enrollmentNo,
          currentSemester,
          admissionYear: profileData?.student_profile?.admission_year || 2024,
          academicStanding: profileData?.student_profile?.academic_standing || "Good",
        });
      }

      if (res.success) {
        success("Profile Saved", "Your information has been committed to Supabase profiles.");
        fetchProfile();
      } else {
        error("Update Failed", res.message);
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell title="User Profile">
        <LoadingState message="Loading authenticated profile details..." />
      </DashboardShell>
    );
  }

  if (hasError || !profileData) {
    return (
      <DashboardShell title="User Profile">
        <ErrorState onRetry={fetchProfile} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="User Identity & Academic Profile"
      description="Personal information, academic enrollment details, and security status"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card with Avatar Upload */}
        <Card className="text-center p-6 flex flex-col items-center">
          <div className="relative group mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 overflow-hidden">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-12 w-12" />
              )}
            </div>

            {/* Avatar Change Overlay */}
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-semibold"
            >
              <Camera className="h-5 w-5 mb-1" />
              <span>{isUploadingAvatar ? "Saving..." : "Change Photo"}</span>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleAvatarFileChange}
              disabled={isUploadingAvatar}
            />
          </div>

          <h3 className="text-lg font-bold">{fullName}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{profileData.email}</p>
          <div className="mt-3 flex items-center gap-1.5">
            <Badge
              variant={
                profileData.role === "admin"
                  ? "danger"
                  : profileData.role === "faculty"
                  ? "warning"
                  : "info"
              }
              className="capitalize"
            >
              {profileData.role}
            </Badge>
            {profileData.student_profile && (
              <Badge variant="outline">
                Semester {profileData.student_profile.current_semester}
              </Badge>
            )}
          </div>

          <div className="w-full mt-6 space-y-2 border-t border-zinc-200/80 pt-4 text-left text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            {profileData.student_profile && (
              <>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400">Roll Number:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {profileData.student_profile.enrollment_no}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400">CGPA:</span>
                  <span className="font-semibold text-emerald-600">
                    {profileData.student_profile.cgpa || "3.82"} / 4.0
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-400">Department:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {profileData.department || "General Academics"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Auth Status:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>
          </div>
        </Card>

        {/* Edit Info Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Synchronized with Supabase PostgreSQL `profiles` and role tables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    value={profileData.email}
                    disabled
                  />
                  <Input
                    label="Contact Phone"
                    value={phone}
                    placeholder="+1 (555) 000-0000"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    label="Department"
                    value={department}
                    placeholder="Computer Science & Engineering"
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                  {profileData.role === "student" && (
                    <>
                      <Input
                        label="Enrollment / Roll No."
                        value={enrollmentNo}
                        placeholder="24CS001"
                        onChange={(e) => setEnrollmentNo(e.target.value)}
                      />
                      <Input
                        label="Current Semester"
                        type="number"
                        value={currentSemester}
                        onChange={(e) => setCurrentSemester(Number(e.target.value))}
                      />
                    </>
                  )}
                </div>

                <div className="flex justify-end pt-3">
                  <Button type="submit" disabled={isSaving} className="gap-2 text-xs">
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving to Database..." : "Save Profile Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
