-- Adds event flyer support and admin write policies for communications.
-- Run this in the Supabase SQL Editor after member-directory.sql.

alter table public.events
add column if not exists flyer_url text;

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
  and exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
      and role in ('owner', 'admin')
  )
);

drop policy if exists "Admins can update event flyers" on storage.objects;
create policy "Admins can update event flyers"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'event-flyers'
  and exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
      and role in ('owner', 'admin')
  )
)
with check (
  bucket_id = 'event-flyers'
  and exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
      and role in ('owner', 'admin')
  )
);

drop policy if exists "Admins can insert events" on public.events;
create policy "Admins can insert events"
on public.events
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
      and role in ('owner', 'admin')
  )
);

drop policy if exists "Admins can update events" on public.events;
create policy "Admins can update events"
on public.events
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
      and role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
      and role in ('owner', 'admin')
  )
);
