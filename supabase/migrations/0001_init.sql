-- Book Reading Log — schema
-- Safe to run more than once.

create extension if not exists "pgcrypto";

create table if not exists public.book_reading_log_books (
  id uuid primary key default gen_random_uuid(),
  title text,
  author text,
  pages_read integer,
  rating integer,
  finished_on date,
  created_at timestamptz not null default now()
);

create index if not exists book_reading_log_books_created_idx on public.book_reading_log_books (created_at desc);

alter table public.book_reading_log_books enable row level security;

drop policy if exists "book_reading_log_books_read" on public.book_reading_log_books;
create policy "book_reading_log_books_read" on public.book_reading_log_books for select using (true);

drop policy if exists "book_reading_log_books_insert" on public.book_reading_log_books;
create policy "book_reading_log_books_insert" on public.book_reading_log_books for insert with check (true);
