import { formatDate } from "@/lib/formatDate.js";
import { formatCurrency } from "@/lib/formatCurrency.js";
import { Button } from "@/components/ui/Button.jsx";
import { cn } from "@/lib/utils.js";
import { X, Clock, CheckCircle2, XCircle, CalendarCheck } from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    badge:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
    stripe: "border-l-amber-400",
    icon: Clock,
    iconColor: "text-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    badge:
      "bg-teal-50 text-teal-700 ring-1 ring-teal-200 dark:bg-teal-900/30 dark:text-teal-300",
    stripe: "border-l-teal-500",
    icon: CheckCircle2,
    iconColor: "text-teal-500",
  },
  cancelled: {
    label: "Cancelled",
    badge:
      "bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-400",
    stripe: "border-l-red-400",
    icon: XCircle,
    iconColor: "text-red-400",
  },
  done: {
    label: "Completed",
    badge:
      "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-900/30 dark:text-violet-300",
    stripe: "border-l-violet-400",
    icon: CalendarCheck,
    iconColor: "text-violet-500",
  },
};

function daysUntil(dateStr) {
  const diff = Math.ceil(
    (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24),
  );
  return diff;
}

export function BookingCard({
  title,
  checkIn,
  checkOut,
  status,
  totalPrice,
  image,
  onCancel,
  cancelling,
}) {
  const cfg = statusConfig[status] ?? statusConfig.pending;
  const StatusIcon = cfg.icon;
  const canCancel =
    onCancel && (status === "pending" || status === "confirmed");
  const daysLeft = status === "confirmed" ? daysUntil(checkIn) : null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-l-4 bg-white shadow-sm transition hover:shadow-md dark:bg-stone-900",
        cfg.stripe,
      )}
    >
      <div className="flex gap-4 p-4 sm:p-5">
        {/* thumbnail */}
        {image ? (
          <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-stone-100 shimmer dark:bg-stone-800" />
        )}

        {/* info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-stone-900 dark:text-stone-100">
              {title}
            </p>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                cfg.badge,
              )}
            >
              {cfg.label}
            </span>
          </div>

          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {formatDate(checkIn)} — {formatDate(checkOut)}
          </p>

          {totalPrice != null && (
            <p className="mt-1 text-sm font-semibold text-stone-800 dark:text-stone-200">
              {formatCurrency(totalPrice)}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                cfg.iconColor,
              )}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {status === "pending" && "Waiting for owner confirmation"}
              {status === "confirmed" && daysLeft !== null && daysLeft >= 0
                ? `Check-in in ${daysLeft} days`
                : status === "confirmed"
                  ? "Already checked in"
                  : null}
              {status === "cancelled" && "Booking cancelled"}
              {status === "done" && "Stay completed"}
            </div>

            {canCancel && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 border-red-200 px-2.5 text-xs text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                disabled={cancelling}
                onClick={onCancel}
              >
                <X className="h-3 w-3" />
                {cancelling ? "Cancelling…" : "Cancel"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
