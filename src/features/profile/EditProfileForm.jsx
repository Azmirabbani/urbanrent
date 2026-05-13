import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { supabase } from "@/lib/supabase.js";
import { useAuthContext } from "@/context/AuthContext.jsx";

/** Sinkron dengan AuthContext — untuk insert baris pertama di public.users */
function roleFromMetadata(user) {
  const r = user?.user_metadata?.role;
  if (typeof r !== "string") return "tenant";
  const lower = r.toLowerCase();
  if (lower === "owner" || lower === "super_admin" || lower === "tenant")
    return lower;
  return "tenant";
}

export function EditProfileForm() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user || !supabase) {
      setFetching(false);
      return;
    }
    supabase
      .from("users")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name ?? "");
          setPhone(data.phone ?? "");
        } else {
          setFullName(user.user_metadata?.full_name ?? "");
        }
        setFetching(false);
      });
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!supabase || !user) return;
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const patch = {
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        updated_at: now,
      };

      const { data: existingRow, error: existsErr } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (existsErr) throw existsErr;

      if (existingRow) {
        const { error: updateErr } = await supabase
          .from("users")
          .update(patch)
          .eq("id", user.id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase.from("users").insert({
          id: user.id,
          email: user.email ?? "",
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          role: roleFromMetadata(user),
          updated_at: now,
        });
        if (insertErr) {
          if (
            insertErr.message?.includes("row-level security") ||
            insertErr.code === "42501"
          ) {
            throw new Error(
              "Profil belum terhubung ke akun (baris di database). Tambahkan trigger/auth hook yang menyalin user ke tabel users, atau izinkan INSERT untuk baris dengan id = auth.uid() di RLS.",
            );
          }
          throw insertErr;
        }
      }

      toast({ title: "Profile updated", variant: "success" });
    } catch (err) {
      toast({
        title: "Failed to save",
        description:
          err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 rounded-lg bg-stone-100" />
        <div className="h-10 rounded-lg bg-stone-100" />
        <div className="h-10 rounded-lg bg-stone-100" />
        <div className="h-10 w-32 rounded-lg bg-stone-100" />
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-stone-700"
          htmlFor="full_name"
        >
          Nama lengkap
        </label>
        <Input
          id="full_name"
          name="full_name"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="phone">
          Nomor HP
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="08xxxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
        <p className="text-xs text-stone-400 dark:text-stone-500">
          Used to contact you about bookings.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={user?.email ?? ""}
          disabled
          className="opacity-50"
        />
        <p className="text-xs text-stone-400 dark:text-stone-500">Email cannot be changed.</p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}

