import { Gavel, Check, X } from "lucide-react";
import { PageShell, PageBand, PageContent } from "@/components/PageShell.jsx";
import { usePendingListings } from "@/features/admin/useAdmin.js";
import { Button } from "@/components/ui/Button.jsx";
import { formatDate } from "@/lib/formatDate.js";
import { formatCurrency } from "@/lib/formatCurrency.js";
import { useToast } from "@/context/ToastContext.jsx";
import { useState } from "react";

export default function ListingModerationPage() {
  const { listings, loading, error, moderateListing } = usePendingListings();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState(null);

  async function handleModerate(id, status) {
    setProcessingId(id);
    try {
      await moderateListing(id, status);
      toast({
        title: status === "active" ? "Listing approved" : "Listing rejected",
        variant: status === "active" ? "success" : "default",
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
        eyebrow="Admin"
        title="Listing Moderation"
        description="Setujui atau tolak listing dengan status pending."
      />

      <PageContent>
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-stone-100 dark:bg-stone-800"
                />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {listings.map((l) => (
                <li
                  key={l.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-stone-50 dark:hover:bg-stone-800/50 sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      {l.title}
                    </p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {l.location} · {formatCurrency(l.price)}/nights
                    </p>
                    <p className="text-xs text-stone-400">
                      Owner: {l.owner?.full_name ?? "—"} ·{" "}
                      {formatDate(l.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400"
                      disabled={processingId === l.id}
                      onClick={() => handleModerate(l.id, "active")}
                    >
                      <Check className="h-3.5 w-3.5" /> Setujui
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                      disabled={processingId === l.id}
                      onClick={() => handleModerate(l.id, "rejected")}
                    >
                      <X className="h-3.5 w-3.5" /> Tolak
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800">
                <Gavel className="h-7 w-7 text-stone-400" strokeWidth={1.5} />
              </div>
              <p className="font-semibold text-stone-700 dark:text-stone-300">
                Tidak ada listing pending
              </p>
              <p className="text-sm text-stone-400">
                All listings have been moderated.
              </p>
            </div>
          )}
        </div>
      </PageContent>
    </PageShell>
  );
}
