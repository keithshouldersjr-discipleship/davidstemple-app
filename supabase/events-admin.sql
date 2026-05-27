-- Adds event flyer support and admin write policies for communications.
-- Run this in the Supabase SQL Editor after member-directory.sql.

alter table public.events
add column if not exists flyer_url text;

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
  and public.can_manage_directory()
);

drop policy if exists "Admins can update event flyers" on storage.objects;
create policy "Admins can update event flyers"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'event-flyers'
  and public.can_manage_directory()
)
with check (
  bucket_id = 'event-flyers'
  and public.can_manage_directory()
);

drop policy if exists "Admins can insert events" on public.events;
create policy "Admins can insert events"
on public.events
for insert
to authenticated
with check (public.can_manage_directory());

drop policy if exists "Admins can update events" on public.events;
create policy "Admins can update events"
on public.events
for update
to authenticated
using (public.can_manage_directory())
with check (public.can_manage_directory());
