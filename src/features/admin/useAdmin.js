import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.js";

/**
 * Overview stats untuk admin dashboard.
 */
export function useAdminOverview() {
  const [overview, setOverview] = useState(null);
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
      const [usersRes, listingsRes, bookingsRes] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("listings").select("id, status", { count: "exact" }),
        supabase.from("bookings").select("id, created_at", { count: "exact" }),
      ]);

      const listings = listingsRes.data ?? [];
      const now = new Date();
      const bookingsThisMonth = (bookingsRes.data ?? []).filter((b) => {
        const d = new Date(b.created_at ?? 0);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });

      setOverview({
        totalUsers: usersRes.count ?? 0,
        activeListings: listings.filter((l) => l.status === "active").length,
        pendingListings: listings.filter((l) => l.status === "pending").length,
        bookingsThisMonth: bookingsThisMonth.length,
      });
    } catch (err) {
      setError(err?.message ?? "Gagal memuat data admin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return { overview, loading, error, refetch: fetch };
}

/**
 * Listing pending untuk moderasi.
 */
export function usePendingListings() {
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
      const { data, error: fetchErr } = await supabase
        .from("listings")
        .select(
          "id, title, location, price, status, created_at, owner:owner_id(id, full_name, email)",
        )
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (fetchErr) throw fetchErr;
      setListings(data ?? []);
    } catch (err) {
      setError(err?.message ?? "Gagal memuat listing pending.");
    } finally {
      setLoading(false);
    }
  }, []);

  const moderateListing = useCallback(
    async (id, status) => {
      if (!supabase) return;
      const { error: updateErr } = await supabase
        .from("listings")
        .update({ status })
        .eq("id", id);
      if (updateErr) throw updateErr;
      await fetchListings();
    },
    [fetchListings],
  );

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);
  return { listings, loading, error, refetch: fetchListings, moderateListing };
}

/**
 * Semua user untuk manajemen.
 */
export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from("users")
        .select("id, full_name, email, role, is_banned, created_at")
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;
      setUsers(data ?? []);
    } catch (err) {
      setError(err?.message ?? "Gagal memuat pengguna.");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleBan = useCallback(
    async (userId, isBanned) => {
      if (!supabase) return;
      const { error: updateErr } = await supabase
        .from("users")
        .update({ is_banned: isBanned })
        .eq("id", userId);
      if (updateErr) throw updateErr;
      await fetchUsers();
    },
    [fetchUsers],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  return { users, loading, error, refetch: fetchUsers, toggleBan };
}

// backward-compat
export function useAdmin() {
  const { overview, loading, error, refetch } = useAdminOverview();
  return { overview, loading, error, refetch };
}


