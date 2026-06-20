import BlogCard from "@/modules/blog/components/BlogCard";
import type { BlogPost } from "@/modules/blog/types";

type Props = {
  posts: BlogPost[];
};

export default function BlogGrid({ posts }: Props) {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} blog={post} />
      ))}
    </div>
  );
}
