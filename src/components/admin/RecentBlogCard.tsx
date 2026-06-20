import Image from "next/image";

type Props = {
  title: string;
  image?: string;
  category: string;
  status: string;
};

export default function RecentBlogCard({
  title,
  image,
  category,
  status,
}: Props) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-5
        bg-white/5
        border
        border-white/10
        rounded-2xl
        p-4
      "
    >
      <div className="flex items-center gap-4">

        {image && (
          <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="4rem"
            />
          </div>
        )}

        <div>
          <h3 className="font-bold text-white">
            {title}
          </h3>

          <p className="text-sm text-gray-400">
            {category}
          </p>
        </div>

      </div>

      <div
        className={`
          px-3
          py-1
          rounded-full
          text-xs
          font-bold
          ${
            status === "published"
              ? "bg-green-500/20 text-green-400"
              : "bg-white/10 text-gray-300"
          }
        `}
      >
        {status}
      </div>
    </div>
  );
}
