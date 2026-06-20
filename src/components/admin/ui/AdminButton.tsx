type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "danger" | "secondary";
  className?: string;
  disabled?: boolean;
};

export default function AdminButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}: Props) {

  const styles = {
    primary:
      "bg-linear-to-r from-cyan-500 to-violet-600 text-white",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",

    secondary:
      "bg-white/10 hover:bg-white/20 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6
        py-3
        rounded-2xl
        font-bold
        transition
        hover:scale-[1.02]
        disabled:cursor-not-allowed
        disabled:opacity-60
        disabled:hover:scale-100
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
