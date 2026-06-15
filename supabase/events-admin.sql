-- Adds event leader contacts and admin write policies for communications.
-- Run this in the Supabase SQL Editor after member-directory.sql.

alter table public.events
add column if not exists ministry text;

alter table public.events
add column if not exists leader_name text;

alter table public.events
add column if not exists leader_email text;

alter table public.events
add column if not exists leader_phone text;

alter table public.events
add column if not exists support_needed text[] not null default '{}';

create table if not exists public.event_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  time text,
  ministry text,
  location text,
  description text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_event_id text,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.event_requests
add column if not exists approved_by text;

alter table public.event_requests
add column if not exists approved_at timestamptz;

create table if not exists public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  preferred_contact text,
  interest_area text not null,
  source_type text not null default 'general',
  source_title text not null,
  source_id text,
  support_needed text[] not null default '{}',
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.event_requests enable row level security;
alter table public.connection_requests enable row level security;

create or replace function public.current_directory_role()
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (
      select role
      from public.admin_users
      where lower(email) = lower(auth.jwt() ->> 'email')
      limit 1
    ),
    'none'
  );
$$;

create or replace function public.can_manage_directory()
returns boolean
language sql
security definer
set search_path = public
as $$
  select public.current_directory_role() in ('owner', 'admin');
$$;

create or replace function public.is_events_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select
    lower(auth.jwt() ->> 'email') in (
      'keithshouldersjr@gmail.com',
      'jonesmi411@yahoo.com',
      'karomc1987@gmail.com'
    )
    or exists (
      select 1
      from public.admin_users
      where lower(email) = lower(auth.jwt() ->> 'email')
        and role in ('owner', 'admin')
    );
$$;

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events"
on public.events
for select
to public
using (true);

drop policy if exists "Admins can insert events" on public.events;
create policy "Admins can insert events"
on public.events
for insert
to authenticated
with check (public.is_events_admin());

drop policy if exists "Admins can update events" on public.events;
create policy "Admins can update events"
on public.events
for update
to authenticated
using (public.is_events_admin())
with check (public.is_events_admin());

drop policy if exists "Admins can delete events" on public.events;
create policy "Admins can delete events"
on public.events
for delete
to authenticated
using (public.is_events_admin());

drop policy if exists "Anyone can submit event requests" on public.event_requests;
create policy "Anyone can submit event requests"
on public.event_requests
for insert
to anon, authenticated
with check (status = 'pending');

drop policy if exists "Anyone can submit connection requests" on public.connection_requests;
create policy "Anyone can submit connection requests"
on public.connection_requests
for insert
to anon, authenticated
with check (status = 'new');

drop policy if exists "Admins can read event requests" on public.event_requests;
create policy "Admins can read event requests"
on public.event_requests
for select
to authenticated
using (public.is_events_admin());

drop policy if exists "Admins can update event requests" on public.event_requests;
create policy "Admins can update event requests"
on public.event_requests
for update
to authenticated
using (public.is_events_admin())
with check (public.is_events_admin());

drop policy if exists "Admins can read connection requests" on public.connection_requests;
create policy "Admins can read connection requests"
on public.connection_requests
for select
to authenticated
using (public.is_events_admin());

drop policy if exists "Admins can update connection requests" on public.connection_requests;
create policy "Admins can update connection requests"
on public.connection_requests
for update
to authenticated
using (public.is_events_admin())
with check (public.is_events_admin());
