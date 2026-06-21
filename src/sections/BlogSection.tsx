"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import SectionHeading from "@/components/ui/SectionHeading";
import { blogPosts } from "@/data/blogData";

type HomeBlogPost = {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
};

const fallbackPosts: HomeBlogPost[] = blogPosts.map((post) => ({
  slug: post.slug,
  title: post.title,
  description: post.description,
  image: post.image,
  category: post.category,
  date: post.date,
}));

export default function BlogSection() {
  const [posts, setPosts] =
    useState<HomeBlogPost[]>(fallbackPosts);

  useEffect(() => {
    let active = true;

    async function loadPublishedBlogs() {
      try {
        const response =
          await fetch("/api/blogs?published=true");
        const data = await response.json();

        if (
          active &&
          Array.isArray(data) &&
          data.length > 0
        ) {
          setPosts(
            data.slice(0, 3).map((post) => ({
              slug: String(post.slug),
              title: String(post.title),
              description: String(post.description),
              image: String(post.image),
              category: String(post.category),
              date: new Date(post.createdAt).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  year: "numeric",
                }
              ),
            }))
          );
        }
      } catch {
        setPosts(fallbackPosts);
      }
    }

    void loadPublishedBlogs();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="blog"
      className="relative overflow-hidden bg-transparent px-6 py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_35%)]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          badge="Insights"
          title="Latest Articles"
          description="Perspectives on technology, AI, digital engineering, and the future of innovation."
        />

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.18 }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-3xl glass-card glass-card-hover"
            >
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-cyan-500/10 via-transparent to-emerald-500/10 opacity-0 transition duration-700 group-hover:opacity-100" />

              <div className="relative h-72 overflow-hidden md:h-80">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#020b24] via-[#020b24]/40 to-transparent" />
              </div>

              <div className="relative p-8">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest text-cyan-400">
                    {post.category}
                  </span>

                  <span className="text-sm text-gray-500">
                    {post.date}
                  </span>
                </div>

                <h3 className="mb-4 text-2xl font-black leading-tight text-white">
                  {post.title}
                </h3>

                <p className="mb-8 min-h-20 leading-relaxed text-gray-400">
                  {post.description}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 font-bold text-white transition hover:text-cyan-400"
                >
                  Read Article
                  <HiArrowRight />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
