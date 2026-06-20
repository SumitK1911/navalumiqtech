type Props = {
  children: React.ReactNode;
  color?: "default" | "success" | "danger";
};

export default function AdminBadge({
  children,
  color = "default",
}: Props) {

  const styles = {
    default: "bg-cyan-500/10 text-cyan-400",
    success: "bg-green-500/10 text-green-400",
    danger: "bg-red-500/10 text-red-400",
  };

  return (

    <span
      className={`
        inline-flex
        items-center
        px-3
        py-1
        rounded-full
        text-sm
        font-semibold
        ${styles[color]}
      `}
    >
      {children}
    </span>

  );

}