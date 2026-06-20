import { prisma } from "@/lib/prisma";

import FeaturedBlogCard from "@/modules/blog/components/FeaturedBlogCard";
import BlogGrid from "@/modules/blog/components/BlogGrid";

export const dynamic = "force-dynamic";

const hasDatabase = Boolean(process.env.DATABASE_URL);

async function safeFindMany(args: Parameters<typeof prisma.blogPost.findMany>[0]) {
  try {
    return await prisma.blogPost.findMany(args);
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const blogs = hasDatabase
    ? await safeFindMany({
        where: { published: true },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  const featuredBlog = blogs[0];
  const blogGridPosts = blogs.slice(1);

  return (

    <main className="min-h-screen bg-transparent px-6 pb-32 pt-40 text-white">

      <div className="max-w-6xl mx-auto">

        <div className="mb-16">
          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-bold mb-4">
            Insights & Articles
          </p>

          <h1 className="text-6xl font-black max-w-4xl">
            Latest thinking from the Nava Lumiq Tech team.
          </h1>
        </div>

        {featuredBlog ? (
          <div className="mb-16">
            <FeaturedBlogCard blog={featuredBlog} />
          </div>
        ) : (
          <div className="rounded-4xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
            <p className="text-xl font-semibold text-white">Blog content is unavailable.</p>
            <p className="mt-3 text-sm text-slate-400">
              The site is running without a configured database. Add a valid
              `DATABASE_URL` to access blog posts.
            </p>
          </div>
        )}

        {blogGridPosts.length > 0 && (
          <div>
            <h2 className="text-3xl font-black mb-8">More Articles</h2>
            <BlogGrid posts={blogGridPosts} />
          </div>
        )}

      </div>

    </main>
  );
}
