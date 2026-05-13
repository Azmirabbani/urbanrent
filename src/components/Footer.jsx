import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import logo from "@/assets/urbanrentlogo-removebg-preview.png";
import { formatServiceCities } from "@/lib/cities.js";

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="max-w-md">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="UrbanRent"
              className="h-8 w-8 object-contain brightness-0 invert opacity-90"
            />
            <span className="text-xl font-bold text-white">UrbanRent</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-stone-500">
            Platform sewa apartemen jangka pendek — menghubungkan pemilik dan
            penyewa di kota besar Indonesia.
          </p>
          <div className="mt-5 flex items-start gap-2 text-sm text-stone-500">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-teal-500"
              aria-hidden
            />
            <span>{formatServiceCities()}</span>
          </div>
        </div>

        <p className="mt-12 border-t border-stone-800 pt-8 text-xs text-stone-600">
          © {new Date().getFullYear()} UrbanRent. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
