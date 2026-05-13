# UrbanRent

Platform sewa apartemen jangka pendek (React + Vite + Supabase): explore listing, booking, chat, dan dashboard owner.

## Prasyarat

- Node.js 20+ (disarankan)
- Akun [Supabase](https://supabase.com) dan project dengan skema `users`, `listings`, `bookings`, `conversations`, `messages` (sesuai app)

## Setup lokal

```bash
npm install
cp .env.example .env   # di Windows: copy .env.example .env
```

Isi `.env` dengan **Project URL** dan **anon key** dari Supabase → *Settings* → *API*:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

```bash
npm run dev
```

Buka URL yang ditampilkan di terminal (biasanya `http://localhost:5173`).

## Scripts

| Perintah        | Keterangan              |
|----------------|-------------------------|
| `npm run dev`   | Development server      |
| `npm run build` | Build production ke `dist/` |
| `npm run preview` | Preview hasil build   |

## Catatan

- Jangan commit file `.env` — gunakan `.env.example` sebagai template.
- `node_modules` dan `dist` sudah di-ignore oleh Git.
