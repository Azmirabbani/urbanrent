import { useState } from "react";
import {
  Compass,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageShell, PageBand, PageContent } from "@/components/PageShell.jsx";
import { SearchFilter } from "@/features/listings/SearchFilter.jsx";
import { ListingCard } from "@/features/listings/ListingCard.jsx";
import { useListings } from "@/features/listings/useListings.js";

const SORTS = [
  { key: "popular", label: "Populer" },
  { key: "newest", label: "Terbaru" },
  { key: "price_asc", label: "Harga terendah" },
];
const PAGE_SIZE = 9;

function ListingSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="aspect-video bg-stone-100 dark:bg-stone-800" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded-lg bg-stone-100 dark:bg-stone-800" />
        <div className="h-3 w-1/2 rounded-lg bg-stone-100 dark:bg-stone-800" />
        <div className="mt-3 h-8 rounded-lg bg-stone-100 dark:bg-stone-800" />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    sort: "popular",
  });
  const [page, setPage] = useState(1);
  const { listings, loading, error } = useListings(filters);

  const totalPages = Math.max(1, Math.ceil(listings.length / PAGE_SIZE));
  const paginated = listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilter(f) {
    setFilters((prev) => ({ ...prev, ...f }));
    setPage(1);
  }

  return (
    <PageShell>
      <PageBand
        eyebrow="Search"
        title="Explore Apartments"
        description="Temukan unit yang pas sesuai kota dan budget kamu."
      />

      <PageContent>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Search filters
            </p>
          </div>
          <SearchFilter onFilter={handleFilter} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                setFilters((prev) => ({ ...prev, sort: s.key }));
                setPage(1);
              }}
              className={
                filters.sort === s.key
                  ? "rounded-lg bg-teal-900 px-4 py-1.5 text-xs font-semibold text-white"
                  : "rounded-lg border border-stone-200 bg-white px-4 py-1.5 text-xs font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400"
              }
            >
              {s.label}
            </button>
          ))}
          {!loading && (
            <span className="ml-auto text-xs text-stone-400">
              {listings.length} listings found
            </span>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <ListingSkeleton key={i} />
              ))
            : paginated.length > 0
              ? paginated.map((l, i) => (
                  <div
                    key={l.id}
                    className="stagger-item"
                    style={{ animationDelay: `${i * 50}ms` }}
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
                ))
              : !error && (
                  <div className="col-span-full flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stone-200 bg-white py-20 text-center dark:border-stone-800 dark:bg-stone-900">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800">
                      <Search
                        className="h-8 w-8 text-stone-400"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-700 dark:text-stone-300">
                        No listings available
                      </p>
                      <p className="mt-1 text-sm text-stone-400">
                        Try adjusting your filters.
                      </p>
                    </div>
                  </div>
                )}
        </div>

        {/* pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50 disabled:opacity-40 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                  page === i + 1
                    ? "bg-teal-900 text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50 disabled:opacity-40 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </PageContent>
    </PageShell>
  );
}
