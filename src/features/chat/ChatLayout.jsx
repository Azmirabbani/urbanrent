import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, Search, Trash2, MessageCircle } from "lucide-react";
import {
  useConversations,
  useMessages,
  useSendMessage,
} from "@/features/chat/useChat.js";
import { useAuthContext } from "@/context/AuthContext.jsx";
import { supabase } from "@/lib/supabase.js";
import { formatDate } from "@/lib/formatDate.js";

function formatTime(ts) {
  if (!ts) return "";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

/* ── Chat Panel ── */
function ChatPanel({ conversationId }) {
  const { user } = useAuthContext();
  const { messages, loading } = useMessages(conversationId);
  const { send, sending } = useSendMessage();
  const [input, setInput] = useState("");
  const [convInfo, setConvInfo] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!supabase || !conversationId) return;
    supabase
      .from("conversations")
      .select("id, tenant_id, owner_id, listing:listing_id(id, title)")
      .eq("id", conversationId)
      .single()
      .then(async ({ data }) => {
        if (!data) return;
        const otherId =
          data.tenant_id === user?.id ? data.owner_id : data.tenant_id;
        const { data: profile } = await supabase
          .from("users")
          .select("id, full_name, email")
          .eq("id", otherId)
          .single();
        setConvInfo({ ...data, otherUser: profile });
      });
  }, [conversationId, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const text = input;
    setInput("");
    await send(conversationId, text);
    inputRef.current?.focus();
  }

  const grouped = messages.reduce((acc, msg) => {
    const date = formatDate(msg.created_at);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  if (!conversationId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/30">
          <MessageCircle className="h-7 w-7 text-teal-600" strokeWidth={1.5} />
        </div>
        <p className="font-semibold text-stone-700 dark:text-stone-300">
          Pilih percakapan
        </p>
        <p className="max-w-xs text-sm text-stone-400">
          Chat diStarting from halaman detail listing — klik "Chat with Owner".
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* header */}
      <div className="shrink-0 border-b border-stone-200 bg-white px-6 py-4 dark:border-stone-800 dark:bg-stone-950">
        {convInfo ? (
          <div>
            <p className="font-semibold text-stone-900 dark:text-stone-100">
              {convInfo.otherUser?.full_name ??
                convInfo.otherUser?.email ??
                "…"}
            </p>
            {convInfo.listing?.title && (
              <p className="text-xs text-stone-400">
                re: {convInfo.listing.title}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="h-4 w-32 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
            <div className="h-3 w-48 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
          </div>
        )}
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 animate-bounce rounded-full bg-teal-500"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
              No messages yet
            </p>
            <p className="text-xs text-stone-400">
              Send your first message below.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([date, msgs]) => (
              <div key={date}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
                  <span className="text-xs text-stone-400">{date}</span>
                  <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
                </div>
                <div className="space-y-1.5">
                  {msgs.map((msg) => {
                    const isMine = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`group flex max-w-[68%] flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                              isMine
                                ? "rounded-br-sm bg-teal-700 text-white"
                                : "rounded-bl-sm bg-white text-stone-900 shadow-sm ring-1 ring-stone-200 dark:bg-stone-800 dark:text-stone-100 dark:ring-stone-700"
                            }`}
                          >
                            {msg.body}
                          </div>
                          <span className="px-1 text-[10px] text-stone-400 opacity-0 transition-opacity group-hover:opacity-100">
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* input */}
      <div className="shrink-0 border-t border-stone-200 bg-white px-6 py-4 dark:border-stone-800 dark:bg-stone-950">
        <form onSubmit={handleSend} className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Tulis Messages…"
            disabled={sending}
            className="flex-1 resize-none overflow-hidden rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-600 dark:focus:bg-stone-800"
            style={{ minHeight: "42px" }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white transition hover:bg-teal-800 disabled:opacity-40 active:scale-95"
            aria-label="Kirim"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Main Layout ── */
export default function ChatLayout() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { conversations, loading, refetch } = useConversations();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filtered = conversations.filter((c) => {
    const name = c.otherUser?.full_name ?? c.otherUser?.email ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  async function handleDelete(id, e) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;
    setDeletingId(id);
    try {
      await supabase.from("conversations").delete().eq("id", id);
      if (conversationId === id) navigate("/messages");
      refetch();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950 lg:w-80">
        <div className="shrink-0 border-b border-stone-100 px-5 py-4 dark:border-stone-800">
          <h2 className="font-semibold text-stone-900 dark:text-stone-100">
            Messages
          </h2>
          <p className="mt-0.5 text-xs text-stone-400">
            Chat about apartment listings
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-stone-700 dark:bg-stone-900">
            <Search className="h-3.5 w-3.5 shrink-0 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-stone-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-1 p-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-28 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                    <div className="h-2.5 w-20 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <ul className="p-2">
              {filtered.map((conv, i) => {
                const isActive = conv.id === conversationId;
                return (
                  <li
                    key={conv.id}
                    className="group stagger-item"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div
                      className={`flex items-center rounded-xl transition ${isActive ? "bg-teal-50 dark:bg-teal-900/30" : "hover:bg-stone-50 dark:hover:bg-stone-800/60"}`}
                    >
                      <button
                        type="button"
                        onClick={() => navigate(`/messages/${conv.id}`)}
                        className="flex flex-1 items-center gap-3 px-3 py-3 text-left"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${isActive ? "bg-teal-700" : "bg-teal-600"}`}
                        >
                          {conv.otherUser?.full_name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm font-semibold ${isActive ? "text-teal-900 dark:text-teal-200" : "text-stone-900 dark:text-stone-100"}`}
                          >
                            {conv.otherUser?.full_name ??
                              conv.otherUser?.email ??
                              "Pengguna"}
                          </p>
                          {conv.listing?.title ? (
                            <p className="truncate text-xs text-stone-400">
                              re: {conv.listing.title}
                            </p>
                          ) : (
                            <p className="text-xs text-stone-400">
                              {formatDate(conv.created_at)}
                            </p>
                          )}
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(conv.id, e)}
                        disabled={deletingId === conv.id}
                        className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-stone-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 disabled:opacity-30 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <MessageCircle
                className="h-8 w-8 text-stone-300"
                strokeWidth={1.5}
              />
              <p className="text-sm text-stone-400">
                {search ? "Tidak ditemukan" : "Belum ada percakapan"}
              </p>
              {!search && (
                <p className="mt-1 max-w-[180px] text-xs text-stone-400">
                  Start a chat from the listing detail page
                </p>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ── Chat area ── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-stone-950">
        <ChatPanel conversationId={conversationId} />
      </div>
    </div>
  );
}
