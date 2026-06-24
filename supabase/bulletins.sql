-- Weekly bulletin publishing.
-- Run this in the Supabase SQL Editor after member-directory.sql.

create table if not exists public.bulletin_issues (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  content jsonb not null,
  is_published boolean not null default true,
  published_at timestamptz,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bulletin_issues enable row level security;

create or replace function public.is_bulletin_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select
    lower(auth.jwt() ->> 'email') = 'keithshouldersjr@gmail.com';
$$;

drop policy if exists "Public can read published bulletin issues" on public.bulletin_issues;
create policy "Public can read published bulletin issues"
on public.bulletin_issues
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Bulletin admins can insert bulletin issues" on public.bulletin_issues;
create policy "Bulletin admins can insert bulletin issues"
on public.bulletin_issues
for insert
to authenticated
with check (public.is_bulletin_admin());

drop policy if exists "Bulletin admins can update bulletin issues" on public.bulletin_issues;
create policy "Bulletin admins can update bulletin issues"
on public.bulletin_issues
for update
to authenticated
using (public.is_bulletin_admin())
with check (public.is_bulletin_admin());
