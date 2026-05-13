import { Link } from "react-router-dom";
import { LayoutGrid, Plus, Pencil, Trash2 } from "lucide-react";
import { PageShell, PageBand, PageContent } from "@/components/PageShell.jsx";
import {
  useOwnerListings,
  useDeleteListing,
} from "@/features/owner/useOwner.js";
import { formatCurrency } from "@/lib/formatCurrency.js";
import { Button } from "@/components/ui/Button.jsx";
import { useConfirm } from "@/components/ui/ConfirmModal.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { useState } from "react";
import { cn } from "@/lib/utils.js";

const statusStyle = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  active: "bg-teal-50 text-teal-700 ring-teal-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
};
const statusLabel = {
  pending: "Under Review",
  active: "Active",
  rejected: "Rejected",
};
const statusDot = {
  pending: "bg-amber-400",
  active: "bg-teal-500",
  rejected: "bg-red-400",
};

export default function MyListingsPage() {
  const { listings, loading, error, refetch } = useOwnerListings();
  const { deleteListing, loading: deleting } = useDeleteListing();
  const { toast } = useToast();
  const { confirm, modal } = useConfirm();
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id, title) {
    const ok = await confirm({
      title: `Delete listing "${title}"?`,
      description:
        "This action cannot be undone. All listing data will be permanently deleted.",
      confirmLabel: "Delete listing",
      variant: "danger",
    });
    if (!ok) return;
    setDeletingId(id);
    try {
      await deleteListing(id);
      toast({ title: "Listing deleted", variant: "success" });
      refetch();
    } catch (err) {
      toast({
        title: "Failed to delete",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <PageShell>
      {modal}
      <PageBand
        eyebrow="Owner"
        title="My Properties"
        description="Manage your units, photos, and listing status."
        actions={
          <Link
            to="/Owner/listings/new"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> Tambah listing
          </Link>
        }
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
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-stone-100 dark:bg-stone-800"
                />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {listings.map((l) => (
                <li
                  key={l.id}
                  className="group flex items-center gap-4 px-5 py-4 transition hover:bg-stone-50 dark:hover:bg-stone-800/50"
                >
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
                    {l.photos?.[0] ? (
                      <img
                        src={l.photos[0]}
                        alt={l.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full shimmer" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-stone-900 dark:text-stone-100">
                      {l.title}
                    </p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {l.location} · {formatCurrency(l.price)}/nights
                    </p>
                  </div>
                  <div
                    className={cn(
                      "hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 sm:inline-flex",
                      statusStyle[l.status] ?? statusStyle.pending,
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        statusDot[l.status] ?? statusDot.pending,
                      )}
                    />
                    {statusLabel[l.status] ?? l.status}
                  </div>
                  <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link to={`/Owner/listings/${l.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit"
                        className="h-8 w-8 text-stone-500 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete"
                      disabled={deleting && deletingId === l.id}
                      onClick={() => handleDelete(l.id, l.title)}
                      className="h-8 w-8 text-stone-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-stone-800">
                <LayoutGrid className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-stone-900 dark:text-stone-100">
                  Belum ada listing
                </p>
                <p className="mt-1 text-sm text-stone-400">
                  Add your first property.
                </p>
              </div>
              <Link
                to="/Owner/listings/new"
                className="text-sm font-semibold text-teal-700 hover:underline dark:text-teal-400"
              >
                Buat listing sekarang
              </Link>
            </div>
          )}
        </div>
      </PageContent>
    </PageShell>
  );
}
