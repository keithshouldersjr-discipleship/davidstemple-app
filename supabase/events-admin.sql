-- Adds event flyer support and admin write policies for communications.
-- Run this in the Supabase SQL Editor after member-directory.sql.

alter table public.events
add column if not exists flyer_url text;

alter table public.events
add column if not exists ministry text;

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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.event_requests enable row level security;

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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-flyers',
  'event-flyers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view event flyers" on storage.objects;
create policy "Public can view event flyers"
on storage.objects
for select
to public
using (bucket_id = 'event-flyers');

drop policy if exists "Admins can upload event flyers" on storage.objects;
create policy "Admins can upload event flyers"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'event-flyers'
  and public.is_events_admin()
);

drop policy if exists "Admins can update event flyers" on storage.objects;
create policy "Admins can update event flyers"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'event-flyers'
  and public.is_events_admin()
)
with check (
  bucket_id = 'event-flyers'
  and public.is_events_admin()
);

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

drop policy if exists "Anyone can submit event requests" on public.event_requests;
create policy "Anyone can submit event requests"
on public.event_requests
for insert
to anon, authenticated
with check (status = 'pending');

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
