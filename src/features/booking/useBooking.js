import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.js";

/**
 * Fetch semua booking milik user yang sedang login (tenant).
 */
export function useMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Belum login.");

      const { data, error: fetchErr } = await supabase
        .from("bookings")
        .select(
          "id, check_in, check_out, status, total_price, listing:listing_id(id, title, location, photos)",
        )
        .eq("tenant_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;
      setBookings(data ?? []);
    } catch (err) {
      setError(err?.message ?? "Gagal memuat booking.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}

/**
 * Submit booking baru.
 * @returns {{ submit: Function, loading: boolean, error: string|null }}
 */
export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(
    async ({ listingId, checkIn, checkOut, totalPrice }) => {
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Belum login.");

        const { data, error: insertErr } = await supabase
          .from("bookings")
          .insert({
            listing_id: listingId,
            tenant_id: user.id,
            check_in: checkIn,
            check_out: checkOut,
            total_price: totalPrice,
            status: "pending",
          })
          .select()
          .single();

        if (insertErr) throw insertErr;
        return data;
      } catch (err) {
        const msg = err?.message ?? "Gagal membuat booking.";
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { submit, loading, error };
}

// backward-compat default export
export function useBooking() {
  return useMyBookings();
}

