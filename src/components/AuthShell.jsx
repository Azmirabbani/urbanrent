import { KeyRound, Sparkles, Mail } from "lucide-react";

const panels = {
  signin: {
    Icon: KeyRound,
    title: "Masuk ke UrbanRent",
    tagline: "Booking apartemen dan kelola Profile — ringkas di satu akun.",
    bullets: [
      "Riwayat booking terpusat",
      "Notifikasi status sewa",
      "Profile aman dengan Supabase Auth",
    ],
  },
  signup: {
    Icon: Sparkles,
    title: "Mulai sewa atau sewakan",
    tagline: "Tenant cari unit pas; Owner kelola listing dari dashboard.",
    bullets: [
      "Daftar Tenant atau Owner",
      "Verifikasi email sekali",
      "Listing baru ditinjau admin",
    ],
  },
  recover: {
    Icon: Mail,
    title: "Pemulihan akun",
    tagline: "Link reset dikirim ke inbox — periksa juga folder spam.",
    bullets: [
      "Tautan berlaku terbatas",
      "Sandi baru langsung aktif",
      "Butuh bantu? Hubungi admin",
    ],
  },
};

/**
 * Layout dua kolom di layar besar: panel visual + form.
 * @param {{ variant?: keyof typeof panels; children: React.ReactNode }} props
 */
export function AuthShell({ variant = "signin", children }) {
  const { Icon, title, tagline, bullets } = panels[variant];

  return (
    <div className="min-h-[calc(100vh-8rem)] lg:grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] dark:bg-stone-950">
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-teal-900 via-teal-800 to-stone-900 lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="relative">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Icon className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <h2 className="mt-8 text-3xl font-bold leading-tight text-white">
            {title}
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-teal-100/95">
            {tagline}
          </p>
        </div>
        <ul className="relative mt-12 space-y-3 text-sm text-teal-50/95">
          {bullets.map((line) => (
            <li key={line} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white">
                ✓
              </span>
              {line}
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-12 lg:py-16 dark:bg-stone-950">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 rounded-2xl bg-linear-to-br from-teal-800 to-stone-900 p-6 text-white shadow-lg lg:hidden">
            <Icon
              className="mb-3 h-9 w-9 opacity-95"
              strokeWidth={2}
              aria-hidden
            />
            <p className="text-lg font-bold leading-snug">{title}</p>
            <p className="mt-2 text-sm leading-relaxed text-teal-100/95">
              {tagline}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
