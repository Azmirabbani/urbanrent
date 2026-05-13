import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-stone-100 text-stone-400">
        <Compass className="h-10 w-10" strokeWidth={1.5} aria-hidden />
      </div>
      <div>
        <p className="text-6xl font-bold text-stone-200">404</p>
        <h1 className="mt-2 text-xl font-semibold text-stone-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          The page you are looking for does not exist.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex h-10 items-center justify-center rounded-lg bg-teal-800 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-teal-900 active:scale-[0.98]"
      >
        Back to home
      </Link>
    </div>
  );
}
