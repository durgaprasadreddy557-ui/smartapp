import { createClient } from "./client";
import { isSupabaseConfigured } from "../env";

export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  STUDY_MATERIALS: "study_materials",
  ASSIGNMENT_SUBMISSIONS: "assignment_submissions",
  CAMPUS_DOCS: "campus_docs",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

// Maximum upload limits
export const FILE_LIMITS = {
  AVATAR: {
    maxSizeBytes: 2 * 1024 * 1024, // 2MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  STUDY_MATERIAL: {
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/zip",
      "application/x-zip-compressed",
    ],
  },
  ASSIGNMENT: {
    maxSizeBytes: 25 * 1024 * 1024, // 25MB
    allowedTypes: [
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
      "application/x-tar",
      "application/gzip",
      "text/plain",
      "application/x-ipynb+json",
    ],
  },
};

/**
 * Validates a file against type and size limits before upload
 */
export function validateUploadFile(
  file: File,
  limitConfig: { maxSizeBytes: number; allowedTypes: string[] }
): { isValid: boolean; error?: string } {
  if (file.size > limitConfig.maxSizeBytes) {
    const maxMb = Math.round(limitConfig.maxSizeBytes / (1024 * 1024));
    return {
      isValid: false,
      error: `File size exceeds the ${maxMb}MB upload limit.`,
    };
  }

  // Type check (if browser passes mime or check file extension)
  if (limitConfig.allowedTypes.length > 0 && file.type) {
    const isAllowed = limitConfig.allowedTypes.some((t) => t.toLowerCase() === file.type.toLowerCase());
    if (!isAllowed) {
      return {
        isValid: false,
        error: `File type '${file.type}' is not supported. Please upload an accepted format.`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Securely uploads a file to a specified Supabase Storage bucket
 */
export async function uploadFileSecure(
  bucket: StorageBucket,
  path: string,
  file: File,
  limitConfig?: { maxSizeBytes: number; allowedTypes: string[] }
): Promise<{ url: string | null; error: string | null }> {
  // Validate if limit config provided
  if (limitConfig) {
    const val = validateUploadFile(file, limitConfig);
    if (!val.isValid) {
      return { url: null, error: val.error || "File validation failed." };
    }
  }

  if (!isSupabaseConfigured()) {
    // Return simulated secure storage object URL during local mock mode
    const mockUrl = `/storage/${bucket}/${encodeURIComponent(file.name)}`;
    return { url: mockUrl, error: null };
  }

  try {
    const supabase = createClient();
    const cleanPath = `${Date.now()}-${path.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { data, error } = await supabase.storage.from(bucket).upload(cleanPath, file, {
      upsert: true,
      cacheControl: "3600",
    });

    if (error) {
      return { url: null, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || "Failed to upload file to storage." };
  }
}
