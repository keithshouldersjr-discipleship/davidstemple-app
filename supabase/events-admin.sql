-- Adds event flyer support and admin write policies for communications.
-- Run this in the Supabase SQL Editor after member-directory.sql.

alter table public.events
add column if not exists flyer_url text;

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
