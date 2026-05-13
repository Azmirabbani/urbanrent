import { cn } from "@/lib/utils.js";

/**
 * Consistent page wrapper matching landing page style.
 * - Dark teal header band
 * - Clean white/gray content area
 */
export function PageShell({ children, className }) {
  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-stone-950", className)}>
      {children}
    </div>
  );
}

export function PageBand({
  eyebrow,
  title,
  description,
  actions,
  children,
  dark = false,
}) {
  return (
    <div
      className={cn(
        "border-b px-4 py-8",
        dark
          ? "border-teal-900 bg-stone-950"
          : "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950",
      )}
    >
      <div className="mx-auto max-w-6xl">
        {children ?? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {eyebrow && (
                <p
                  className={cn(
                    "mb-2 text-xs font-semibold uppercase tracking-widest",
                    dark ? "text-teal-400" : "text-teal-600 dark:text-teal-400",
                  )}
                >
                  {eyebrow}
                </p>
              )}
              <h1
                className={cn(
                  "text-2xl font-bold tracking-tight sm:text-3xl",
                  dark ? "text-white" : "text-stone-950 dark:text-white",
                )}
              >
                {title}
              </h1>
              {description && (
                <p
                  className={cn(
                    "mt-1.5 text-sm",
                    dark
                      ? "text-teal-300/70"
                      : "text-stone-500 dark:text-stone-400",
                  )}
                >
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export function PageContent({ children, className, narrow = false }) {
  return (
    <div
      className={cn(
        "mx-auto px-4 py-8",
        narrow ? "max-w-3xl" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Stat card matching landing page "Why UrbanRent" style */
export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  dark = false,
  accent = false,
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5",
        dark
          ? "border-teal-800 bg-teal-900"
          : accent
            ? "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
            : "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={cn(
              "text-xs font-medium",
              dark ? "text-teal-400" : "text-stone-500 dark:text-stone-400",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "mt-1 text-2xl font-bold tabular-nums",
              dark ? "text-white" : "text-stone-900 dark:text-white",
            )}
          >
            {value}
          </p>
          {sub && (
            <p
              className={cn(
                "mt-0.5 text-xs",
                dark ? "text-teal-400/70" : "text-stone-400",
              )}
            >
              {sub}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              dark
                ? "bg-teal-800 text-teal-300"
                : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400",
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
}

/** Progress bar matching landing page benefits style */
export function ProgressBar({ label, value, max = 100, color = "teal" }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-stone-700 dark:text-stone-300">
          {label}
        </span>
        <span className="font-semibold text-teal-700 dark:text-teal-400">
          {pct}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Section divider with label — like landing page separators */
export function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
      <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
        {children}
      </span>
      <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
    </div>
  );
}
