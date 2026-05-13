import { useState } from "react";
import { SERVICE_CITIES } from "@/lib/cities.js";
import {
  Search,
  X,
  Wifi,
  Wind,
  Car,
  Waves,
  UtensilsCrossed,
  Tv,
} from "lucide-react";
import { Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";

const AMENITY_FILTERS = [
  { id: "Wi-Fi", icon: Wifi, label: "WiFi" },
  { id: "AC", icon: Wind, label: "AC" },
  { id: "Parkir", icon: Car, label: "Parkir" },
  { id: "Kolam renang", icon: Waves, label: "Kolam" },
  { id: "Dapur", icon: UtensilsCrossed, label: "Dapur" },
  { id: "TV", icon: Tv, label: "TV" },
];

export function SearchFilter({ onFilter }) {
  const [city, setCity] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [amenities, setAmenities] = useState([]);

  const hasFilter = city || min || max || amenities.length > 0;

  function toggleAmenity(id) {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    onFilter({
      city,
      minPrice: min ? Number(min) : "",
      maxPrice: max ? Number(max) : "",
      amenities,
    });
  }

  function handleReset() {
    setCity("");
    setMin("");
    setMax("");
    setAmenities([]);
    onFilter({ city: "", minPrice: "", maxPrice: "", amenities: [] });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* row 1: city + price */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-1.5">
          <label
            className="text-xs font-medium text-stone-600 dark:text-stone-400"
            htmlFor="Kota"
          >
            City
          </label>
          <Input
            id="Kota"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={SERVICE_CITIES.join(", ")}
            className="transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:w-64">
          <div className="space-y-1.5">
            <label
              className="text-xs font-medium text-stone-600 dark:text-stone-400"
              htmlFor="min"
            >
              Min (Rp)
            </label>
            <Input
              id="min"
              type="number"
              min={0}
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-1.5">
            <label
              className="text-xs font-medium text-stone-600 dark:text-stone-400"
              htmlFor="max"
            >
              Max (Rp)
            </label>
            <Input
              id="max"
              type="number"
              min={0}
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="∞"
            />
          </div>
        </div>
      </div>

      {/* row 2: amenity chips */}
      <div>
        <p className="mb-2 text-xs font-medium text-stone-600 dark:text-stone-400">
          Fasilitas
        </p>
        <div className="flex flex-wrap gap-2">
          {AMENITY_FILTERS.map(({ id, icon: Icon, label }) => {
            const active = amenities.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleAmenity(id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                  active
                    ? "bg-teal-800 text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:border-teal-300 hover:text-teal-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400"
                }`}
              >
                <Icon className="h-3 w-3" aria-hidden />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* row 3: actions */}
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" className="gap-1.5">
          <Search className="h-3.5 w-3.5" aria-hidden />
          Cari
        </Button>
        {hasFilter && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={handleReset}
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Reset
          </Button>
        )}
        {hasFilter && (
          <span className="text-xs text-teal-700 dark:text-teal-400">
            {[
              city && `Kota: ${city}`,
              amenities.length && `${amenities.length} fasilitas`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        )}
      </div>
    </form>
  );
}
