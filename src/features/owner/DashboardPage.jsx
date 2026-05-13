import {
  CalendarDays,
  Building2,
  Wallet,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader.jsx";
import { useOwnerStats, useOwnerBookings } from "@/features/owner/useOwner.js";
import { useAuthContext } from "@/context/AuthContext.jsx";
import { formatCurrency } from "@/lib/formatCurrency.js";
import { formatDate } from "@/lib/formatDate.js";

const statusLabel = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  done: "Completed",
};
const statusBadge = {
  pending:
    "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
  confirmed:
    "bg-teal-50 text-teal-700 ring-1 ring-teal-200 dark:bg-teal-900/30 dark:text-teal-300",
  cancelled:
    "bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-400",
  done: "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-900/30 dark:text-violet-300",
};

// dummy sparkline data
const SPARKLINE = [3, 5, 4, 7, 6, 9, 8];
const BAR_DATA = [
  { day: "Sen", val: 320000 },
  { day: "Sel", val: 550000 },
  { day: "Rab", val: 420000 },
  { day: "Kam", val: 780000 },
  { day: "Jum", val: 650000 },
  { day: "Sab", val: 900000 },
  { day: "Min", val: 720000 },
];
const maxBar = Math.max(...BAR_DATA.map((d) => d.val));

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useOwnerStats();
  const { bookings, loading: bookingsLoading } = useOwnerBookings();
  const { user } = useAuthContext();
  const name = user?.user_metadata?.full_name?.split(" ")[0] ?? "Owner";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950">
      <div className="border-b border-stone-200 bg-white px-4 py-8 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Owner
          </p>
          <h1 className="mt-1 text-2xl font-bold text-stone-950 dark:text-white sm:text-3xl">
            Welcome, {name}! 👋
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Ringkasan properti dan booking kamu days ini.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* booking aktif — dark teal with sparkline */}
          <div className="relative overflow-hidden rounded-2xl border border-teal-800 bg-teal-900 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-teal-400">
                  Active Bookings
                </p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {statsLoading ? "…" : (stats?.activeBookings ?? 0)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-teal-300">
                <CalendarDays className="h-5 w-5" strokeWidth={2} />
              </div>
            </div>
            {/* sparkline */}
            <div className="mt-4 flex items-end gap-1 h-8">
              {SPARKLINE.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-teal-600/60 transition-all"
                  style={{ height: `${(v / Math.max(...SPARKLINE)) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-teal-400">
              <TrendingUp className="h-3 w-3" /> 7-day trend
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30">
              <Building2 className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Total Listings
              </p>
              <p className="text-2xl font-bold text-stone-900 dark:text-white">
                {statsLoading ? "…" : (stats?.totalListings ?? 0)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/30">
              <Wallet className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                This Month's Revenue
              </p>
              <p className="text-2xl font-bold text-stone-900 dark:text-white">
                {statsLoading
                  ? "…"
                  : formatCurrency(stats?.earningsThisMonth ?? 0)}
              </p>
            </div>
          </div>
        </div>

        {/* bar chart pendapatan 7 days */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            Pendapatan 7 days Terakhir
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Estimated from confirmed bookings
          </p>
          <div className="mt-5 flex items-end gap-2 h-28">
            {BAR_DATA.map(({ day, val }) => (
              <div
                key={day}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <div
                  className="w-full rounded-t-lg bg-teal-600/80 transition-all hover:bg-teal-600 dark:bg-teal-700"
                  style={{ height: `${(val / maxBar) * 100}%` }}
                />
                <span className="text-[10px] text-stone-400">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* recent bookings */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 dark:border-stone-800">
            <h2 className="font-semibold text-stone-900 dark:text-stone-100">
              Recent Bookings
            </h2>
            <Link
              to="/Owner/bookings"
              className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-900 dark:text-teal-400"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {bookingsLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-xl bg-stone-100 dark:bg-stone-800"
                />
              ))}
            </div>
          ) : bookings.slice(0, 5).length > 0 ? (
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {bookings.slice(0, 5).map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-stone-50 dark:hover:bg-stone-800/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900 dark:text-stone-100">
                      {b.listing?.title ?? "Listing"}
                    </p>
                    <p className="text-xs text-stone-400">
                      {b.tenant?.full_name ?? "Tenant"} ·{" "}
                      {formatDate(b.check_in)} — {formatDate(b.check_out)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge[b.status] ?? statusBadge.pending}`}
                  >
                    {statusLabel[b.status] ?? b.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Clock className="h-8 w-8 text-stone-300" strokeWidth={1.5} />
              <p className="text-sm text-stone-400">
                No incoming bookings yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
