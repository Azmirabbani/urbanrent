import { ClipboardList, Check, X, Clock } from "lucide-react";
import { PageShell, PageBand, PageContent } from "@/components/PageShell.jsx";
import { useOwnerBookings } from "@/features/owner/useOwner.js";
import { Button } from "@/components/ui/Button.jsx";
import { formatDate } from "@/lib/formatDate.js";
import { formatCurrency } from "@/lib/formatCurrency.js";
import { useToast } from "@/context/ToastContext.jsx";
import { useState } from "react";
import { cn } from "@/lib/utils.js";

const statusStyle = {
  pending:
    "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
  confirmed:
    "bg-teal-50 text-teal-700 ring-1 ring-teal-200 dark:bg-teal-900/30 dark:text-teal-300",
  cancelled:
    "bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-400",
  done: "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-900/30 dark:text-violet-300",
};
const statusLabel = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  done: "Completed",
};

export default function OwnerBookingsPage() {
  const { bookings, loading, error, updateStatus } = useOwnerBookings();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState(null);

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  async function handleAction(id, status) {
    setProcessingId(id);
    try {
      await updateStatus(id, status);
      toast({
        title:
          status === "confirmed" ? "Booking confirmed" : "Booking rejected",
        variant: status === "confirmed" ? "success" : "default",
      });
    } catch (err) {
      toast({
        title: "Failed to update",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <PageShell>
      <PageBand
        eyebrow="Owner"
        title="Incoming Bookings"
        description="Approve or reject requests from Tenants."
      />

      <PageContent>
        {/* mini stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Bookings",
              value: bookings.length,
              color: "text-stone-900 dark:text-white",
            },
            { label: "Pending", value: pending, color: "text-amber-600" },
            { label: "Confirmed", value: confirmed, color: "text-teal-600" },
            {
              label: "Completed",
              value: bookings.filter((b) => b.status === "done").length,
              color: "text-violet-600",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900"
            >
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {label}
              </p>
              <p className={`mt-1 text-2xl font-bold tabular-nums ${color}`}>
                {loading ? "…" : value}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-stone-100 dark:bg-stone-800"
                />
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {bookings.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-stone-50 dark:hover:bg-stone-800/50 sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      {b.listing?.title ?? "Listing"}
                    </p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {b.tenant?.full_name ?? "Tenant"} ·{" "}
                      {formatDate(b.check_in)} — {formatDate(b.check_out)}
                    </p>
                    {b.total_price != null && (
                      <p className="mt-0.5 text-sm font-medium text-stone-700 dark:text-stone-300">
                        {formatCurrency(b.total_price)}
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
                      statusStyle[b.status] ?? statusStyle.pending,
                    )}
                  >
                    {statusLabel[b.status] ?? b.status}
                  </span>
                  {b.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400"
                        disabled={processingId === b.id}
                        onClick={() => handleAction(b.id, "confirmed")}
                      >
                        <Check className="h-3.5 w-3.5" /> Setujui
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                        disabled={processingId === b.id}
                        onClick={() => handleAction(b.id, "cancelled")}
                      >
                        <X className="h-3.5 w-3.5" /> Tolak
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800">
                <Clock className="h-7 w-7 text-stone-400" strokeWidth={1.5} />
              </div>
              <p className="font-semibold text-stone-700 dark:text-stone-300">
                Belum ada booking masuk
              </p>
              <p className="text-sm text-stone-400">
                Booking akan muncul di sini setelah Tenant mengajukan.
              </p>
            </div>
          )}
        </div>
      </PageContent>
    </PageShell>
  );
}
