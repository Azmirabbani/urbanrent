import { cn } from "@/lib/utils.js";

export function PageHeader({
  eyebrow,
  icon: Icon,
  title,
  description,
  actions,
  className,
  align = "left",
}) {
  return (
    <header className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-widest text-teal-600",
            align === "center" && "text-center",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
          align === "center" && "sm:flex-col sm:items-center",
        )}
      >
        <div className="max-w-2xl">
          <div
            className={cn(
              "flex items-center gap-3",
              align === "center" && "justify-center",
            )}
          >
            {Icon ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-900 text-white shadow-md">
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </div>
            ) : null}
            <h1 className="text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
              {title}
            </h1>
          </div>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-stone-500">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}
