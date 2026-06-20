"use client";

import { useState } from "react";
import Image from "next/image";

type MediaUploaderProps = {
  onUploadSuccess?: (url: string) => void;
  showPreview?: boolean;
};

export default function MediaUploader({
  onUploadSuccess,
  showPreview = true,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not upload image.");
      }

      setImageUrl(data.url);
      onUploadSuccess?.(data.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not upload image."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-white/20 rounded-2xl p-10 text-center bg-white/5 hover:border-cyan-400 transition cursor-pointer"
      >
        <p className="text-lg font-semibold">
          Drag & Drop Image Here
        </p>

        <p className="text-sm text-gray-400 mt-2">
          or click to upload
        </p>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="fileUpload"
          onChange={handleFileChange}
        />

        <label
          htmlFor="fileUpload"
          className="inline-block mt-5 px-5 py-2 bg-cyan-500 text-black rounded-xl font-bold cursor-pointer"
        >
          Choose File
        </label>
      </div>

      {uploading && (
        <p className="text-cyan-400 font-semibold">
          Uploading...
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {showPreview && imageUrl && (
        <div className="space-y-4">
          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={imageUrl}
              className="object-cover"
              alt="uploaded"
              fill
              sizes="(min-width: 768px) 28rem, 100vw"
            />
          </div>

          <input
            value={imageUrl}
            readOnly
            className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white"
          />
        </div>
      )}
    </div>
  );
}
