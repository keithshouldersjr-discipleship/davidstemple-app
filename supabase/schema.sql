create table if not exists public.events (
  id text primary key,
  title text not null,
  description text,
  date date not null,
  time text,
  ministry text,
  location text,
  registration_url text,
  leader_name text,
  leader_email text,
  leader_phone text,
  support_needed text[] not null default '{}',
  request_volunteers boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

alter table public.events
add column if not exists request_volunteers boolean not null default false;

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
alter table public.connection_requests enable row level security;
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

drop policy if exists "Anyone can submit connection requests" on public.connection_requests;
create policy "Anyone can submit connection requests"
on public.connection_requests
for insert
to anon, authenticated
with check (status = 'new');

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
    'Service Times',
    'What time is Sunday School?',
    'Sunday School is at 8:30 AM, Morning Worship is at 9:30 AM, and Bible Study is at 11:00 AM and 6:00 PM.',
    '2026-06-17'
  ),
  (
    'info-serving',
    'Serving',
    'How can I serve?',
    'A good next step is to visit the Join A Ministry page and connect with the ministry leader for the area where you would like to serve.',
    '2026-06-17'
  ),
  (
    'info-care',
    'Care',
    'How do I submit a prayer or care request?',
    'Prayer requests can be submitted through the Submit a Prayer Request card on the Resources page. The form allows you to include your name and contact information for follow-up or submit the request anonymously.',
    '2026-06-17'
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

insert into public.events (id, title, description, date, time, ministry, location, leader_name, leader_email, leader_phone, support_needed, request_volunteers)
values
  (
    'church-anniversary-2026-05-24',
    'Church Anniversary',
    'From the 2026 Ministry Events Calendar.',
    '2026-05-24',
    'Time to be announced',
    null,
    'Location to be announced',
    null,
    null,
    null,
    '{}',
    false
  ),
  (
    'relay-for-life-2026-05-30',
    'Relay For Life',
    'From the 2026 Ministry Events Calendar.',
    '2026-05-30',
    'Time to be announced',
    null,
    'Location to be announced',
    null,
    null,
    null,
    '{}',
    false
  ),
  (
    'church-carnival-2026-05-30',
    'Church Carnival',
    'From the 2026 Ministry Events Calendar.',
    '2026-05-30',
    'Time to be announced',
    null,
    'Location to be announced',
    null,
    null,
    null,
    '{}',
    false
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  date = excluded.date,
  time = excluded.time,
  ministry = excluded.ministry,
  location = excluded.location,
  leader_name = excluded.leader_name,
  leader_email = excluded.leader_email,
  leader_phone = excluded.leader_phone,
  support_needed = excluded.support_needed,
  request_volunteers = excluded.request_volunteers,
  updated_at = now();
