import { TrendingUp } from "lucide-react";
import {
  PageShell,
  PageBand,
  PageContent,
  ProgressBar,
} from "@/components/PageShell.jsx";
import { useOwnerStats } from "@/features/owner/useOwner.js";
import { formatCurrency } from "@/lib/formatCurrency.js";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const DUMMY = [
  0, 0, 0, 0, 0, 0, 320000, 550000, 420000, 780000, 650000, 900000,
];
const maxVal = Math.max(...DUMMY, 1);

export default function EarningsPage() {
  const { stats, loading } = useOwnerStats();

  return (
    <PageShell>
      <PageBand
        eyebrow="Owner"
        title="Pendapatan"
        description="Ringkasan pendapatan dari booking terkonfirmasi."
      />

      <PageContent>
        {/* summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Bulan ini",
              value: loading
                ? "…"
                : formatCurrency(stats?.earningsThisMonth ?? 0),
              dark: true,
            },
            {
              label: "Active Bookings",
              value: loading ? "…" : (stats?.activeBookings ?? 0),
              dark: false,
            },
            {
              label: "Total Listings",
              value: loading ? "…" : (stats?.totalListings ?? 0),
              dark: false,
            },
          ].map(({ label, value, dark }) => (
            <div
              key={label}
              className={`rounded-2xl border p-5 ${dark ? "border-teal-800 bg-teal-900" : "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"}`}
            >
              <p
                className={`text-xs font-medium ${dark ? "text-teal-400" : "text-stone-500 dark:text-stone-400"}`}
              >
                {label}
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${dark ? "text-white" : "text-stone-900 dark:text-white"}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* bar chart */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="font-semibold text-stone-900 dark:text-stone-100">
              Monthly Revenue
            </p>
          </div>
          <p className="mt-0.5 text-xs text-stone-400">
            Estimated from confirmed bookings
          </p>
          <div
            className="mt-6 flex items-end gap-2"
            style={{ height: "140px" }}
          >
            {DUMMY.map((val, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <div
                  className={`w-full rounded-t-lg transition-all ${val > 0 ? "bg-teal-600 hover:bg-teal-500" : "bg-stone-100 dark:bg-stone-800"}`}
                  style={{
                    height: `${(val / maxVal) * 110}px`,
                    minHeight: val > 0 ? "4px" : "2px",
                  }}
                />
                <span className="text-[9px] text-stone-400">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* progress indicators */}
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Performance
          </p>
          <h2 className="mt-1 font-semibold text-stone-900 dark:text-stone-100">
            Business Indicators
          </h2>
          <div className="mt-5 space-y-4">
            <ProgressBar
              label="Booking confirmation rate"
              value={stats?.activeBookings ?? 0}
              max={Math.max(
                (stats?.activeBookings ?? 0) + (stats?.pendingBookings ?? 0),
                1,
              )}
            />
            <ProgressBar
              label="Active listings from total"
              value={stats?.totalListings ?? 0}
              max={Math.max(stats?.totalListings ?? 0, 10)}
            />
          </div>
        </div>
      </PageContent>
    </PageShell>
  );
}
