import {
  Shield,
  Users,
  Building2,
  CalendarDays,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  PageShell,
  PageBand,
  PageContent,
  StatCard,
  ProgressBar,
} from "@/components/PageShell.jsx";
import {
  useAdminOverview,
  usePendingListings,
} from "@/features/admin/useAdmin.js";
import { formatDate } from "@/lib/formatDate.js";

const NAV_ITEMS = [
  {
    to: "/admin/users",
    label: "User Management",
    desc: "Ban/unban, lihat semua user",
  },
  {
    to: "/admin/listings",
    label: "Listing Moderation",
    desc: "Approve/reject listing pending",
  },
  { to: "/admin/Analytics", label: "Analytics", desc: "Platform statistics" },
];

export default function AdminDashboardPage() {
  const { overview, loading: overviewLoading } = useAdminOverview();
  const { listings: pendingListings, loading: pendingLoading } =
    usePendingListings();

  return (
    <PageShell>
      <PageBand
        eyebrow="Super Admin"
        title="Dashboard"
        description="UrbanRent platform overview."
      />

      <PageContent>
        {/* stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Users}
            label="Total Users"
            value={overviewLoading ? "…" : (overview?.totalUsers ?? 0)}
            dark
          />
          <StatCard
            icon={Building2}
            label="Active Listings"
            value={overviewLoading ? "…" : (overview?.activeListings ?? 0)}
          />
          <StatCard
            icon={CalendarDays}
            label="Bookings This Month"
            value={overviewLoading ? "…" : (overview?.bookingsThisMonth ?? 0)}
          />
        </div>

        {/* platform health progress bars */}
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Platform Health
          </p>
          <h2 className="mt-1 font-semibold text-stone-900 dark:text-stone-100">
            Key Indicators
          </h2>
          <div className="mt-5 space-y-4">
            <ProgressBar
              label="Verified listings"
              value={overview?.activeListings ?? 0}
              max={Math.max(
                (overview?.activeListings ?? 0) +
                  (overview?.pendingListings ?? 0),
                1,
              )}
            />
            <ProgressBar
              label="Bookings This Month"
              value={overview?.bookingsThisMonth ?? 0}
              max={Math.max(overview?.bookingsThisMonth ?? 0, 50)}
            />
            <ProgressBar
              label="Active users"
              value={overview?.totalUsers ?? 0}
              max={Math.max(overview?.totalUsers ?? 0, 100)}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* pending listings */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-stone-900 dark:text-stone-100">
                  Moderation Queue
                </p>
                {!pendingLoading && (overview?.pendingListings ?? 0) > 0 && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {overview.pendingListings}
                  </span>
                )}
              </div>
              <Link
                to="/admin/listings"
                className="text-xs font-medium text-teal-700 hover:underline dark:text-teal-400"
              >
                Lihat semua
              </Link>
            </div>
            {pendingLoading ? (
              <div className="space-y-2 p-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800"
                  />
                ))}
              </div>
            ) : pendingListings.length > 0 ? (
              <ul className="divide-y divide-stone-100 dark:divide-stone-800">
                {pendingListings.slice(0, 4).map((l) => (
                  <li key={l.id} className="px-5 py-3">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                      {l.title}
                    </p>
                    <p className="text-xs text-stone-400">
                      {l.location} · {l.owner?.full_name ?? "—"} ·{" "}
                      {formatDate(l.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <Clock className="h-7 w-7 text-stone-300" strokeWidth={1.5} />
                <p className="text-sm text-stone-400">
                  No pending listings.
                </p>
              </div>
            )}
          </div>

          {/* quick nav */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
            <div className="border-b border-stone-100 px-5 py-4 dark:border-stone-800">
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                Quick Navigation
              </p>
            </div>
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {NAV_ITEMS.map(({ to, label, desc }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center justify-between px-5 py-4 transition hover:bg-stone-50 dark:hover:bg-stone-800/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {label}
                      </p>
                      <p className="text-xs text-stone-400">{desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-stone-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageContent>
    </PageShell>
  );
}
