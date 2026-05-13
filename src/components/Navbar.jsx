import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { useTheme } from "@/context/ThemeContext.jsx";
import { Button } from "@/components/ui/Button.jsx";
import logo from "@/assets/urbanrentlogo-removebg-preview.png";

const linkClass = ({ isActive }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
    isActive
      ? "bg-teal-50 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300"
      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100",
  ].join(" ");

function NavLinks({ onNavigate, horizontal }) {
  const { user, role } = useAuthContext();

  const wrapCls = horizontal
    ? "flex flex-wrap items-center gap-1"
    : "flex flex-col gap-1 border-t border-stone-100 pt-4";

  return (
    <nav className={wrapCls}>
      <NavLink to="/explore" className={linkClass} onClick={onNavigate}>
        Explore
      </NavLink>

      {user && role === "tenant" && (
        <>
          <NavLink to="/my-bookings" className={linkClass} onClick={onNavigate}>
            My Bookings
          </NavLink>
          <NavLink to="/favorites" className={linkClass} onClick={onNavigate}>
            Favorites
          </NavLink>
        </>
      )}

      {user && role === "owner" && (
        <>
          <NavLink
            to="/Owner/dashboard"
            className={linkClass}
            onClick={onNavigate}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/Owner/listings"
            className={linkClass}
            onClick={onNavigate}
          >
            Properties
          </NavLink>
          <NavLink
            to="/Owner/bookings"
            className={linkClass}
            onClick={onNavigate}
          >
            Incoming Bookings
          </NavLink>
        </>
      )}

      {user && role === "super_admin" && (
        <NavLink to="/admin" className={linkClass} onClick={onNavigate}>
          Admin
        </NavLink>
      )}

      {user ? (
        <>
          <NavLink to="/messages" className={linkClass} onClick={onNavigate}>
            Messages
          </NavLink>
          <NavLink to="/profile" className={linkClass} onClick={onNavigate}>
            Profile
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/signin" className={linkClass} onClick={onNavigate}>
            Sign In
          </NavLink>
          <NavLink
            to="/signup"
            onClick={onNavigate}
            className={({ isActive }) =>
              isActive
                ? "inline-flex h-9 items-center justify-center rounded-md bg-teal-800 px-3 text-sm font-medium text-white ring-2 ring-teal-200 transition active:scale-[0.98]"
                : "inline-flex h-9 items-center justify-center rounded-md bg-teal-800 px-3 text-sm font-medium text-white transition hover:bg-teal-900 active:scale-[0.98]"
            }
          >
            Sign Up
          </NavLink>
        </>
      )}
    </nav>
  );
}

export function Navbar() {
  const { user, signOut } = useAuthContext();
  const { toast } = useToast();
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    toast({
      title: "Signed out",
      description: "See you next time.",
      variant: "success",
    });
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b border-stone-200 bg-white transition-shadow dark:border-stone-800 dark:bg-stone-950 ${scrolled ? "navbar-scrolled" : ""}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 transition active:scale-[0.98]"
        >
          <img src={logo} alt="UrbanRent" className="h-8 w-8 object-contain" />
          <span className="text-lg font-bold tracking-tight text-stone-950 transition hover:text-teal-700 dark:text-white">
            UrbanRent
          </span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-1.5">
          <NavLinks horizontal />
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="transition active:scale-[0.98]"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : null}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:bg-stone-50 active:scale-95"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav"
            className="fixed inset-x-0 top-[57px] z-50 border-b border-stone-200 bg-white px-4 pb-6 pt-2 shadow-xl dark:border-stone-800 dark:bg-stone-950 md:hidden"
          >
            <NavLinks onNavigate={() => setOpen(false)} />
            <div className="mt-4 border-t border-stone-100 pt-4 dark:border-stone-800">
              <button
                type="button"
                onClick={toggle}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-stone-200 bg-stone-50 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                {dark ? (
                  <Sun className="h-4 w-4 shrink-0" />
                ) : (
                  <Moon className="h-4 w-4 shrink-0" />
                )}
                {dark ? "Mode terang" : "Mode gelap"}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
