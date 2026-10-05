interface LoadingStateProps {
  label: string;
  className?: string;
}

export function LoadingState({
  label,
  className = "",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={[
        "flex min-h-36 w-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-8 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/60",
        className,
      ].join(" ")}
    >
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span         className="absolute inset-0 animate-ping rounded-full bg-blue-400/20 motion-reduce:animate-none" />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="relative h-8 w-8 animate-spin text-blue-600 motion-reduce:animate-none dark:text-blue-400"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-20"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <span className="flex items-center gap-1" aria-hidden="true">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 [animation-delay:-300ms] motion-reduce:animate-none" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:-150ms] motion-reduce:animate-none" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600 motion-reduce:animate-none" />
      </span>
    </div>
  );
}
