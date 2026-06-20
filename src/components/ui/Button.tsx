import { type MouseEventHandler, type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  variant?: "primary" | "secondary";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const variants = {
  primary:
    "rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/90 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200",
  secondary:
    "rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800",
};

export default function Button({
  children,
  className = "",
  href,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const classNames = `${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classNames}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classNames} onClick={onClick}>
      {children}
    </button>
  );
}
