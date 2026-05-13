import { Heart, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { PageShell, PageBand, PageContent } from "@/components/PageShell.jsx";
import { ListingCard } from "@/features/listings/ListingCard.jsx";
import { useFavorites } from "@/lib/useFavorites.js";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.js";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!favorites.length || !supabase) {
      setListings([]);
      return;
    }
    setLoading(true);
    supabase
      .from("listings")
      .select("id, title, location, price, photos, amenities")
      .in("id", favorites)
      .then(({ data }) => {
        setListings(data ?? []);
        setLoading(false);
      });
  }, [favorites.join(",")]);

  return (
    <PageShell>
      <PageBand
        eyebrow="Favorites"
        icon={Heart}
        title="Favorite Listings"
        description="Listing yang kamu simpan."
      />

      <PageContent>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="aspect-video bg-stone-100 dark:bg-stone-800" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded bg-stone-100 dark:bg-stone-800" />
                  <div className="h-3 w-1/2 rounded bg-stone-100 dark:bg-stone-800" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l, i) => (
              <div
                key={l.id}
                className="stagger-item"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ListingCard
                  id={l.id}
                  title={l.title}
                  location={l.location}
                  price={l.price}
                  image={l.photos?.[0]}
                  amenities={l.amenities}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stone-200 bg-white py-24 text-center dark:border-stone-800 dark:bg-stone-900">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800">
              <Heart className="h-8 w-8 text-stone-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-semibold text-stone-700 dark:text-stone-300">
                Belum ada favorit
              </p>
              <p className="mt-1 text-sm text-stone-400">
                Click the ❤️ icon on a listing to save it.
              </p>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              <Compass className="h-4 w-4" /> Explore listings
            </Link>
          </div>
        )}
      </PageContent>
    </PageShell>
  );
}
