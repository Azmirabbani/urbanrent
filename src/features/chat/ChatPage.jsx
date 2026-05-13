import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, ChevronLeft, MessageCircle } from "lucide-react";
import { useMessages, useSendMessage } from "@/features/chat/useChat.js";
import { useAuthContext } from "@/context/AuthContext.jsx";
import { formatDate } from "@/lib/formatDate.js";
import { supabase } from "@/lib/supabase.js";

function formatTime(ts) {
  if (!ts) return "";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export default function ChatPage() {
  const { conversationId } = useParams();
  const { user } = useAuthContext();
  const { messages, loading } = useMessages(conversationId);
  const { send, sending } = useSendMessage();
  const [input, setInput] = useState("");
  const [convInfo, setConvInfo] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // load conversation info + nama user lain
  useEffect(() => {
    if (!supabase || !conversationId) return;
    supabase
      .from("conversations")
      .select("id, tenant_id, owner_id, listing:listing_id(id, title)")
      .eq("id", conversationId)
      .single()
      .then(async ({ data }) => {
        if (!data) return;
        // fetch nama kedua user
        const otherId =
          data.tenant_id === user?.id ? data.owner_id : data.tenant_id;
        const { data: otherProfile } = await supabase
          .from("users")
          .select("id, full_name, email")
          .eq("id", otherId)
          .single();
        setConvInfo({
          ...data,
          otherUser: otherProfile,
        });
      });
  }, [conversationId, user?.id]);

  // scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const otherUser = convInfo?.otherUser ?? null;

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const text = input;
    setInput("");
    await send(conversationId, text);
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  }

  // group messages by date
  const grouped = messages.reduce((acc, msg) => {
    const date = formatDate(msg.created_at);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-stone-950">
      {/* header */}
      <div className="shrink-0 border-b border-stone-200 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link
            to="/messages"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
            {otherUser?.full_name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-stone-900 dark:text-stone-100">
              {otherUser?.full_name ?? "…"}
            </p>
            {convInfo?.listing?.title && (
              <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                re: {convInfo.listing.title}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
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
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/30">
                <MessageCircle
                  className="h-7 w-7 text-teal-600"
                  strokeWidth={1.5}
                />
              </div>
              <p className="font-semibold text-stone-700 dark:text-stone-300">
                Mulai percakapan
              </p>
              <p className="text-sm text-stone-400">
                Kirim Messages pertama ke {otherUser?.full_name ?? "pengguna ini"}.
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([date, msgs]) => (
              <div key={date}>
                {/* date separator */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                    {date}
                  </span>
                  <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                </div>

                <div className="space-y-2">
                  {msgs.map((msg) => {
                    const isMine = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`group flex max-w-[75%] flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}
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
                          <span className="text-[10px] text-stone-400 opacity-0 transition group-hover:opacity-100">
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* input */}
      <div className="shrink-0 border-t border-stone-200 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-950">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-3xl items-end gap-3"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // auto resize
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Write a message… (Enter to send)"
            disabled={sending}
            className="flex-1 resize-none overflow-hidden rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-600"
            style={{ minHeight: "42px" }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white shadow-md transition hover:bg-teal-800 disabled:opacity-40 active:scale-95"
            aria-label="Kirim"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
