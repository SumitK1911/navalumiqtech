"use client";

import AdminCard from "@/components/admin/ui/AdminCard";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminTextarea from "@/components/admin/ui/AdminTextarea";
import AdminSection from "@/components/admin/ui/AdminSection";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import MediaPicker from "@/components/editor/MediaPicker";
import BlogEditor from "@/components/editor/BlogEditor";
import Image from "next/image";

import { useEffect, useState } from "react";

type Blog = {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  image?: string;
  published?: boolean;
  status: "draft" | "published";
  createdAt?: string;
};

export default function BlogCMSPage() {

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // FETCH BLOGS
  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    setBlogs(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    let active = true;

    async function loadInitialBlogs() {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (active) {
        setBlogs(Array.isArray(data) ? data : []);
      }
    }

    void loadInitialBlogs();

    return () => {
      active = false;
    };
  }, []);

  // CREATE / UPDATE BLOG
  const createBlog = async () => {
    setError("");
    setSaving(true);

    try {
      const payload = {
        title,
        slug: title.toLowerCase().trim().replaceAll(" ", "-"),
        category,
        description,
        content,
        image: imageUrl,
        status,
        published: status === "published",
      };

      if (editingId) {
        const response = await fetch(`/api/blogs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Could not update blog.");
          return;
        }
      } else {
        const response = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Could not publish blog.");
          return;
        }
      }

      setTitle("");
      setCategory("");
      setDescription("");
      setContent("");
      setImageUrl("");
      setStatus("draft");
      setEditingId(null);
      await fetchBlogs();

    } catch {
      setError("Something went wrong while saving the blog.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE BLOG
  const deleteBlog = async (id: string) => {
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    void fetchBlogs();
  };

  // EDIT BLOG
  const editBlog = (blog: Blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setCategory(blog.category);
    setDescription(blog.description);
    setContent(blog.content);
    setImageUrl(blog.image || "");
    setStatus(blog.status || (blog.published ? "published" : "draft"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="text-white">
      <div className="mx-auto max-w-6xl">

        {/* CREATE / EDIT FORM */}
        <AdminCard className="space-y-6 mb-14">

          <div>
            <h2 className="text-3xl font-black mb-2">
              {editingId ? "Update Blog" : "Create New Blog"}
            </h2>
            <p className="text-gray-400">
              Write and publish high-quality content.
            </p>
            {error && (
              <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}
          </div>

          {/* TITLE */}
          <AdminInput
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* CATEGORY */}
          <AdminInput
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="w-full px-5 py-4 rounded-2xl bg-black/20 border border-white/10"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          {/* DESCRIPTION */}
          <AdminTextarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* BLOG EDITOR */}
          <BlogEditor
            content={content}
            setContent={setContent}
            onOpenMedia={() => setShowMedia(true)}
          />

          {/* FEATURED IMAGE */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Featured Image</h3>
              <p className="text-sm text-gray-400">
                Choose an image from your media library.
              </p>
            </div>

            <AdminInput
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
            />

            <div className="flex gap-4 flex-wrap">
              <AdminButton onClick={() => setShowMedia(true)}>
                Choose from Media Library
              </AdminButton>
              {imageUrl && (
                <AdminButton variant="danger" onClick={() => setImageUrl("")}>
                  Remove Image
                </AdminButton>
              )}
            </div>

            {imageUrl && (
              <div className="relative mt-4 aspect-video w-full max-w-xl overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 36rem, 100vw"
                />
              </div>
            )}
          </div>

          {/* ACTION BUTTON */}
          <AdminButton onClick={createBlog} disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Blog" : "Publish Blog"}
          </AdminButton>

        </AdminCard>

        {/* BLOG LIST */}
        <AdminSection title="Published Blogs">

          {/* SEARCH */}
          <div className="mb-6">
            <AdminInput
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-[100px_1.5fr_160px_140px_180px] gap-4 px-6 py-4 text-sm uppercase tracking-wider text-gray-400 border-b border-white/10">
            <div>Image</div>
            <div>Title</div>
            <div>Category</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {/* BLOG ROWS */}
          <div className="space-y-4 mt-4">
            {blogs
              .filter((blog) =>
                blog.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((blog) => (
                <AdminCard
                  key={blog.id}
                  className="md:grid md:grid-cols-[100px_1.5fr_160px_140px_180px] gap-4 items-center"
                >
                  {/* IMAGE */}
                  <div>
                    {blog.image ? (
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover"
                          sizes="5rem"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10" />
                    )}
                  </div>

                  {/* TITLE */}
                  <div>
                    <h2 className="text-xl font-black mb-2">{blog.title}</h2>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {blog.description}
                    </p>
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <AdminBadge>{blog.category}</AdminBadge>
                  </div>

                  {/* STATUS */}
                  <div>
                    <AdminBadge color={blog.status === "published" ? "success" : "default"}>
                      {blog.status}
                    </AdminBadge>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3">
                    <AdminButton onClick={() => editBlog(blog)}>
                      Edit
                    </AdminButton>
                    <AdminButton variant="danger" onClick={() => deleteBlog(blog.id)}>
                      Delete
                    </AdminButton>
                  </div>

                </AdminCard>
              ))}
          </div>

        </AdminSection>

        {/* MEDIA PICKER */}
        {showMedia && (
          <MediaPicker
            onSelect={(url) => {
              setImageUrl(url);
              setShowMedia(false);
            }}
            onClose={() => setShowMedia(false)}
          />
        )}

      </div>
    </div>
  );
}
