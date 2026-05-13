import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

export default function SigninPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = location.state?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseOrThrow();
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signErr) {
        setError(signErr.message);
        return;
      }

      toast({ title: "Welcome back", variant: "success" });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell variant="signin">
      <Card className="overflow-hidden border-stone-200 shadow-xl dark:border-stone-700 dark:bg-stone-900">
        <CardHeader className="border-b border-stone-100 bg-stone-50 pb-6 dark:border-stone-800 dark:bg-stone-900">
          <CardTitle className="text-xl dark:text-white">Sign In</CardTitle>
          <CardDescription className="dark:text-stone-400">
            Use your email and account password.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 dark:bg-stone-900">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
                placeholder="nama@email.com"
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
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
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
              {loading ? "Processing…" : "Sign In"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
            <Link
              to="/forgot-password"
              className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
            >
              Forgot password?
            </Link>
            <span
              className="mx-2 text-stone-300 dark:text-stone-600"
              aria-hidden
            >
              ·
            </span>
            <Link
              to="/signup"
              className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
            >
              Daftar
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
