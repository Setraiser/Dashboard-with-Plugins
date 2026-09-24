import type { ButtonHTMLAttributes, ReactNode } from "react";

const buttonVariants = {
  primary: "bg-todo-primary text-white shadow-sm hover:bg-todo-primary-strong ring-1 ring-inset ring-todo-primary/30",
  secondary: "border border-todo-border bg-todo-surface text-todo-ink hover:bg-todo-surface-alt hover:text-todo-ink",
};

const buttonSizes = {
  md: "h-11 px-4 py-2.5 text-sm",
  sm: "h-9 px-3 py-2 text-sm",
};

export type TodoButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  children: ReactNode;
};

export function TodoButton({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: TodoButtonProps) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-todo-ring",
        "disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:disabled:bg-slate-700 dark:disabled:text-slate-300",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
