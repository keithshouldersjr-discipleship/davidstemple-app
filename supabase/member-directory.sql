-- Admin church directory foundation.
-- Run this in the Supabase SQL Editor.
-- After running it, add your own email to public.admin_users.

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.member_profiles (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  first_name text not null,
  last_name text not null,
  birthday_month_day text,
  phone text,
  email text,
  spouse_name text,
  children text[] not null default '{}',
  ministry_interests text[] not null default '{}',
  deacon_group text,
  status text not null default 'active' check (status in ('active', 'inactive', 'deceased')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.member_profiles
add column if not exists external_id text;

create unique index if not exists member_profiles_external_id_key
on public.member_profiles (external_id)
where external_id is not null;

alter table public.admin_users enable row level security;
alter table public.member_profiles enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admins can read member profiles" on public.member_profiles;
create policy "Admins can read member profiles"
on public.member_profiles
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admins can insert member profiles" on public.member_profiles;
create policy "Admins can insert member profiles"
on public.member_profiles
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admins can update member profiles" on public.member_profiles;
create policy "Admins can update member profiles"
on public.member_profiles
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

-- Replace this email with your Supabase Auth user email before running,
-- or run a separate insert after the tables are created.
-- insert into public.admin_users (email, role)
-- values ('your-email@example.com', 'owner')
-- on conflict (email) do update set role = excluded.role;

-- Google Sheets / CSV import column pattern:
-- first_name,last_name,birthday_month_day,phone,email,spouse_name,children,ministry_interests,deacon_group,status,notes
--
-- Use MM-DD for birthday_month_day so the directory never stores birth years.
-- Use comma-separated text for children and ministry_interests before converting to text[].
