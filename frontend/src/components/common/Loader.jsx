
import { Loader2 } from "lucide-react";

const SIZES = {
  sm: {
    spinner: "h-4 w-4",
    ring: "h-7 w-7",
    text: "text-xs",
  },
  md: {
    spinner: "h-6 w-6",
    ring: "h-11 w-11",
    text: "text-sm",
  },
  lg: {
    spinner: "h-8 w-8",
    ring: "h-14 w-14",
    text: "text-base",
  },
  xl: {
    spinner: "h-11 w-11",
    ring: "h-20 w-20",
    text: "text-lg",
  },
};

export default function Loader({
  variant = "page",
  size = "md",
  text = "Loading, please wait...",
  minHeight = "min-h-[50vh]",
  className = "",
}) {
  const config = SIZES[size] || SIZES.md;

  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-label={text || "Loading"}
      className={`flex flex-col items-center justify-center gap-5 ${className}`}
    >
      <div className={`relative flex items-center justify-center ${config.ring}`}>
        <div className="absolute inset-0 rounded-full bg-violet-500/15 blur-xl animate-pulse" />

        <div className="absolute inset-0 rounded-full border border-violet-300/30 dark:border-violet-400/20" />

        <div className="absolute inset-[-5px] rounded-full border border-dashed border-violet-400/50 animate-[spin_8s_linear_infinite]" />

        <div className="absolute inset-1 rounded-full border-[3px] border-violet-100 dark:border-violet-950" />

        <div className="absolute inset-1 rounded-full border-[3px] border-transparent border-t-violet-600 border-r-fuchsia-500 animate-spin" />

        <Loader2
          className={`relative text-violet-600 dark:text-violet-400 ${config.spinner}`}
          strokeWidth={2.2}
        />
      </div>

      {text && (
        <div className="flex flex-col items-center gap-2">
          <p
            className={`font-semibold tracking-wide text-slate-700 dark:text-slate-200 ${config.text}`}
          >
            {text}
          </p>

          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce"
                style={{ animationDelay: `${dot * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md dark:bg-slate-950/80">
        {content}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <span
        role="status"
        aria-label={text || "Loading"}
        className={`inline-flex items-center justify-center ${className}`}
      >
        <Loader2
          className={`animate-spin text-violet-600 dark:text-violet-400 ${config.spinner}`}
        />
        <span className="sr-only">{text || "Loading"}</span>
      </span>
    );
  }

  return (
    <div
      className={`flex w-full flex-1 items-center justify-center px-6 py-10 ${minHeight}`}
    >
      {content}
    </div>
  );
}

export function PageLoader({
  text = "Loading page...",
  minHeight = "min-h-[60vh]",
  size = "md",
  className = "",
}) {
  return (
    <Loader
      variant="page"
      size={size}
      text={text}
      minHeight={minHeight}
      className={className}
    />
  );
}

export function FullScreenLoader({
  text = "Loading application...",
  size = "lg",
}) {
  return (
    <Loader
      variant="fullscreen"
      size={size}
      text={text}
    />
  );
}
