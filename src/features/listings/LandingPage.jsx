import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  MapPin,
  Building2,
  ShieldCheck,
  Wifi,
  Wind,
  Waves,
  Car,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
} from "lucide-react";
import { SERVICE_CITIES, formatServiceCities } from "@/lib/cities.js";

const SERVICES = [
  {
    icon: MapPin,
    title: "Lokasi Strategis",
    desc: "Filter kota dan harga untuk sewa harian atau mingguan di lokasi terbaik.",
  },
  {
    icon: Building2,
    title: "Apartemen Premium",
    desc: "Listing dikurasi khusus untuk unit apartemen berkualitas.",
  },
  {
    icon: ShieldCheck,
    title: "Terverifikasi",
    desc: "Setiap listing ditinjau tim kami sebelum tampil ke penyewa.",
  },
  {
    icon: TrendingUp,
    title: "Harga Transparan",
    desc: "Tidak ada biaya tersembunyi. Harga yang kamu lihat adalah yang kamu bayar.",
  },
  {
    icon: Users,
    title: "Owner Terpercaya",
    desc: "Semua pemilik properti telah melalui proses verifikasi identitas.",
  },
  {
    icon: Award,
    title: "Booking Mudah",
    desc: "Submit booking dalam hitungan menit, konfirmasi langsung dari Owner.",
  },
];

const BENEFITS = [
  { label: "Proses booking cepat & mudah", pct: 95 },
  { label: "Kepuasan penyewa", pct: 98 },
  { label: "Verified listings", pct: 100 },
  { label: "Respons Owner dalam 24 jam", pct: 90 },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden bg-gray-50">
      {/* ── HERO ── */}
      <section className="relative px-4 pb-0 pt-16 sm:pt-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgb(20 83 45 / 0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="fade-rise inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-medium text-stone-600 shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
            Platform sewa apartemen Indonesia
          </div>

          <h1 className="fade-rise fade-rise-delay-1 mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
            Temukan Apartemen Terbaik
            <br />
            <span className="text-teal-700">dengan Harga Transparan</span>
          </h1>

          <p className="fade-rise fade-rise-delay-2 mx-auto mt-5 max-w-xl text-base text-stone-500 sm:text-lg">
            UrbanRent menghubungkan pemilik properti dengan penyewa — sewa
            harian &amp; mingguan, proses cepat, tanpa ribet.
          </p>

          <div className="fade-rise fade-rise-delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/explore"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-teal-700 px-7 text-sm font-semibold text-white shadow-md shadow-teal-700/20 transition hover:bg-teal-800 active:scale-[0.98]"
            >
              Jelajahi Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-stone-300 bg-white px-7 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 active:scale-[0.98]"
            >
              Daftar sebagai Owner
            </Link>
          </div>

          {/* social proof */}
          <div className="fade-rise mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {[
                  "bg-teal-500",
                  "bg-amber-400",
                  "bg-violet-500",
                  "bg-rose-400",
                ].map((c, i) => (
                  <div
                    key={i}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${c}`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-1 text-xs font-medium text-stone-700">
                  4.9
                </span>
              </div>
              <span className="text-xs text-stone-500">
                Dipercaya ribuan penyewa
              </span>
            </div>
          </div>

          {/* browser mockup */}
          <div className="relative mx-auto mt-14 max-w-4xl">
            <div className="overflow-hidden rounded-t-3xl border border-stone-200 bg-stone-50 shadow-xl shadow-stone-200/60">
              {/* browser bar */}
              <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-5 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="mx-auto flex h-6 w-48 items-center justify-center rounded-md bg-stone-100 text-xs text-stone-400">
                  urbanrent.id/explore
                </div>
              </div>
              {/* stat cards */}
              <div className="grid grid-cols-3 gap-4 p-6">
                {[
                  {
                    value: `${SERVICE_CITIES.length} kota`,
                    label: "Kota tersedia",
                    sub: formatServiceCities(),
                    dark: true,
                  },
                  {
                    value: "Harian",
                    label: "Tipe sewa",
                    sub: "dan mingguan",
                    dark: false,
                  },
                  {
                    value: "100%",
                    label: "Terverifikasi",
                    sub: "oleh tim UrbanRent",
                    dark: true,
                  },
                ].map(({ value, label, sub, dark }) => (
                  <div
                    key={label}
                    className={`rounded-2xl p-5 text-left ${dark ? "bg-teal-900 text-white" : "bg-white ring-1 ring-stone-200"}`}
                  >
                    <p
                      className={`text-2xl font-bold ${dark ? "text-teal-300" : "text-stone-900"}`}
                    >
                      {value}
                    </p>
                    <p
                      className={`mt-1 text-sm font-semibold ${dark ? "text-white" : "text-stone-800"}`}
                    >
                      {label}
                    </p>
                    <p
                      className={`mt-0.5 text-xs ${dark ? "text-teal-400/70" : "text-stone-400"}`}
                    >
                      {sub}
                    </p>
                  </div>
                ))}
              </div>
              {/* amenity row */}
              <div className="flex flex-wrap gap-2 border-t border-stone-200 bg-white px-6 py-4">
                {[
                  { icon: Wifi, label: "Wi-Fi" },
                  { icon: Wind, label: "AC" },
                  { icon: Waves, label: "Kolam renang" },
                  { icon: Car, label: "Parkir" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 ring-1 ring-teal-100"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                ))}
                <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-500">
                  +8 lainnya
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES — dark teal ── */}
      <section className="bg-teal-950 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
              Our Services
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Complete &amp; Integrated Services
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-teal-300/60">
              Everything you need untuk sewa apartemen — dalam satu platform.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-teal-800/50 bg-teal-800/30 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-teal-950 p-6 transition hover:bg-teal-900/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-800/60 text-teal-300">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-teal-700 transition group-hover:text-teal-400" />
                </div>
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-teal-300/60">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS — white, split ── */}
      <section className="bg-white px-4 py-20 dark:bg-stone-950">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* left: visual */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-50 p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                  Kenapa UrbanRent?
                </p>
                <p className="mt-2 text-2xl font-bold text-stone-900">
                  Sewa lebih mudah,
                </p>
                <p className="text-2xl font-bold text-teal-700">
                  lebih aman, lebih cepat.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Booking Instan",
                      desc: "Konfirmasi dalam hitungan jam.",
                      accent: "bg-teal-900 text-white",
                    },
                    {
                      label: "Harga Jelas",
                      desc: "Tanpa biaya tersembunyi.",
                      accent: "bg-white ring-1 ring-stone-200",
                    },
                    {
                      label: "Properti Kurasi",
                      desc: "Lolos verifikasi admin.",
                      accent: "bg-white ring-1 ring-stone-200",
                    },
                    {
                      label: "Mudah Dibatalkan",
                      desc: "Batalkan kapan saja.",
                      accent: "bg-teal-900 text-white",
                    },
                  ].map(({ label, desc, accent }) => (
                    <div key={label} className={`rounded-2xl p-4 ${accent}`}>
                      <CheckCircle2
                        className={`h-4 w-4 ${accent.includes("teal-900") ? "text-teal-400" : "text-teal-600"}`}
                      />
                      <p
                        className={`mt-2 text-sm font-semibold ${accent.includes("teal-900") ? "text-white" : "text-stone-900"}`}
                      >
                        {label}
                      </p>
                      <p
                        className={`mt-0.5 text-xs ${accent.includes("teal-900") ? "text-teal-300/70" : "text-stone-500"}`}
                      >
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* right: progress bars */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                Why UrbanRent
              </p>
              <h2 className="mt-3 text-3xl font-bold text-stone-900 sm:text-4xl">
                Key Benefits for You
              </h2>
              <p className="mt-4 text-stone-500">
                Kami memastikan pengalaman sewa yang mulus — dari pencarian
                hingga check-out.
              </p>
              <div className="mt-8 space-y-5">
                {BENEFITS.map(({ label, pct }) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-stone-700">
                        {label}
                      </span>
                      <span className="font-semibold text-teal-700">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                      <div
                        className="h-full rounded-full bg-teal-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — dark ── */}
      <section className="bg-stone-950 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Get started in 3 steps
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Find a listing",
                desc: "Filter kota dan harga sesuai kebutuhan kamu.",
              },
              {
                step: "02",
                title: "Book Now",
                desc: "Select check-in and check-out dates, then submit.",
              },
              {
                step: "03",
                title: "Check-in",
                desc: "Owner confirms, you are ready to check in.",
              },
            ].map(({ step, title, desc }, i) => (
              <div
                key={step}
                className="relative flex flex-col items-center gap-4 text-center"
              >
                {i < 2 && (
                  <div
                    className="absolute left-[calc(50%+2rem)] top-7 hidden h-px w-[calc(100%-4rem)] border-t-2 border-dashed border-teal-800 sm:block"
                    aria-hidden
                  />
                )}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-800/40 text-xl font-bold text-teal-400 ring-1 ring-teal-700/50">
                  {step}
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-stone-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative overflow-hidden bg-teal-700 px-4 py-20 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-200">
            Get started
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Dari Pencarian ke Check-in in Hitungan Menit
          </h2>
          <p className="mt-4 text-teal-100/70">
            Bergabung dan temukan apartemen terbaik di kotamu.
          </p>
          <Link
            to="/signup"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-stone-950 px-8 text-sm font-semibold text-white shadow-lg transition hover:bg-stone-800 active:scale-[0.98]"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
