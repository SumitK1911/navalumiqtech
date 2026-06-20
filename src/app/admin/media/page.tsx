"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminSection from "@/components/admin/ui/AdminSection";
import AdminCard from "@/components/admin/ui/AdminCard";
import MediaUploader from "@/components/editor/MediaUploader";

type MediaFile = {
  name: string;
  public_id: string;
  url: string;
  format?: string;
  bytes?: number;
  created_at?: string;
};

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const sortMediaFiles = (data: MediaFile[]) => {
    return [...data].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    });
  };

  async function loadFiles() {
    try {
      const response = await fetch("/api/media");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load media files.");
      }

      setFiles(Array.isArray(data) ? sortMediaFiles(data) : []);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load media files."
      );
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialFiles() {
      try {
        const response = await fetch("/api/media");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load media files.");
        }

        if (active) {
          setFiles(Array.isArray(data) ? sortMediaFiles(data) : []);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load media files."
          );
        }
      }
    }

    void loadInitialFiles();

    return () => {
      active = false;
    };
  }, []);

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    alert("URL Copied!");
  }

  async function deleteFile(fileName: string) {
    const confirmed = window.confirm(`Delete ${fileName}?`);

    if (!confirmed) return;

    setDeletingFile(fileName);
    setError("");

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => {
        controller.abort();
      }, 15000);

      const fileToDelete = files.find((f) => f.name === fileName);
      const response = await fetch("/api/media", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({ public_id: fileToDelete?.public_id ?? fileName }),
      });
      window.clearTimeout(timeout);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete media file.");
      }

      setFiles((current) =>
        current.filter((file) => file.name !== fileName)
      );
      void loadFiles();
    } catch (deleteError) {
      setError(
        deleteError instanceof DOMException &&
          deleteError.name === "AbortError"
          ? "Delete request timed out. Check Cloudinary credentials and try again."
          : deleteError instanceof Error
          ? deleteError.message
          : "Could not delete media file."
      );
    } finally {
      setDeletingFile(null);
    }
  }

  return (
    <div className="text-white space-y-8">
      {error && (
        <p className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-1">
          <AdminSection title="Upload Media">
            <AdminCard>
              <MediaUploader onUploadSuccess={() => void loadFiles()} showPreview={false} />
            </AdminCard>
          </AdminSection>
        </div>

        {/* Gallery Column */}
        <div className="lg:col-span-2">
          <AdminSection title="Media Assets">
            {files.length === 0 ? (
              <AdminCard className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <svg
                  className="w-12 h-12 mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">No media files found. Upload some above!</p>
              </AdminCard>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {files.map((file) => {
                  return (
                    <div
                      key={file.name}
                      className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col justify-between"
                    >
                      <button
                        type="button"
                        className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-black/20"
                        onClick={() => setSelectedImage(file.url)}
                      >
                        <Image
                          src={file.url}
                          alt={file.name}
                          fill
                          className="object-cover transition hover:scale-105"
                          sizes="(min-width: 768px) 25vw, 50vw"
                        />
                      </button>

                      <p className="text-xs text-gray-300 truncate mb-2">
                        {file.name}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copyUrl(file.url)}
                          className="flex-1 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg text-xs transition"
                        >
                          Copy
                        </button>

                        <button
                          onClick={() => deleteFile(file.name)}
                          disabled={deletingFile === file.name}
                          className="flex-1 py-1.5 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white border border-red-500/30 rounded-lg text-xs transition disabled:opacity-50"
                        >
                          {deletingFile === file.name ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AdminSection>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative h-[90vh] w-[min(56rem,90vw)] overflow-hidden rounded-2xl border border-white/20">
            <Image
              src={selectedImage}
              alt="Selected media preview"
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
