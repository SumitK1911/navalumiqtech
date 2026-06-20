type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function DashboardStat({
  title,
  value,
  subtitle,
}: Props) {
  return (
    <div
      className="
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
        backdrop-blur-xl
      "
    >
      <p className="text-sm text-gray-400 mb-3">
        {title}
      </p>

      <h2 className="text-4xl font-black text-white">
        {value}
      </h2>

      {subtitle && (
        <p className="text-sm text-cyan-400 mt-3">
          {subtitle}
        </p>
      )}
    </div>
  );
}