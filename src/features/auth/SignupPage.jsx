import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card.jsx";
import { Input } from "@/components/ui/Input.jsx";
import { PasswordInput } from "@/components/ui/PasswordInput.jsx";
import { AuthShell } from "@/components/AuthShell.jsx";
import { getSupabaseOrThrow } from "@/lib/supabase.js";
import { useToast } from "@/context/ToastContext.jsx";
import { cn } from "@/lib/utils.js";

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseOrThrow();
      const { data, error: signErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName.trim(),
            role,
          },
        },
      });

      if (signErr) {
        setError(signErr.message);
        return;
      }

      if (data.session) {
        toast({
          title: "Account created",
          description: "Welcome to UrbanRent.",
          variant: "success",
        });
        navigate("/", { replace: true });
        return;
      }

      toast({
        title: "Almost done",
        description:
          "Cek email untuk verifikasi (dan folder spam), lalu masuk dengan email kamu.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell variant="signup">
      <Card className="overflow-hidden border-stone-200 shadow-xl dark:border-stone-700 dark:bg-stone-900">
        <CardHeader className="border-b border-stone-100 bg-stone-50 pb-6 dark:border-stone-800 dark:bg-stone-900">
          <CardTitle className="text-xl dark:text-white">Sign Up</CardTitle>
          <CardDescription className="dark:text-stone-400">
            Choose your role and fill in your details.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 dark:bg-stone-900">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-stone-800 dark:text-stone-200"
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
              <label
                className="text-sm font-medium text-stone-800 dark:text-stone-200"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-stone-800 dark:text-stone-200"
                htmlFor="password"
              >
                Kata sandi
              </label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <span className="text-sm font-medium text-stone-800 dark:text-stone-200">
                Peran
              </span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "tenant", title: "Tenant", hint: "Cari & booking" },
                  { id: "owner", title: "Owner", hint: "Kelola properti" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer flex-col rounded-xl border-2 p-3 transition",
                      role === opt.id
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-500"
                        : "border-stone-200 bg-white hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700",
                    )}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={opt.id}
                      checked={role === opt.id}
                      onChange={() => setRole(opt.id)}
                      disabled={loading}
                      className="sr-only"
                    />
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {opt.title}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      {opt.hint}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {error && (
              <p
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-800"
                role="alert"
              >
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing…" : "Create Account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
            >
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
