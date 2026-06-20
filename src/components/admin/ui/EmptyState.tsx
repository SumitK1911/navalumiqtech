type Props = {
  title: string;
  description?: string;
};

export default function EmptyState({
  title,
  description,
}: Props) {
  return (
    <div className="
      bg-white/5
      border
      border-dashed
      border-white/10
      rounded-3xl
      p-14
      text-center
    ">

      <h3 className="text-2xl font-black mb-3">
        {title}
      </h3>

      {description && (
        <p className="text-gray-400">
          {description}
        </p>
      )}

    </div>
  );
}