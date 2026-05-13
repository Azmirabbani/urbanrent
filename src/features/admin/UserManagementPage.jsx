import { Users, ShieldOff, ShieldCheck } from "lucide-react";
import { PageShell, PageBand, PageContent } from "@/components/PageShell.jsx";
import { useAdminUsers } from "@/features/admin/useAdmin.js";
import { Button } from "@/components/ui/Button.jsx";
import { formatDate } from "@/lib/formatDate.js";
import { useToast } from "@/context/ToastContext.jsx";
import { useState } from "react";
import { cn } from "@/lib/utils.js";

const roleLabel = {
  Tenant: "Tenant",
  Owner: "Owner",
  tenant: "Tenant",
  owner: "Owner",
  super_admin: "Admin",
};
const roleStyle = {
  Tenant: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  Owner: "bg-teal-50 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  tenant: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  owner: "bg-teal-50 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  super_admin:
    "bg-violet-50 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
};

export default function UserManagementPage() {
  const { users, loading, error, toggleBan } = useAdminUsers();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState(null);

  async function handleToggleBan(userId, currentBanned) {
    setProcessingId(userId);
    try {
      await toggleBan(userId, !currentBanned);
      toast({
        title: currentBanned ? "User unbanned" : "User banned",
        variant: currentBanned ? "success" : "default",
      });
    } catch (err) {
      toast({
        title: "Failed to update",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <PageShell>
      <PageBand
        eyebrow="Admin"
        title="User Management"
        description="Ban/unban dan lihat semua pengguna platform."
      />

      <PageContent>
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl bg-stone-100 dark:bg-stone-800"
                />
              ))}
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 dark:border-stone-800 dark:text-stone-500">
                    <th className="px-5 py-3">Nama</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Peran</th>
                    <th className="px-5 py-3">Bergabung</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className={cn(
                        "transition hover:bg-stone-50 dark:hover:bg-stone-800/50",
                        u.is_banned && "opacity-60",
                      )}
                    >
                      <td className="px-5 py-3 font-medium text-stone-900 dark:text-stone-100">
                        {u.full_name ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-stone-500 dark:text-stone-400">
                        {u.email}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            roleStyle[u.role] ?? roleStyle.tenant,
                          )}
                        >
                          {roleLabel[u.role] ?? u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-stone-500 dark:text-stone-400">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              u.is_banned ? "bg-red-400" : "bg-teal-500",
                            )}
                          />
                          <span
                            className={cn(
                              "text-xs font-semibold",
                              u.is_banned
                                ? "text-red-600 dark:text-red-400"
                                : "text-teal-700 dark:text-teal-400",
                            )}
                          >
                            {u.is_banned ? "Banned" : "Active"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className={
                            u.is_banned
                              ? "text-teal-700 hover:bg-teal-50 dark:text-teal-400"
                              : "text-red-600 hover:bg-red-50 dark:text-red-400"
                          }
                          disabled={processingId === u.id}
                          onClick={() => handleToggleBan(u.id, u.is_banned)}
                        >
                          {u.is_banned ? (
                            <>
                              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                              Unban
                            </>
                          ) : (
                            <>
                              <ShieldOff className="mr-1 h-3.5 w-3.5" />
                              Ban
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800">
                <Users className="h-7 w-7 text-stone-400" strokeWidth={1.5} />
              </div>
              <p className="font-semibold text-stone-700 dark:text-stone-300">
                Belum ada pengguna
              </p>
            </div>
          )}
        </div>
      </PageContent>
    </PageShell>
  );
}
