import type { BlogPost, Prisma } from "@prisma/client";

import { uniqueSlug } from "@/utils/slugify";

type BlogBody = Record<string, unknown>;

const defaultImage = "/projects/project1.jpg";

function readString(body: BlogBody, key: string, fallback = "") {
  const value = body[key];

  return typeof value === "string" ? value.trim() : fallback;
}

function readPublished(body: BlogBody) {
  if (typeof body.published === "boolean") {
    return body.published;
  }

  return body.status === "published";
}

function validateBlogFields(title: string, description: string) {
  if (!title || !description) {
    return "Title and description are required.";
  }

  return null;
}

export function buildBlogCreateData(body: BlogBody) {
  const title = readString(body, "title");
  const description = readString(body, "description");
  const error = validateBlogFields(title, description);

  if (error) {
    return { error };
  }

  const slugSource = readString(body, "slug", title);

  const data: Prisma.BlogPostCreateInput = {
    title,
    slug: uniqueSlug(slugSource || title),
    description,
    content: readString(body, "content"),
    image: readString(body, "image", defaultImage) || defaultImage,
    category: readString(body, "category", "General") || "General",
    published: readPublished(body),
  };

  return { data };
}

export function buildBlogUpdateData(body: BlogBody) {
  const title = readString(body, "title");
  const description = readString(body, "description");
  const error = validateBlogFields(title, description);

  if (error) {
    return { error };
  }

  const data: Prisma.BlogPostUpdateInput = {
    title,
    description,
    content: readString(body, "content"),
    image: readString(body, "image", defaultImage) || defaultImage,
    category: readString(body, "category", "General") || "General",
    published: readPublished(body),
  };

  return { data };
}

export function toBlogAdminResponse(blog: BlogPost) {
  return {
    ...blog,
    status: blog.published ? "published" : "draft",
  };
}
