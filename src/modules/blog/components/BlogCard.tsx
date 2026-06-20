import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/modules/blog/types";

type Props = {
  blog: BlogPost;
};

export default function BlogCard({ blog }: Props) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group block overflow-hidden rounded-4xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-400/50"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <p className="text-cyan-400 uppercase tracking-[0.3em] text-xs font-bold mb-3">
          {blog.category}
        </p>

        <h3 className="text-2xl font-black mb-3">{blog.title}</h3>

        <p className="text-gray-400 line-clamp-3">{blog.description}</p>

        <div className="mt-6 text-sm text-white/80 font-semibold">
          Read article →
        </div>
      </div>
    </Link>
  );
}
