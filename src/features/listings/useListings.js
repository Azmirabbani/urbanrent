import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.js";

/**
 * Fetch listings dari Supabase dengan filter opsional.
 * @param {{ city?: string; minPrice?: number; maxPrice?: number; sort?: 'popular'|'newest'|'price_asc' }} [filters]
 */
export function useListings(filters = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = useCallback(async () => {
    if (!supabase) {
      setListings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("listings")
        .select("id, title, location, price, photos, status, created_at")
        .eq("status", "active");

      if (filters.city?.trim()) {
        query = query.ilike("location", `%${filters.city.trim()}%`);
      }
      if (filters.minPrice) {
        query = query.gte("price", filters.minPrice);
      }
      if (filters.maxPrice) { query = query.lte("price", filters.maxPrice) }
      if (filters.amenities?.length) { query = query.contains("amenities", filters.amenities) }

      if (filters.sort === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (filters.sort === "price_asc") {
        query = query.order("price", { ascending: true });
      } else {
        // popular — order by created_at desc as default
        query = query.order("created_at", { ascending: false });
      }

      const { data, error: fetchErr } = await query;

      if (fetchErr) throw fetchErr;
      setListings(data ?? []);
    } catch (err) {
      setError(err?.message ?? "Gagal memuat listing.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [filters.city, filters.minPrice, filters.maxPrice, filters.sort]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return { listings, loading, error, refetch: fetchListings };
}

/**
 * Fetch satu listing by ID.
 * @param {string | undefined} id
 */
export function useListing(id) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    supabase
      .from("listings")
      .select("*, owner:owner_id(id, full_name)")
      .eq("id", id)
      .single()
      .then(({ data, error: fetchErr }) => {
        if (fetchErr) {
          setError(fetchErr.message);
          setListing(null);
        } else {
          setListing(data);
        }
        setLoading(false);
      });
  }, [id]);

  return { listing, loading, error };
}

