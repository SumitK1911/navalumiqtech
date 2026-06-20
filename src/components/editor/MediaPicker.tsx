"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type MediaFile = {
  name: string;
  url: string;
};

export default function MediaPicker({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadInitialFiles() {
      setLoading(true);

      const response = await fetch("/api/media");
      const data = await response.json();

      if (!active) {
        return;
      }

      if (!response.ok) {
        console.error(data.error || "Could not load media files.");
        setLoading(false);
        return;
      }

      setFiles(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    void loadInitialFiles();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-[#0b0f1a] border border-white/10 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Select Media</h2>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl font-bold"
          >
            Close
          </button>
        </div>

        {loading && (
          <p className="text-cyan-400">Loading media...</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto pr-2">
          {files.map((file) => {
            return (
              <div
                key={file.name}
                onClick={() => onSelect(file.url)}
                className="group cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400 transition"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(min-width: 768px) 25vw, 50vw"
                  />
                </div>

                <div className="p-3">
                  <p className="text-xs text-gray-400 truncate">
                    {file.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && files.length === 0 && (
          <p className="text-gray-400">No media found</p>
        )}
      </div>
    </div>
  );
}
