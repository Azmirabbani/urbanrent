import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase.js";

/** Ambil semua conversations milik user yang login, dengan nama lawan bicara. */
export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Belum login.");

      const { data: convs, error: convErr } = await supabase
        .from("conversations")
        .select(
          "id, created_at, listing_id, tenant_id, owner_id, listing:listing_id(id, title)",
        )
        .or(`tenant_id.eq.${user.id},owner_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      if (convErr) throw convErr;

      if (!convs?.length) {
        setConversations([]);
        return;
      }

      const otherIds = [
        ...new Set(
          convs.map((c) =>
            c.tenant_id === user.id ? c.owner_id : c.tenant_id,
          ),
        ),
      ];
      const { data: profiles } = await supabase
        .from("users")
        .select("id, full_name, email")
        .in("id", otherIds);
      const profileMap = Object.fromEntries(
        (profiles ?? []).map((p) => [p.id, p]),
      );

      setConversations(
        convs.map((c) => ({
          ...c,
          otherUser:
            profileMap[c.tenant_id === user.id ? c.owner_id : c.tenant_id] ??
            null,
        })),
      );
    } catch (err) {
      setError(err?.message ?? "Gagal memuat percakapan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return { conversations, loading, error, refetch: fetch };
}

/** Ambil messages dalam satu conversation + realtime subscription. */
export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!supabase || !conversationId) {
      setLoading(false);
      return;
    }

    // fetch awal
    setLoading(true);
    supabase
      .from("messages")
      .select("id, body, created_at, sender_id")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data, error: fetchErr }) => {
        if (fetchErr) setError(fetchErr.message);
        else setMessages(data ?? []);
        setLoading(false);
      });

    // cleanup channel lama sebelum subscribe baru
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // realtime
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.find((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId]); // hanya conversationId, tidak fetchMessages

  return { messages, loading, error };
}

/** Kirim pesan. */
export function useSendMessage() {
  const [sending, setSending] = useState(false);

  const send = useCallback(async (conversationId, body) => {
    if (!supabase || !body.trim()) return;
    setSending(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Belum login.");
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        body: body.trim(),
      });
      if (error) throw error;
    } finally {
      setSending(false);
    }
  }, []);

  return { send, sending };
}
