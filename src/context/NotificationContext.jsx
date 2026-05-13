import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase.js";
import { useAuthContext } from "@/context/AuthContext.jsx";
import { useToast } from "@/context/ToastContext.jsx";

const NotificationContext = createContext({
  unreadCount: 0,
  refetch: () => {},
});

export function NotificationProvider({ children }) {
  const { user, role, loading: authLoading } = useAuthContext();
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    if (!supabase || !user || authLoading) return;
    try {
      if (role === "owner") {
        const { data: myListings } = await supabase
          .from("listings")
          .select("id")
          .eq("owner_id", user.id);
        if (!myListings?.length) {
          setUnreadCount(0);
          return;
        }
        const { count } = await supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .in(
            "listing_id",
            myListings.map((l) => l.id),
          )
          .eq("status", "pending");
        setUnreadCount(count ?? 0);
      } else if (role === "tenant") {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count } = await supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", user.id)
          .in("status", ["confirmed", "cancelled"])
          .gte("updated_at", since);
        setUnreadCount(count ?? 0);
      }
    } catch {
      /* silent */
    }
  }, [user, role, authLoading]);

  useEffect(() => {
    if (!supabase || !user || authLoading) return;

    fetchUnread();

    const channel = supabase
      .channel(`notif-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        async (payload) => {
          try {
            const b = payload.new ?? payload.old;
            if (!b) return;

            if (
              role === "owner" &&
              payload.eventType === "INSERT" &&
              b.status === "pending"
            ) {
              const { data: listing } = await supabase
                .from("listings")
                .select("owner_id, title")
                .eq("id", b.listing_id)
                .single();
              if (listing?.owner_id === user.id) {
                toast({
                  title: "📬 Booking baru masuk",
                  description: `Tenant mengSubmit booking untuk ${listing.title}`,
                });
                setUnreadCount((c) => c + 1);
              }
            } else if (
              role === "tenant" &&
              b.tenant_id === user.id &&
              payload.eventType === "UPDATE"
            ) {
              if (b.status === "confirmed") {
                toast({
                  title: "✅ Booking confirmed",
                  description: "Owner telah menyetujui booking kamu.",
                  variant: "success",
                });
                setUnreadCount((c) => c + 1);
              } else if (b.status === "cancelled") {
                toast({
                  title: "❌ Booking rejected",
                  description: "Owner menolak permintaan booking kamu.",
                  variant: "destructive",
                });
              }
            }
          } catch {
            /* silent */
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, role, authLoading, toast, fetchUnread]);

  // reset count when user logs out
  useEffect(() => {
    if (!user) setUnreadCount(0);
  }, [user]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refetch: fetchUnread }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
