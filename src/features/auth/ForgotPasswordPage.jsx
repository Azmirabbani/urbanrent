import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import { Input } from '@/components/ui/Input.jsx'
import { AuthShell } from '@/components/AuthShell.jsx'
import { getSupabaseOrThrow } from '@/lib/supabase.js'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (!email.trim()) {
      setError('Please enter your email.')
      return
    }

    setLoading(true)
    try {
      const supabase = getSupabaseOrThrow()
      const redirectTo = `${window.location.origin}/signin`
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      })

      if (resetErr) {
        setError(resetErr.message)
        return
      }

      setInfo('Jika email terdaftar, link reset akan dikirim. Cek inbox (dan spam).')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell variant="recover">
      <Card className="overflow-hidden border-stone-200/90 shadow-xl shadow-stone-900/7 dark:bg-stone-900 dark:border-stone-700 ring-1 ring-stone-900/4">
        <CardHeader className="border-b border-stone-100 bg-linear-to-br from-white to-amber-50/30 pb-6">
          <CardTitle className="text-xl">Reset kata sandi</CardTitle>
          <CardDescription>Kami kirim tautan aman ke email yang terdaftar.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-800" htmlFor="email">
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

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100" role="alert">
                {error}
              </p>
            )}
            {info && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100/80" role="status">
                {info}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Mengirim…' : 'Kirim link'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-600">
            <Link to="/signin" className="font-medium text-teal-800 underline-offset-2 hover:underline">
              Kembali ke masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  )
}

