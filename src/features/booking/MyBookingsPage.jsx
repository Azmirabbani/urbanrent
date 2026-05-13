import { useState } from "react";
import { Luggage } from "lucide-react";
import { BookingCard } from "@/features/booking/BookingCard.jsx";
import { PageHeader } from "@/components/PageHeader.jsx";
import { useMyBookings } from "@/features/booking/useBooking.js";
import { useToast } from "@/context/ToastContext.jsx";
import { useConfirm } from "@/components/ui/ConfirmModal.jsx";
import { supabase } from "@/lib/supabase.js";

function BookingSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-48 rounded-lg bg-stone-100" />
          <div className="h-3 w-32 rounded-lg bg-stone-100" />
        </div>
        <div className="h-7 w-24 rounded-full bg-stone-100" />
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const { bookings, loading, error, refetch } = useMyBookings();
  const { toast } = useToast();
  const { confirm, modal } = useConfirm();
  const [cancellingId, setCancellingId] = useState(null);

  async function handleCancel(bookingId) {
    const ok = await confirm({
      title: "Cancel this booking?",
      description: "Cancelled bookings cannot be undone.",
      confirmLabel: "Yes, cancel",
      variant: "danger",
    });
    if (!ok) return;
    setCancellingId(bookingId);
    try {
      const { error: updateErr } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);
      if (updateErr) throw updateErr;
      toast({ title: "Booking cancelled", variant: "success" });
      refetch();
    } catch (err) {
      toast({
        title: "Failed to cancel",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950">
      {modal}
      <div className="border-b border-stone-200 bg-white px-4 py-8 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-4xl page-enter">
          <PageHeader
            eyebrow="Tenant"
            icon={Luggage}
            title="My Bookings"
            description="History and status of all your bookings."
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
            {error}{" "}
            <button
              type="button"
              onClick={refetch}
              className="font-semibold underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        <div className="space-y-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <BookingSkeleton key={i} />
              ))
            : bookings.length > 0
              ? bookings.map((b, i) => (
                  <div
                    key={b.id}
                    className="stagger-item"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <BookingCard
                      title={b.listing?.title ?? "Listing"}
                      checkIn={b.check_in}
                      checkOut={b.check_out}
                      status={b.status}
                      totalPrice={b.total_price}
                      image={b.listing?.photos?.[0]}
                      onCancel={() => handleCancel(b.id)}
                      cancelling={cancellingId === b.id}
                    />
                  </div>
                ))
              : !error && (
                  <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-200 bg-white py-20 text-center">
                    <Luggage
                      className="h-10 w-10 text-stone-300"
                      strokeWidth={1.5}
                    />
                    <p className="font-semibold text-stone-700">
                      Belum ada booking
                    </p>
                    <p className="text-sm text-stone-400">
                      Jelajahi apartemen dan Submit booking pertamamu.
                    </p>
                  </div>
                )}
        </div>
      </div>
    </div>
  );
}
