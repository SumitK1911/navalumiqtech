import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import RelatedPosts from "@/modules/blog/components/RelatedPosts";
import type { BlogPost } from "@/modules/blog/types";

export const dynamic = "force-dynamic";

const hasDatabase = Boolean(process.env.DATABASE_URL);

async function safeFindMany(args: Parameters<typeof prisma.blogPost.findMany>[0]) {
  try {
    return await prisma.blogPost.findMany(args);
  } catch {
    return [];
  }
}

async function safeFindFirst(args: Parameters<typeof prisma.blogPost.findFirst>[0]) {
  try {
    return await prisma.blogPost.findFirst(args);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  if (!hasDatabase) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post does not exist.",
    };
  }

  const { slug } = await params;

  const post = await safeFindFirst({
    where: { slug, published: true },
  });

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post does not exist.",
    };
  }

  return {
    title: `${post.title} | Nava Lumiq Tech`,
    description: post.description,
    alternates: {
      canonical: `https://navalumiqtech.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  if (!hasDatabase) {
    notFound();
  }

  const { slug } = await params;

  const post = await safeFindFirst({
    where: { slug, published: true },
  });

  if (!post) {
    notFound();
  }

  const relatedPosts = await safeFindMany({
    where: {
      category: post.category,
      published: true,
      NOT: { id: post.id },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <main className="min-h-screen bg-[#050816] px-6 pb-32 pt-40 text-white">
      <div className="max-w-6xl mx-auto space-y-20">
        <section className="space-y-10">
          <div className="relative h-130 md:h-155 rounded-4xl overflow-hidden shadow-2xl shadow-black/30">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-bold">
              {post.category}
            </p>
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              {post.title}
            </h1>
            <p className="text-gray-500 text-base">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <article className="prose prose-invert max-w-none text-gray-300">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </section>

        {relatedPosts.length > 0 && (
          <section>
            <RelatedPosts posts={relatedPosts as BlogPost[]} />
          </section>
        )}
      </div>
    </main>
  );
}
