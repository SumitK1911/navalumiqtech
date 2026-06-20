type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function AdminCard({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
        bg-white/[0.045]
        border
        border-white/10
        rounded-2xl
        p-6
        backdrop-blur-xl
        shadow-[0_18px_60px_rgba(0,0,0,0.18)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
