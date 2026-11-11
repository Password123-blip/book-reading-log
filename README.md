# Book Reading Log

**Track pages, not vibes**

Track pages, not vibes.

A full-stack demo built with **Next.js 14 (App Router)**, **Tailwind CSS** and a
**Supabase (Postgres)** backend. Records are written from the browser straight to
Postgres through row-level security policies — no custom API layer to maintain.

Live: https://password123-blip.github.io/book-reading-log/

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14, App Router, TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase Postgres, RLS-secured |
| Hosting | GitHub Pages (static export via GitHub Actions) |

## Run it locally

```bash
npm install
cp .env.example .env.local   # add your Supabase URL + anon key
npm run dev
```

Open http://localhost:3000.

## Set up the database

Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor. It is
idempotent — safe to run more than once. It creates the `book_reading_log_books` table,
enables row-level security and adds read/insert policies for anonymous users.

## Data model

Table: `book_reading_log_books`

| Column | Type |
| --- | --- |
| `title` | text |
| `author` | text |
| `pages_read` | integer |
| `rating` | integer |
| `finished_on` | date |
| `created_at` | timestamptz |

Every row also has `id uuid` and `created_at timestamptz`.

## Deploy

Every push to `main` runs `.github/workflows/deploy-pages.yml`, which builds the
app as a static export and publishes it to GitHub Pages. Set
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as repository
Actions secrets — the workflow passes them into the build.

## What it does

- **Pages and ratings** — The two numbers that actually tell you about your reading.
- **Author index** — See which authors you keep coming back to.
- **Finish dates** — How long a book really took you.

## License

MIT
