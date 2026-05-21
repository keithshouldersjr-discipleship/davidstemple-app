-- Adds the Serve at David's Temple ministry contact table and starter content.
-- Safe to rerun. Existing contact IDs will be updated instead of duplicated.

create table if not exists public.ministry_contacts (
  id text primary key,
  ministry_name text not null,
  leader_name text not null,
  phone text not null,
  description text,
  category text not null,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ministry_contacts enable row level security;

drop policy if exists "Public can read ministry contacts" on public.ministry_contacts;
create policy "Public can read ministry contacts"
on public.ministry_contacts
for select
to anon
using (is_active = true);

insert into public.ministry_contacts (
  id,
  ministry_name,
  leader_name,
  phone,
  description,
  category,
  is_active,
  sort_order
)
values
  (
    'mens-ministry',
    'Men''s Ministry',
    'Maurice Pryor',
    '256-658-6494',
    'Connect with men growing in faith, fellowship, and service.',
    'Men',
    true,
    1
  ),
  (
    'womens-ministry',
    'Women''s Ministry',
    'Shellia Battles',
    '256-651-5458',
    'Connect with women serving, encouraging, and growing together.',
    'Women',
    true,
    2
  ),
  (
    'christian-education',
    'Christian Education',
    'Rev. Donald Wicks',
    '901-598-3828',
    'Support teaching, learning, and discipleship opportunities.',
    'Discipleship',
    true,
    3
  ),
  (
    'youth-ministry',
    'Youth Ministry',
    'Nicole Andrews',
    '256-804-9331',
    'Serve young people as they grow in faith and community.',
    'Youth',
    true,
    4
  ),
  (
    'media-ministry',
    'Media Ministry',
    'Maurice Pryor',
    '256-658-6494',
    'Help support worship, communication, and digital ministry.',
    'Media',
    true,
    5
  ),
  (
    'ushers-ministry',
    'Ushers Ministry',
    'Tara Lucas',
    '256-431-1648',
    'Welcome worshipers and help create a hospitable worship experience.',
    'Hospitality',
    true,
    6
  ),
  (
    'choir',
    'Choir',
    'Antonio Woodruff',
    '256-951-3038',
    'Serve through music and help lead the church in worship.',
    'Worship',
    true,
    7
  )
on conflict (id) do update set
  ministry_name = excluded.ministry_name,
  leader_name = excluded.leader_name,
  phone = excluded.phone,
  description = excluded.description,
  category = excluded.category,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
