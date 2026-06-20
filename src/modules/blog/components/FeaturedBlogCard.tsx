import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/modules/blog/types";

type Props = {
  blog: BlogPost;
};

export default function FeaturedBlogCard({ blog }: Props) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group block overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-400/50"
    >
      <div className="relative h-105 overflow-hidden bg-black/20">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-10 md:p-12">
        <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-bold mb-4">
          {blog.category}
        </p>

        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          {blog.title}
        </h2>

        <p className="text-gray-400 max-w-2xl mb-8">{blog.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span className="inline-block h-1 w-1 rounded-full bg-white/20" />
          <span>Featured</span>
        </div>
      </div>
    </Link>
  );
}
