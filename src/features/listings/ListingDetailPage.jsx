import { useParams, Link, useNavigate } from "react-router-dom";
import {
  BedDouble,
  MapPin,
  Shield,
  Wifi,
  ChevronLeft,
  MessageCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency.js";
import { useListing } from "@/features/listings/useListings.js";
import { useAuthContext } from "@/context/AuthContext.jsx";
import { supabase } from "@/lib/supabase.js";
import { useState } from "react";

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-4 w-24 rounded bg-stone-200" />
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="space-y-4 lg:col-span-2">
          <div className="aspect-16/10 rounded-2xl bg-stone-200" />
          <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
            <div className="h-5 w-1/2 rounded bg-stone-200" />
            <div className="h-3 w-full rounded bg-stone-100" />
            <div className="h-3 w-4/5 rounded bg-stone-100" />
          </div>
        </div>
        <div className="h-64 rounded-2xl bg-stone-200" />
      </div>
    </div>
  );
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { listing, loading, error } = useListing(id);
  const [startingChat, setStartingChat] = useState(false);

  async function handleChat() {
    if (!user) {
      navigate("/signin");
      return;
    }
    const ownerId = listing?.owner_id;
    if (!supabase || !ownerId) return;
    setStartingChat(true);
    try {
      // cek existing conversation
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .or(
          `and(tenant_id.eq.${user.id},owner_id.eq.${ownerId}),and(tenant_id.eq.${ownerId},owner_id.eq.${user.id})`,
        )
        .eq("listing_id", id)
        .maybeSingle();

      if (existing) {
        navigate(`/messages/${existing.id}`);
        return;
      }

      // buat baru
      const { data: created, error: createErr } = await supabase
        .from("conversations")
        .insert({
          tenant_id: user.id,
          owner_id: ownerId,
          listing_id: id,
        })
        .select("id")
        .single();

      if (createErr) throw createErr;
      navigate(`/messages/${created.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setStartingChat(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-stone-950">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-stone-950">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-100">
            {error ?? "Listing tidak ditemukan."}
          </div>
          <Link
            to="/explore"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-800 hover:underline"
          >
            <ChevronLeft className="h-4 w-4" /> Back to explore
          </Link>
        </div>
      </div>
    );
  }

  const amenities = listing.amenities ?? ["Wi‑Fi", "AC"];
  const images = listing.photos ?? [];
  const ownerId = listing.owner_id;
  const ownerProfile = listing.owner;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Link
          to="/explore"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-600 transition hover:text-teal-800"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Kembali
        </Link>

        <div className="mt-2 grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-4 lg:col-span-2">
            {/* Gallery */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="aspect-16/10 min-h-[200px] flex-1 overflow-hidden rounded-2xl bg-stone-200 ring-1 ring-stone-300/80 sm:min-h-[280px]">
                {images[0] ? (
                  <img
                    src={images[0]}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full shimmer" />
                )}
              </div>
              {images.length > 1 && (
                <div className="hidden shrink-0 flex-col gap-3 sm:flex sm:w-36">
                  {images.slice(1, 3).map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-xl bg-stone-200 ring-1 ring-stone-300/80"
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-6">
              <h1 className="text-xl font-bold text-stone-900">
                {listing.title}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-600">
                <MapPin
                  className="h-4 w-4 shrink-0 text-teal-700"
                  aria-hidden
                />
                {listing.location}
              </p>
              {listing.description && (
                <p className="mt-4 text-sm leading-relaxed text-stone-600">
                  {listing.description}
                </p>
              )}
              {amenities.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {amenities.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900 ring-1 ring-teal-100"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              {ownerProfile?.full_name && (
                <p className="mt-6 border-t border-stone-100 pt-4 text-sm text-stone-600">
                  Owner:{" "}
                  <span className="font-medium text-stone-900">
                    {ownerProfile.full_name}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-lg dark:border-stone-800 dark:bg-stone-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Starting from
              </p>
              <p className="mt-1 text-3xl font-bold text-stone-900 dark:text-white">
                {formatCurrency(listing.price)}
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                per night
              </p>
              <Link
                to={`/listings/${id}/book`}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-teal-800 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-teal-900 active:scale-[0.99]"
              >
                Submit booking
              </Link>
              {ownerId && ownerId !== user?.id && (
                <button
                  type="button"
                  onClick={handleChat}
                  disabled={startingChat}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 active:scale-[0.99] disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  <MessageCircle className="h-4 w-4" />
                  {startingChat ? "Opening chat…" : "Chat with Owner"}
                </button>
              )}
              <ul className="mt-6 space-y-3 border-t border-stone-100 pt-6 text-sm text-stone-600">
                <li className="flex items-center gap-2">
                  <MapPin
                    className="h-4 w-4 shrink-0 text-teal-700"
                    aria-hidden
                  />
                  {listing.location}
                </li>
                {listing.max_guests && (
                  <li className="flex items-center gap-2">
                    <BedDouble
                      className="h-4 w-4 shrink-0 text-teal-700"
                      aria-hidden
                    />
                    Max. {listing.max_guests} tamu
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Wifi
                    className="h-4 w-4 shrink-0 text-teal-700"
                    aria-hidden
                  />
                  Internet &amp; utilities
                </li>
                <li className="flex items-center gap-2">
                  <Shield
                    className="h-4 w-4 shrink-0 text-teal-700"
                    aria-hidden
                  />
                  UrbanRent Verified
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

