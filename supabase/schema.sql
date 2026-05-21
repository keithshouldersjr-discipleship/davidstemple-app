create table if not exists public.events (
  id text primary key,
  title text not null,
  description text,
  date date not null,
  time text,
  location text,
  registration_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

alter table public.events enable row level security;
alter table public.church_info enable row level security;

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events"
on public.events
for select
to anon
using (true);

drop policy if exists "Public can read approved church info" on public.church_info;
create policy "Public can read approved church info"
on public.church_info
for select
to anon
using (true);

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

insert into public.events (id, title, description, date, time, location)
values
  (
    'church-anniversary-2026-05-24',
    'Church Anniversary',
    'From the 2026 Ministry Events Calendar.',
    '2026-05-24',
    'Time to be announced',
    'Location to be announced'
  ),
  (
    'relay-for-life-2026-05-30',
    'Relay For Life',
    'From the 2026 Ministry Events Calendar.',
    '2026-05-30',
    'Time to be announced',
    'Location to be announced'
  ),
  (
    'church-carnival-2026-05-30',
    'Church Carnival',
    'From the 2026 Ministry Events Calendar.',
    '2026-05-30',
    'Time to be announced',
    'Location to be announced'
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  date = excluded.date,
  time = excluded.time,
  location = excluded.location,
  updated_at = now();
