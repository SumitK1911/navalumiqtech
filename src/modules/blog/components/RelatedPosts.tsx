import Link from "next/link";
import type { BlogPost } from "@/modules/blog/types";

type Props = {
  posts: BlogPost[];
};

export default function RelatedPosts({ posts }: Props) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <h3 className="text-2xl font-black mb-6">Related Posts</h3>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
            key={post.id}
            className="block rounded-3xl border border-white/10 bg-black/20 px-5 py-4 transition hover:border-cyan-400/50"
          >
            <p className="text-cyan-400 text-sm uppercase tracking-[0.3em] font-bold mb-2">
              {post.category}
            </p>
            <h4 className="text-lg font-black">{post.title}</h4>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{post.description}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
