import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Plus, Search, X, Trash2 } from "lucide-react";
import { useConversations } from "@/features/chat/useChat.js";
import { useAuthContext } from "@/context/AuthContext.jsx";
import { PageHeader } from "@/components/PageHeader.jsx";
import { formatDate } from "@/lib/formatDate.js";
import { supabase } from "@/lib/supabase.js";

function NewMessageModal({ onClose }) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState(false);

  async function handleSearch(e) {
    const q = e.target.value;
    setQuery(q);
    if (!q.trim() || !supabase) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const { data } = await supabase
        .from("users")
        .select("id, full_name, email, role")
        .neq("id", user?.id)
        .or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
        .limit(8);
      setResults(data ?? []);
    } finally {
      setSearching(false);
    }
  }

  async function startChat(otherUser) {
    if (!supabase || !user) return;
    setStarting(true);
    try {
      // cek existing
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .or(
          `and(tenant_id.eq.${user.id},owner_id.eq.${otherUser.id}),and(tenant_id.eq.${otherUser.id},owner_id.eq.${user.id})`,
        )
        .is("listing_id", null)
        .maybeSingle();

      if (existing) {
        navigate(`/messages/${existing.id}`);
        onClose();
        return;
      }

      // tentukan Tenant/Owner
      const myRole = (
        await supabase.from("users").select("role").eq("id", user.id).single()
      ).data?.role;
      const isOwner = myRole?.toLowerCase() === "owner";

      const { data: created } = await supabase
        .from("conversations")
        .insert({
          tenant_id: isOwner ? otherUser.id : user.id,
          owner_id: isOwner ? user.id : otherUser.id,
          listing_id: null,
        })
        .select("id")
        .single();

      if (created) {
        navigate(`/messages/${created.id}`);
        onClose();
      }
    } finally {
      setStarting(false);
    }
  }

  const roleLabel = {
    Tenant: "Tenant",
    Owner: "Owner",
    tenant: "Tenant",
    owner: "Owner",
    super_admin: "Admin",
  };
  const roleColor = {
    Tenant: "bg-stone-100 text-stone-600",
    Owner: "bg-teal-50 text-teal-700",
    tenant: "bg-stone-100 text-stone-600",
    owner: "bg-teal-50 text-teal-700",
    super_admin: "bg-violet-50 text-violet-700",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 dark:border-stone-800">
          <p className="font-semibold text-stone-900 dark:text-stone-100">
            Messages baru
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* search */}
        <div className="border-b border-stone-100 px-5 py-3 dark:border-stone-800">
          <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-stone-700 dark:bg-stone-800">
            <Search className="h-4 w-4 shrink-0 text-stone-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Cari nama atau email..."
              className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-stone-100"
            />
            {searching && (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
            )}
          </div>
        </div>

        {/* results */}
        <div className="max-h-72 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {results.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    disabled={starting}
                    onClick={() => startChat(u)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-stone-50 disabled:opacity-50 dark:hover:bg-stone-800/60"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                      {u.full_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {u.full_name}
                      </p>
                      <p className="truncate text-xs text-stone-400">
                        {u.email}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${roleColor[u.role] ?? roleColor.tenant}`}
                    >
                      {roleLabel[u.role] ?? u.role}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.trim() ? (
            <div className="py-10 text-center text-sm text-stone-400">
              No users found.
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-stone-400">
              Type a name or email to search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const { conversations, loading, error, refetch } = useConversations();
  const { user } = useAuthContext();
  const [showNew, setShowNew] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(convId, e) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;
    setDeletingId(convId);
    try {
      await supabase.from("conversations").delete().eq("id", convId);
      refetch();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950">
      <div className="border-b border-stone-200 bg-white px-4 py-8 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-3xl page-enter">
          <PageHeader
            eyebrow="Messages"
            icon={MessageCircle}
            title="Messages"
            description="Percakapan dengan Owner atau Tenant."
            actions={
              <button
                type="button"
                onClick={() => setShowNew(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Messages baru
              </button>
            }
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-32 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                    <div className="h-3 w-48 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length > 0 ? (
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {conversations.map((conv, i) => {
                const other = conv.otherUser;
                return (
                  <li
                    key={conv.id}
                    className="stagger-item group flex items-center"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <Link
                      to={`/messages/${conv.id}`}
                      className="flex flex-1 items-center gap-4 px-5 py-4 transition hover:bg-stone-50 dark:hover:bg-stone-800/60"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-700 text-base font-bold text-white">
                        {conv.otherUser?.full_name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-semibold text-stone-900 dark:text-stone-100">
                            {conv.otherUser?.full_name ??
                              conv.otherUser?.email ??
                              "Pengguna"}
                          </p>
                          <span className="shrink-0 text-xs text-stone-400">
                            {formatDate(conv.created_at)}
                          </span>
                        </div>
                        {conv.listing?.title && (
                          <p className="mt-0.5 truncate text-sm text-stone-500 dark:text-stone-400">
                            re: {conv.listing.title}
                          </p>
                        )}
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(conv.id, e)}
                      disabled={deletingId === conv.id}
                      className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 disabled:opacity-50 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/30">
                <MessageCircle
                  className="h-7 w-7 text-teal-600"
                  strokeWidth={1.5}
                />
              </div>
              <p className="font-semibold text-stone-700 dark:text-stone-300">
                No messages yet
              </p>
              <p className="text-sm text-stone-400">
                Klik "New Message" untuk mulai percakapan.
              </p>
              <button
                type="button"
                onClick={() => setShowNew(true)}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                <Plus className="h-4 w-4" />
                Messages baru
              </button>
            </div>
          )}
        </div>
      </div>

      {showNew && <NewMessageModal onClose={() => setShowNew(false)} />}
    </div>
  );
}
