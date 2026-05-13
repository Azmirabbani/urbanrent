import { createClient } from '@supabase/supabase-js'

/**
 * Bersihkan nilai dari .env (BOM, spasi, kutip di ujung).
 * @param {unknown} value
 */
function trimEnv(value) {
  if (value == null) return ''
  return String(value)
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^["']|["']$/g, '')
}

/**
 * Supabase butuh **akar project** saja: https://xxxx.supabase.co
 * Tanpa /rest/v1, /auth/v1, atau path lain (kalau ikut ter-paste, auth bisa gagal).
 * @param {string} raw
 */
function toSupabaseRootUrl(raw) {
  const t = trimEnv(raw)
  if (!t) return ''
  try {
    const u = new URL(t)
    return u.origin
  } catch {
    return ''
  }
}

const url = toSupabaseRootUrl(import.meta.env.VITE_SUPABASE_URL)
const anonKey = trimEnv(import.meta.env.VITE_SUPABASE_ANON_KEY)

/**
 * Client Supabase singleton.
 */
export const supabase =
  url && anonKey
    ? createClient(url, anonKey)
    : null

export function getSupabaseOrThrow() {
  if (!supabase) {
    const hint =
      !trimEnv(import.meta.env.VITE_SUPABASE_URL) || !trimEnv(import.meta.env.VITE_SUPABASE_ANON_KEY)
        ? ' Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env lalu restart npm run dev.'
        : ' Cek VITE_SUPABASE_URL: harus seperti https://xxxx.supabase.co (tanpa /rest/v1).'
    throw new Error(
      `Supabase belum dikonfigurasi dengan benar.${hint}`,
    )
  }
  return supabase
}
