import { Link } from "react-router-dom";
import { MapPin, Star, Wifi, Wind, Car, Heart, Share2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency.js";
import { useFavorites } from "@/lib/useFavorites.js";
import { useToast } from "@/context/ToastContext.jsx";

const DEFAULT_AMENITIES = [
  { icon: Wifi, label: "WiFi" },
  { icon: Wind, label: "AC" },
  { icon: Car, label: "Parkir" },
];

export function ListingCard({
  id,
  title,
  location,
  price,
  image,
  amenities,
  rating = 4.8,
}) {
  const { toggle, isFavorite } = useFavorites();
  const { toast } = useToast();
  const fav = isFavorite(id);

  const tags = amenities?.length
    ? amenities.slice(0, 3).map((a) => ({ label: a }))
    : DEFAULT_AMENITIES;

  function handleShare(e) {
    e.preventDefault();
    const url = `${window.location.origin}/listings/${id}`;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied",
          description: "Listing link copied to clipboard.",
          variant: "success",
        });
      });
    }
  }

  function handleFav(e) {
    e.preventDefault();
    toggle(id);
    toast({
      title: fav ? "Removed from favorites" : "Added to favorites",
      variant: fav ? "default" : "success",
    });
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60 dark:border-stone-800 dark:bg-stone-900 dark:hover:shadow-stone-900/60">
      {/* image */}
      <div className="relative aspect-video overflow-hidden bg-stone-100 dark:bg-stone-800">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 shimmer" aria-hidden />
        )}

        {/* price overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent px-4 pb-3 pt-8">
          <span className="text-base font-bold text-white drop-shadow">
            {formatCurrency(price)}
            <span className="text-sm font-normal text-white/80"> / night</span>
          </span>
        </div>

        {/* top actions */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          {/* rating */}
          <div className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-stone-800 shadow-sm backdrop-blur-sm dark:bg-stone-900/90 dark:text-white">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {rating}
          </div>
          {/* share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-stone-600 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-teal-700 dark:bg-stone-900/90 dark:text-stone-300"
            aria-label="Bagikan listing"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          {/* favorite */}
          <button
            type="button"
            onClick={handleFav}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition hover:bg-white dark:bg-stone-900/90"
            aria-label={fav ? "Hapus dari favorit" : "Tambah ke favorit"}
          >
            <Heart
              className={`h-3.5 w-3.5 transition ${fav ? "fill-red-500 text-red-500" : "text-stone-400 hover:text-red-400"}`}
            />
          </button>
        </div>
      </div>

      {/* content */}
      <div className="p-4">
        <h2 className="font-semibold leading-snug text-stone-900 transition-colors group-hover:text-teal-700 dark:text-stone-100">
          {title}
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" aria-hidden />
          {location}
        </p>

        {/* facility tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 ring-1 ring-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:ring-teal-800"
            >
              {Icon && <Icon className="h-3 w-3" aria-hidden />}
              {label}
            </span>
          ))}
        </div>

        <Link
          to={`/listings/${id}`}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-teal-700 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 active:scale-[0.98]"
        >
          Lihat detail
        </Link>
      </div>
    </div>
  );
}
