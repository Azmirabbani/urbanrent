import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase.js";

export const AuthContext = createContext(null);

/** @typedef {'tenant' | 'owner' | 'super_admin'} UserRole */

/**
 * Baca role langsung dari user_metadata (di-set saat signup).
 * Normalisasi ke huruf kecil — signup pernah menyimpan "Owner"/"Tenant".
 */
function resolveRole(user) {
  const meta = user?.user_metadata ?? {};
  const r = meta.role;
  if (typeof r !== "string") return "tenant";
  const lower = r.toLowerCase();
  if (lower === "owner" || lower === "super_admin" || lower === "tenant")
    return lower;
  return "tenant";
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (mounted) {
        setSession(s ?? null);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;
  const role = useMemo(() => resolveRole(user), [user]);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      role,
      loading,
      signOut,
      supabaseReady: Boolean(supabase),
    }),
    [session, user, role, loading, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext harus dipakai di dalam AuthProvider");
  }
  return ctx;
}
