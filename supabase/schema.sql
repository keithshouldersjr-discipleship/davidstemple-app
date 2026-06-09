create table if not exists public.events (
  id text primary key,
  title text not null,
  description text,
  date date not null,
  time text,
  ministry text,
  location text,
  registration_url text,
  flyer_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.event_requests
add column if not exists approved_by text;

alter table public.event_requests
add column if not exists approved_at timestamptz;

create table if not exists public.church_info (
  id text primary key,
  topic text not null,
  question text not null,
  answer text not null,
  source_url text,
  last_updated date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

alter table public.events enable row level security;
alter table public.event_requests enable row level security;
alter table public.church_info enable row level security;
alter table public.ministry_contacts enable row level security;

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events"
on public.events
for select
to anon
using (true);

drop policy if exists "Anyone can submit event requests" on public.event_requests;
create policy "Anyone can submit event requests"
on public.event_requests
for insert
to anon, authenticated
with check (status = 'pending');

drop policy if exists "Public can read approved church info" on public.church_info;
create policy "Public can read approved church info"
on public.church_info
for select
to anon
using (true);

drop policy if exists "Public can read ministry contacts" on public.ministry_contacts;
create policy "Public can read ministry contacts"
on public.ministry_contacts
for select
to anon
using (is_active = true);

insert into public.church_info (id, topic, question, answer, last_updated)
values
  (
    'info-sunday-school',
    'Sunday School',
    'What time is Sunday School?',
    'Sunday School is listed in this first version as Sundays at 9:00 AM. Please check official church updates for any schedule changes.',
    '2026-05-21'
  ),
  (
    'info-serving',
    'Serving',
    'How can I serve?',
    'You can start by sharing your area of interest with the church office or a ministry leader.',
    '2026-05-21'
  ),
  (
    'info-care',
    'Care',
    'How do I submit a prayer or care request?',
    'For now, contact the church office so the care team can receive your request.',
    '2026-05-21'
  )
on conflict (id) do update set
  topic = excluded.topic,
  question = excluded.question,
  answer = excluded.answer,
  last_updated = excluded.last_updated,
  updated_at = now();

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

insert into public.events (id, title, description, date, time, ministry, location, flyer_url)
values
  (
    'church-anniversary-2026-05-24',
    'Church Anniversary',
    'From the 2026 Ministry Events Calendar.',
    '2026-05-24',
    'Time to be announced',
    null,
    'Location to be announced',
    null
  ),
  (
    'relay-for-life-2026-05-30',
    'Relay For Life',
    'From the 2026 Ministry Events Calendar.',
    '2026-05-30',
    'Time to be announced',
    null,
    'Location to be announced',
    null
  ),
  (
    'church-carnival-2026-05-30',
    'Church Carnival',
    'From the 2026 Ministry Events Calendar.',
    '2026-05-30',
    'Time to be announced',
    null,
    'Location to be announced',
    null
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  date = excluded.date,
  time = excluded.time,
  ministry = excluded.ministry,
  location = excluded.location,
  flyer_url = excluded.flyer_url,
  updated_at = now();
