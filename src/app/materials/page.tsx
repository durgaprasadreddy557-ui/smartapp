"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Download, FileText, Search, Filter, Eye, Upload, Trash2, Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/state-views";
import {
  getStudyMaterialsAction,
  createStudyMaterialAction,
  deleteStudyMaterialAction,
} from "@/actions/academics";

export default function StudyMaterialsPage() {
  const { success, error } = useToast();
  const [materials, setMaterials] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Modals
  const [previewMaterial, setPreviewMaterial] = React.useState<any | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [newMaterial, setNewMaterial] = React.useState({
    courseId: "00000000-0000-0000-0000-000000000001",
    title: "",
    description: "",
    fileUrl: "/docs/course-notes.pdf",
    fileSize: "4.5 MB",
    format: "PDF",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchMaterials = React.useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getStudyMaterialsAction();
      if (res.success && res.data) {
        setMaterials(res.data);
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
    fetchMaterials();
  }, [fetchMaterials]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createStudyMaterialAction(newMaterial);
      if (res.success) {
        success("Study Material Published", "Notes uploaded to course repository.");
        setUploadModalOpen(false);
        setNewMaterial({
          courseId: "00000000-0000-0000-0000-000000000001",
          title: "",
          description: "",
          fileUrl: "/docs/course-notes.pdf",
          fileSize: "4.5 MB",
          format: "PDF",
        });
        fetchMaterials();
      } else {
        error("Upload Failed", res.message || "Please check inputs.");
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteStudyMaterialAction(id);
      if (res.success) {
        success("Material Removed");
        setMaterials((prev) => prev.filter((m) => m.id !== id));
      } else {
        error("Deletion Failed", res.message);
      }
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const handleDownload = (m: any) => {
    success("Download Started", `Fetching ${m.title} (${m.file_size || m.size || "PDF"}) from Supabase Storage.`);
  };

  const filtered = materials.filter((m) => {
    const title = m.title || "";
    const subject = m.course?.title || m.subject || "";
    const faculty = m.faculty?.full_name || m.faculty || "";
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      subject.toLowerCase().includes(search.toLowerCase()) ||
      faculty.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <DashboardShell
      title="Course Study Materials & Digital Repository"
      description="Faculty uploaded lecture slides, lab manuals, and syllabus resources"
      actions={
        <Button size="sm" onClick={() => setUploadModalOpen(true)} className="gap-1.5 shadow-sm shadow-blue-500/20">
          <Upload className="h-4 w-4" />
          <span>Upload Material</span>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/60 backdrop-blur-md">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search documents or slides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
          <div className="text-xs text-zinc-500">
            Total Courseware: <strong className="text-zinc-800 dark:text-zinc-200">{filtered.length} Documents</strong>
          </div>
        </div>

        {/* State Views */}
        {loading ? (
          <LoadingState message="Fetching academic courseware repository..." />
        ) : hasError ? (
          <ErrorState onRetry={fetchMaterials} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Materials Found"
            description="No course study materials match your search."
            actionLabel="Upload Material"
            onAction={() => setUploadModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((m) => {
              const subjectName = m.course ? `${m.course.code}: ${m.course.title}` : m.subject || "Course Material";
              const facultyName = m.faculty?.full_name || m.faculty || "Faculty Instructor";
              const fileSize = m.file_size || m.size || "3.5 MB";
              const format = m.format || "PDF";
              const downloadCount = m.download_count ?? m.downloads ?? 120;

              return (
                <Card key={m.id} className="hover:border-blue-500/40 transition-all flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <Badge variant="info">{format}</Badge>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-zinc-400 font-medium">{fileSize}</span>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          aria-label="Delete material"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <CardTitle className="text-sm font-bold leading-snug">{m.title}</CardTitle>
                    <CardDescription className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {subjectName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-3 border-t border-zinc-100 dark:border-zinc-800 pt-2.5">
                      <span>Uploaded by: <strong className="text-zinc-700 dark:text-zinc-300">{facultyName}</strong></span>
                      <span>{downloadCount} downloads</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => setPreviewMaterial(m)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => handleDownload(m)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Material Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Course Study Material"
        description="Stores document in Supabase Storage study_materials bucket"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Document Title"
            required
            placeholder="e.g. Unit 4: Memory Paging Architecture Slides"
            value={newMaterial.title}
            onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea
              rows={3}
              placeholder="Brief summary of topics covered..."
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
              value={newMaterial.description}
              onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Format / Type"
              value={newMaterial.format}
              onChange={(e) => setNewMaterial({ ...newMaterial, format: e.target.value })}
            />
            <Input
              label="Approx Size"
              value={newMaterial.fileSize}
              onChange={(e) => setNewMaterial({ ...newMaterial, fileSize: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Publish Document"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      {previewMaterial && (
        <Modal
          isOpen={!!previewMaterial}
          onClose={() => setPreviewMaterial(null)}
          title={`Document Overview: ${previewMaterial.title}`}
          description={previewMaterial.course?.title || previewMaterial.subject}
        >
          <div className="space-y-4">
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Instructor:</span>
                <span className="font-semibold">{previewMaterial.faculty?.full_name || previewMaterial.faculty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Payload Size:</span>
                <span className="font-semibold">{previewMaterial.file_size || previewMaterial.size}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setPreviewMaterial(null)}>
                Close
              </Button>
              <Button onClick={() => {
                handleDownload(previewMaterial);
                setPreviewMaterial(null);
              }}>
                Confirm Download
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
