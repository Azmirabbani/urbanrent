import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CalendarClock, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input.jsx";
import { useCreateBooking } from "@/features/booking/useBooking.js";
import { useListing } from "@/features/listings/useListings.js";
import { formatCurrency } from "@/lib/formatCurrency.js";
import { useToast } from "@/context/ToastContext.jsx";
import { supabase } from "@/lib/supabase.js";

function diffDays(a, b) {
  return Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));
}

export default function BookingPage() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { listing, loading: listingLoading } = useListing(listingId);
  const { submit, loading: submitting } = useCreateBooking();

  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState(null);

  const nights =
    checkIn && checkOut && checkOut > checkIn ? diffDays(checkIn, checkOut) : 0;
  const pricePerNight = listing?.price ?? 0;
  const totalPrice = nights * pricePerNight;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!checkIn) {
      setError("Please select a Check-in date.");
      return;
    }
    if (!checkOut) {
      setError("Please select a check-out date.");
      return;
    }
    if (checkOut <= checkIn) {
      setError("Check-out must be after Check-in.");
      return;
    }
    if (nights < 1) {
      setError("Minimal 1 nights.");
      return;
    }

    // overlap check
    try {
      const { data: overlaps } = await supabase
        .from("bookings")
        .select("id")
        .eq("listing_id", listingId)
        .in("status", ["pending", "confirmed"])
        .lt("check_in", checkOut)
        .gt("check_out", checkIn);
      if (overlaps?.length > 0) {
        setError("The selected dates are already booked. Please try different dates.");
        return;
      }
    } catch {
      /* lanjut jika gagal cek */
    }

    try {
      await submit({ listingId, checkIn, checkOut, totalPrice });
      toast({
        title: "Booking submitted",
        description: "Waiting for Owner confirmation.",
        variant: "success",
      });
      navigate("/my-bookings");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950">
      <div className="border-b border-stone-200 bg-white px-4 py-8 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-lg">
          <Link
            to={`/listings/${listingId}`}
            className="mb-4 inline-flex items-center gap-1 text-sm text-stone-500 transition hover:text-teal-700"
          >
            <ChevronLeft className="h-4 w-4" /> Back to listing
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-900 text-white">
              <CalendarClock className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                Booking
              </p>
              <h1 className="text-2xl font-bold text-stone-950 dark:text-white">
                Book Your Stay
              </h1>
            </div>
          </div>
          {listing && (
            <p className="mt-1 text-sm text-stone-500">{listing.title}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
          {/* price summary */}
          {listingLoading ? (
            <div className="h-16 animate-pulse bg-stone-50" />
          ) : listing ? (
            <div className="border-b border-stone-100 dark:border-stone-800 bg-teal-950 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-teal-400">Harga per night</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(pricePerNight)}
                  </p>
                </div>
                {nights > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-teal-400">{nights} nights</p>
                    <p className="text-xl font-bold text-teal-300">
                      {formatCurrency(totalPrice)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <form className="space-y-5 p-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-stone-700 dark:text-stone-300"
                htmlFor="check_in"
              >
                Check-in
              </label>
              <Input
                id="check_in"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && e.target.value >= checkOut) setCheckOut("");
                }}
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-stone-700 dark:text-stone-300"
                htmlFor="check_out"
              >
                Check-out
              </label>
              <Input
                id="check_out"
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                disabled={submitting || !checkIn}
              />
            </div>

            {error && (
              <p
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100"
                role="alert"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || nights < 1}
            >
              {submitting
                ? "Processing…"
                : nights > 0
                  ? `Submit booking · ${formatCurrency(totalPrice)}`
                  : "Book Now"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
