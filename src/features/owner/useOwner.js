import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.js";

/**
 * Stats ringkasan untuk owner dashboard.
 */
export function useOwnerStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
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

      const { data: myListings, error: listErr } = await supabase
        .from("listings")
        .select("id, status")
        .eq("owner_id", user.id);
      if (listErr) throw listErr;

      const listings = myListings ?? [];
      let bookings = [];

      if (listings.length) {
        const { data: bookingData, error: bookErr } = await supabase
          .from("bookings")
          .select("id, status, total_price")
          .in(
            "listing_id",
            listings.map((l) => l.id),
          );
        if (bookErr) throw bookErr;
        bookings = bookingData ?? [];
      }

      const earnings = bookings
        .filter((b) => b.status === "confirmed" || b.status === "done")
        .reduce((sum, b) => sum + (b.total_price ?? 0), 0);

      setStats({
        totalListings: listings.length,
        activeBookings: bookings.filter((b) => b.status === "confirmed").length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        earningsThisMonth: earnings,
      });
    } catch (err) {
      setError(err?.message ?? "Gagal memuat statistik.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return { stats, loading, error, refetch: fetch };
}

/**
 * Listings milik owner yang login.
 */
export function useOwnerListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = useCallback(async () => {
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
        .from("listings")
        .select("id, title, location, price, photos, status, created_at")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;
      setListings(data ?? []);
    } catch (err) {
      setError(err?.message ?? "Gagal memuat listing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);
  return { listings, loading, error, refetch: fetchListings };
}

/**
 * Booking masuk untuk semua listing milik owner.
 */
export function useOwnerBookings() {
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

      // Ambil listing milik owner dulu, lalu fetch bookings berdasarkan listing_id
      const { data: myListings, error: listErr } = await supabase
        .from("listings")
        .select("id")
        .eq("owner_id", user.id);

      if (listErr) throw listErr;
      if (!myListings?.length) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const listingIds = myListings.map((l) => l.id);

      const { data, error: fetchErr } = await supabase
        .from("bookings")
        .select(
          "id, check_in, check_out, status, total_price, created_at, tenant:tenant_id(id, full_name, email), listing:listing_id(id, title)",
        )
        .in("listing_id", listingIds)
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;
      setBookings(data ?? []);
    } catch (err) {
      setError(err?.message ?? "Gagal memuat booking.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (bookingId, status) => {
      if (!supabase) return;
      const { error: updateErr } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);
      if (updateErr) throw updateErr;
      await fetchBookings();
    },
    [fetchBookings],
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);
  return { bookings, loading, error, refetch: fetchBookings, updateStatus };
}

/**
 * Create / update listing.
 */
export function useUpsertListing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upsert = useCallback(async (payload, id = null) => {
    if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Belum login.");

      const row = { ...payload, owner_id: user.id };
      let res;
      if (id) {
        res = await supabase
          .from("listings")
          .update(row)
          .eq("id", id)
          .select()
          .single();
      } else {
        res = await supabase
          .from("listings")
          .insert({ ...row, status: "active" })
          .select()
          .single();
      }
      if (res.error) throw res.error;
      return res.data;
    } catch (err) {
      const msg = err?.message ?? "Gagal menyimpan listing.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { upsert, loading, error };
}

/**
 * Delete listing by id.
 */
export function useDeleteListing() {
  const [loading, setLoading] = useState(false);

  const deleteListing = useCallback(async (id) => {
    if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
    setLoading(true);
    try {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteListing, loading };
}

// backward-compat
export function useOwner() {
  const { stats, loading, error, refetch } = useOwnerStats();
  return { stats, listings: [], loading, error, refetch };
}
