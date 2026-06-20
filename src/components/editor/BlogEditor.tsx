"use client";

import { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

declare global {
  interface Window {
    insertBlogImage?: (url: string) => void;
  }
}

export default function BlogEditor({
  content,
  setContent,
  onOpenMedia,
}: {
  content: string;
  setContent: (value: string) => void;
  onOpenMedia: () => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // expose function to insert image
  const insertImage = useCallback((url: string) => {
    editor?.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  useEffect(() => {
    if (typeof 
        window === "undefined") return;

    window.insertBlogImage = insertImage;

    return () => {
      if (typeof window !== "undefined") {
        delete window.insertBlogImage;
      }
    };
  }, [insertImage]);

  return (
    <div className="border border-white/10 rounded-2xl bg-black/30 p-4">

      {/* Toolbar */}
      <div className="flex gap-3 mb-3">
        <button
          type="button"
          onClick={() => onOpenMedia()}
          className="px-4 py-2 bg-cyan-500 text-black rounded-lg font-bold"
        >
          Insert Image
        </button>
      </div>

      <EditorContent editor={editor} className="min-h-62.5 text-white" />
    </div>
  );
}
