import { cn } from "@/lib/utils.js";
import { useCountUp } from "@/lib/useCountUp.js";
import { useInView } from "@/lib/useInView.js";

const accents = {
  teal: "border-teal-200/80 bg-linear-to-br from-teal-50/90 to-white ring-teal-600/10",
  amber:
    "border-amber-200/80 bg-linear-to-br from-amber-50/90 to-white ring-amber-600/10",
  violet:
    "border-violet-200/80 bg-linear-to-br from-violet-50/90 to-white ring-violet-600/10",
};

const iconWrap = {
  teal: "bg-teal-800 text-white",
  amber: "bg-amber-600 text-white",
  violet: "bg-violet-700 text-white",
};

/**
 * @param {{ icon?: import('lucide-react').LucideIcon; label: string; value: React.ReactNode; accent?: keyof typeof accents }} props
 */
export function StatTile({ icon: Icon, label, value, accent = "teal" }) {
  const [ref, inView] = useInView();
  const numericValue = typeof value === "number" ? value : null;
  const animated = useCountUp(numericValue ?? 0, {
    enabled: inView && numericValue !== null,
  });
  const display = numericValue !== null ? animated : value;

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border p-5 shadow-sm ring-1 card-hover",
        accents[accent],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-stone-600">{label}</p>
          <p
            className={cn(
              "mt-2 text-2xl font-bold tabular-nums text-stone-900",
              inView && "count-up",
            )}
            style={{ animation: inView ? "count-up 0.4s ease both" : "none" }}
          >
            {display}
          </p>
        </div>
        {Icon ? (
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
              iconWrap[accent],
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
          </span>
        ) : null}
      </div>
    </div>
  );
}
