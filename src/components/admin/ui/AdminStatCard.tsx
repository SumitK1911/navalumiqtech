type Props = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

export default function AdminStatCard({
  title,
  value,
  icon,
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

      <div className="flex items-center justify-between mb-4">

        <p className="text-gray-400">
          {title}
        </p>

        {icon && (
          <div className="text-cyan-400 text-2xl">
            {icon}
          </div>
        )}

      </div>

      <h3 className="text-4xl font-black">
        {value}
      </h3>

    </div>

  );

}