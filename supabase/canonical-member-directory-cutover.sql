-- David's Temple canonical member-directory cutover.
--
-- Run after:
--   1. member-directory.sql
--   2. watchcare-schema.sql
--   3. import-davids-temple-member-directory.sql
--   4. church-operations-foundation.sql
--
-- public.members becomes the only identity record used by the website,
-- DiscipleDesk, and Watchcare. Website-only directory fields live in a
-- one-to-one extension keyed by members.id.

create extension if not exists pgcrypto;

create table if not exists public.member_directory_details (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  member_id uuid primary key references public.members(id) on delete cascade,
  spouse_name text,
  children text[] not null default '{}',
  household_leader_member_id uuid references public.members(id) on delete set null,
  notes text,
  care_notes text,
  care_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (household_leader_member_id is null or household_leader_member_id <> member_id)
);

create index if not exists member_directory_details_org_idx
on public.member_directory_details (organization_id, member_id);

alter table public.member_directory_details enable row level security;
revoke all on public.member_directory_details from anon;
revoke all on public.member_directory_details from authenticated;

-- Repeatable canonical backfill. The legacy UUID is retained as the external
-- source identifier so this can safely be rerun without creating duplicates.
insert into public.members (
  organization_id,
  external_source_id,
  full_name,
  first_name,
  last_name,
  preferred_name,
  birthday,
  phone,
  email,
  care_status,
  deacon_care_group,
  additional_groups,
  membership_status,
  active
)
select
  '11111111-1111-4111-8111-111111111111'::uuid,
  coalesce(profile.external_id, profile.id::text),
  trim(profile.first_name || ' ' || profile.last_name),
  nullif(trim(profile.first_name), ''),
  nullif(trim(profile.last_name), ''),
  nullif(trim(profile.first_name), ''),
  nullif(trim(profile.birthday_month_day), ''),
  nullif(trim(profile.phone), ''),
  nullif(trim(profile.email), ''),
  case profile.care_status
    when 'sick_shut_in' then 'shut_in'::public.care_status
    when 'bereavement' then 'bereaved'::public.care_status
    else 'stable'::public.care_status
  end,
  nullif(trim(profile.deacon_group), ''),
  coalesce(profile.ministry_interests, '{}'),
  case profile.status
    when 'deceased' then 'deceased'
    when 'inactive' then 'inactive'
    else 'active'
  end,
  profile.status = 'active'
from public.member_profiles profile
on conflict (organization_id, external_source_id) do update
set full_name = excluded.full_name,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    preferred_name = excluded.preferred_name,
    birthday = excluded.birthday,
    phone = excluded.phone,
    email = excluded.email,
    care_status = excluded.care_status,
    deacon_care_group = excluded.deacon_care_group,
    additional_groups = excluded.additional_groups,
    membership_status = excluded.membership_status,
    active = excluded.active,
    updated_at = now();

insert into public.member_directory_details (
  organization_id,
  member_id,
  spouse_name,
  children,
  household_leader_member_id,
  notes,
  care_notes,
  care_updated_at
)
select
  member_record.organization_id,
  member_record.id,
  nullif(trim(profile.spouse_name), ''),
  coalesce(profile.children, '{}'),
  household_leader.id,
  nullif(trim(profile.notes), ''),
  nullif(trim(profile.care_notes), ''),
  profile.care_updated_at
from public.member_profiles profile
join public.members member_record
  on member_record.organization_id = '11111111-1111-4111-8111-111111111111'::uuid
 and member_record.external_source_id = coalesce(profile.external_id, profile.id::text)
left join public.member_profiles legacy_household_leader
  on legacy_household_leader.id = profile.household_leader_id
left join public.members household_leader
  on household_leader.organization_id = member_record.organization_id
 and household_leader.external_source_id = coalesce(
   legacy_household_leader.external_id,
   legacy_household_leader.id::text
 )
on conflict (member_id) do update
set spouse_name = excluded.spouse_name,
    children = excluded.children,
    household_leader_member_id = excluded.household_leader_member_id,
    notes = excluded.notes,
    care_notes = excluded.care_notes,
    care_updated_at = excluded.care_updated_at,
    updated_at = now();

-- Preserve legacy website contact history in the canonical care log.
insert into public.contact_logs (
  organization_id,
  member_id,
  leader_user_id,
  contact_date,
  contact_type,
  summary,
  visibility,
  created_at,
  updated_at
)
select
  canonical_member.organization_id,
  canonical_member.id,
  contact_owner.id,
  legacy_log.contacted_at,
  case legacy_log.contact_type
    when 'call' then 'phone_call'
    when 'text' then 'text_message'
    when 'visit' then 'in_person'
    when 'card' then 'card_letter'
    when 'prayer' then 'prayer'
    else 'other'
  end,
  legacy_log.notes,
  'pastor_admin',
  legacy_log.created_at,
  now()
from public.member_contact_logs legacy_log
join public.member_profiles legacy_member on legacy_member.id = legacy_log.member_id
join public.members canonical_member
  on canonical_member.organization_id = '11111111-1111-4111-8111-111111111111'::uuid
 and canonical_member.external_source_id = coalesce(legacy_member.external_id, legacy_member.id::text)
join lateral (
  select profile.id
  from public.profiles profile
  left join public.organization_memberships membership
    on membership.user_id = profile.id
   and membership.organization_id = canonical_member.organization_id
   and membership.status = 'active'
  where lower(profile.email) = lower(coalesce(legacy_log.created_by, ''))
     or membership.role in ('owner', 'admin', 'pastor')
  order by
    (lower(profile.email) = lower(coalesce(legacy_log.created_by, ''))) desc,
    case membership.role when 'owner' then 1 when 'admin' then 2 else 3 end
  limit 1
) contact_owner on true
where not exists (
  select 1
  from public.contact_logs existing
  where existing.organization_id = canonical_member.organization_id
    and existing.member_id = canonical_member.id
    and existing.contact_date = legacy_log.contacted_at
    and existing.summary = legacy_log.notes
);

create or replace function public.get_member_directory_entries()
returns table (
  id uuid,
  first_name text,
  last_name text,
  birthday_month_day text,
  phone text,
  email text,
  spouse_name text,
  children text[],
  ministry_interests text[],
  deacon_group text,
  household_leader_id uuid,
  care_status text,
  care_notes text,
  care_updated_at timestamptz,
  status text,
  notes text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication is required.';
  end if;

  return query
  select
    member_record.id,
    coalesce(member_record.first_name, split_part(trim(member_record.full_name), ' ', 1)),
    coalesce(member_record.last_name, nullif(trim(regexp_replace(member_record.full_name, '^\S+\s*', '')), '')),
    member_record.birthday,
    member_record.phone,
    member_record.email,
    details.spouse_name,
    coalesce(details.children, '{}'),
    coalesce(member_record.additional_groups, '{}'),
    member_record.deacon_care_group,
    details.household_leader_member_id,
    case
      when member_record.care_status = 'bereaved' then 'bereavement'
      when member_record.care_status in ('sick', 'hospitalized', 'recovering', 'homebound', 'shut_in') then 'sick_shut_in'
      else 'none'
    end,
    details.care_notes,
    details.care_updated_at,
    case
      when member_record.membership_status = 'deceased' then 'deceased'
      when member_record.active and member_record.membership_status = 'active' then 'active'
      else 'inactive'
    end,
    details.notes
  from public.members member_record
  left join public.member_directory_details details on details.member_id = member_record.id
  where member_record.organization_id = '11111111-1111-4111-8111-111111111111'::uuid
    and (
      public.can_view_directory()
      or lower(coalesce(member_record.email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  order by member_record.last_name nulls last, member_record.first_name nulls last, member_record.full_name;
end;
$$;

create or replace function public.update_member_directory_entry(
  active_member_id uuid,
  changes jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  member_record public.members%rowtype;
  details_record public.member_directory_details%rowtype;
  is_manager boolean := public.can_manage_directory();
  next_first_name text;
  next_last_name text;
  next_household_leader_id uuid;
begin
  select * into member_record
  from public.members
  where id = active_member_id
    and organization_id = '11111111-1111-4111-8111-111111111111'::uuid;

  if not found then
    raise exception 'Member was not found.';
  end if;
  if not is_manager and lower(coalesce(member_record.email, '')) <> lower(coalesce(auth.jwt() ->> 'email', '')) then
    raise exception 'You do not have permission to update this member.';
  end if;

  select * into details_record
  from public.member_directory_details
  where member_id = active_member_id;

  next_first_name := case when changes ? 'first_name' then nullif(trim(changes ->> 'first_name'), '') else member_record.first_name end;
  next_last_name := case when changes ? 'last_name' then nullif(trim(changes ->> 'last_name'), '') else member_record.last_name end;
  if next_first_name is null or next_last_name is null then
    raise exception 'First and last name are required.';
  end if;

  if changes ? 'household_leader_id' then
    next_household_leader_id := nullif(changes ->> 'household_leader_id', '')::uuid;
    if next_household_leader_id = active_member_id then
      next_household_leader_id := null;
    end if;
    if not is_manager and next_household_leader_id is distinct from details_record.household_leader_member_id then
      raise exception 'Only directory administrators can change household assignments.';
    end if;
    if next_household_leader_id is not null and not exists (
      select 1 from public.members candidate
      where candidate.id = next_household_leader_id
        and candidate.organization_id = member_record.organization_id
    ) then
      raise exception 'Household leader must belong to this church.';
    end if;
  else
    next_household_leader_id := details_record.household_leader_member_id;
  end if;

  update public.members
  set first_name = next_first_name,
      last_name = next_last_name,
      full_name = trim(next_first_name || ' ' || next_last_name),
      preferred_name = case when changes ? 'first_name' then next_first_name else preferred_name end,
      birthday = case when changes ? 'birthday_month_day' then nullif(trim(changes ->> 'birthday_month_day'), '') else birthday end,
      phone = case when changes ? 'phone' then nullif(trim(changes ->> 'phone'), '') else phone end,
      email = case when is_manager and changes ? 'email' then nullif(trim(changes ->> 'email'), '') else email end,
      deacon_care_group = case when changes ? 'deacon_group' then nullif(trim(changes ->> 'deacon_group'), '') else deacon_care_group end,
      additional_groups = case
        when changes ? 'ministry_interests'
          then array(select jsonb_array_elements_text(coalesce(changes -> 'ministry_interests', '[]'::jsonb)))
        else additional_groups
      end,
      care_status = case
        when changes ->> 'care_status' = 'sick_shut_in' then 'shut_in'::public.care_status
        when changes ->> 'care_status' = 'bereavement' then 'bereaved'::public.care_status
        when changes ? 'care_status' then 'stable'::public.care_status
        else care_status
      end,
      membership_status = case
        when not is_manager or not (changes ? 'status') then membership_status
        when changes ->> 'status' = 'deceased' then 'deceased'
        when changes ->> 'status' = 'inactive' then 'inactive'
        else 'active'
      end,
      active = case
        when not is_manager or not (changes ? 'status') then active
        else changes ->> 'status' = 'active'
      end,
      updated_at = now()
  where id = active_member_id;

  insert into public.member_directory_details (
    organization_id,
    member_id,
    spouse_name,
    children,
    household_leader_member_id,
    notes,
    care_notes,
    care_updated_at
  ) values (
    member_record.organization_id,
    active_member_id,
    case when changes ? 'spouse_name' then nullif(trim(changes ->> 'spouse_name'), '') else details_record.spouse_name end,
    case
      when changes ? 'children' then array(select jsonb_array_elements_text(coalesce(changes -> 'children', '[]'::jsonb)))
      else coalesce(details_record.children, '{}')
    end,
    next_household_leader_id,
    case when is_manager and changes ? 'notes' then nullif(trim(changes ->> 'notes'), '') else details_record.notes end,
    case when changes ? 'care_notes' then nullif(trim(changes ->> 'care_notes'), '') else details_record.care_notes end,
    case when changes ? 'care_updated_at' then nullif(changes ->> 'care_updated_at', '')::timestamptz else details_record.care_updated_at end
  )
  on conflict (member_id) do update
  set spouse_name = excluded.spouse_name,
      children = excluded.children,
      household_leader_member_id = excluded.household_leader_member_id,
      notes = excluded.notes,
      care_notes = excluded.care_notes,
      care_updated_at = excluded.care_updated_at,
      updated_at = now();
end;
$$;

create or replace function public.upsert_member_directory_entry(
  active_member_id uuid,
  first_name text,
  last_name text,
  birthday_month_day text default null,
  phone text default null,
  email text default null,
  spouse_name text default null,
  children text[] default '{}',
  ministry_interests text[] default '{}',
  deacon_group text default null,
  household_leader_id uuid default null,
  status text default 'active',
  notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_member_id uuid := active_member_id;
begin
  if active_member_id is null then
    if not public.can_manage_directory() then
      raise exception 'Only directory administrators can add members.';
    end if;
    if nullif(trim(first_name), '') is null or nullif(trim(last_name), '') is null then
      raise exception 'First and last name are required.';
    end if;

    saved_member_id := gen_random_uuid();
    insert into public.members (
      id, organization_id, external_source_id, full_name, first_name, last_name, preferred_name,
      birthday, phone, email, deacon_care_group, additional_groups,
      membership_status, active
    ) values (
      saved_member_id,
      '11111111-1111-4111-8111-111111111111'::uuid,
      saved_member_id::text,
      trim(first_name || ' ' || last_name), trim(first_name), trim(last_name), trim(first_name),
      nullif(trim(birthday_month_day), ''), nullif(trim(phone), ''), nullif(trim(email), ''),
      nullif(trim(deacon_group), ''), coalesce(ministry_interests, '{}'),
      case status when 'deceased' then 'deceased' when 'inactive' then 'inactive' else 'active' end,
      status = 'active'
    );
  end if;

  perform public.update_member_directory_entry(
    saved_member_id,
    jsonb_build_object(
      'first_name', first_name,
      'last_name', last_name,
      'birthday_month_day', birthday_month_day,
      'phone', phone,
      'email', email,
      'spouse_name', spouse_name,
      'children', to_jsonb(coalesce(children, '{}')),
      'ministry_interests', to_jsonb(coalesce(ministry_interests, '{}')),
      'deacon_group', deacon_group,
      'household_leader_id', household_leader_id,
      'status', status,
      'notes', notes
    )
  );
  return saved_member_id;
end;
$$;

create or replace function public.get_member_directory_contact_logs()
returns table (
  id uuid,
  member_id uuid,
  contact_type text,
  notes text,
  contacted_at timestamptz,
  created_by text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.can_manage_directory() then
    raise exception 'Directory administrator permission is required.';
  end if;
  return query
  select
    contact.id,
    contact.member_id,
    case contact.contact_type
      when 'phone_call' then 'call'
      when 'text_message' then 'text'
      when 'in_person' then 'visit'
      when 'home_visit' then 'visit'
      when 'hospital_visit' then 'visit'
      when 'card_letter' then 'card'
      else contact.contact_type
    end,
    contact.summary,
    contact.contact_date,
    leader.email,
    contact.created_at
  from public.contact_logs contact
  left join public.profiles leader on leader.id = contact.leader_user_id
  where contact.organization_id = '11111111-1111-4111-8111-111111111111'::uuid
  order by contact.contact_date desc;
end;
$$;

create or replace function public.add_member_directory_contact_log(
  active_member_id uuid,
  active_contact_type text,
  active_notes text,
  active_contacted_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  active_profile_id uuid := public.current_profile_id();
  saved_contact_id uuid;
begin
  if not public.can_manage_directory() then
    raise exception 'Directory administrator permission is required.';
  end if;
  if active_profile_id is null then
    raise exception 'Your login is not connected to a church profile.';
  end if;

  insert into public.contact_logs (
    organization_id, member_id, leader_user_id, contact_date, contact_type, summary, visibility
  ) values (
    '11111111-1111-4111-8111-111111111111'::uuid,
    active_member_id,
    active_profile_id,
    coalesce(active_contacted_at, now()),
    case active_contact_type
      when 'call' then 'phone_call'
      when 'text' then 'text_message'
      when 'visit' then 'in_person'
      when 'card' then 'card_letter'
      when 'prayer' then 'prayer'
      else 'other'
    end,
    trim(active_notes),
    'pastor_admin'
  ) returning id into saved_contact_id;

  return saved_contact_id;
end;
$$;

-- During deployment, old browser bundles may still write member_profiles.
-- This trigger keeps those writes safe until the retirement script is run.
create or replace function public.sync_legacy_member_profile_to_canonical()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  source_record public.member_profiles%rowtype;
  canonical_member_id uuid;
  canonical_household_leader_id uuid;
begin
  if tg_op = 'DELETE' then
    source_record := old;
    update public.members
    set active = false, membership_status = 'inactive', updated_at = now()
    where organization_id = '11111111-1111-4111-8111-111111111111'::uuid
      and external_source_id = coalesce(source_record.external_id, source_record.id::text);
    return old;
  end if;

  source_record := new;
  select id into canonical_member_id
  from public.members
  where organization_id = '11111111-1111-4111-8111-111111111111'::uuid
    and external_source_id = coalesce(source_record.external_id, source_record.id::text);

  if canonical_member_id is null then
    insert into public.members (organization_id, external_source_id, full_name, first_name, last_name, preferred_name, membership_status, active)
    values (
      '11111111-1111-4111-8111-111111111111'::uuid,
      coalesce(source_record.external_id, source_record.id::text),
      trim(source_record.first_name || ' ' || source_record.last_name),
      source_record.first_name,
      source_record.last_name,
      source_record.first_name,
      case source_record.status when 'deceased' then 'deceased' when 'inactive' then 'inactive' else 'active' end,
      source_record.status = 'active'
    ) returning id into canonical_member_id;
  end if;

  select canonical_leader.id into canonical_household_leader_id
  from public.member_profiles legacy_leader
  join public.members canonical_leader
    on canonical_leader.organization_id = '11111111-1111-4111-8111-111111111111'::uuid
   and canonical_leader.external_source_id = coalesce(legacy_leader.external_id, legacy_leader.id::text)
  where legacy_leader.id = source_record.household_leader_id;

  perform public.update_member_directory_entry(
    canonical_member_id,
    jsonb_build_object(
      'first_name', source_record.first_name,
      'last_name', source_record.last_name,
      'birthday_month_day', source_record.birthday_month_day,
      'phone', source_record.phone,
      'email', source_record.email,
      'spouse_name', source_record.spouse_name,
      'children', to_jsonb(source_record.children),
      'ministry_interests', to_jsonb(source_record.ministry_interests),
      'deacon_group', source_record.deacon_group,
      'household_leader_id', canonical_household_leader_id,
      'status', source_record.status,
      'notes', source_record.notes,
      'care_status', source_record.care_status,
      'care_notes', source_record.care_notes,
      'care_updated_at', source_record.care_updated_at
    )
  );
  return new;
end;
$$;

drop trigger if exists sync_member_profiles_to_canonical_members on public.member_profiles;
drop trigger if exists sync_legacy_member_profiles_to_canonical on public.member_profiles;
create trigger sync_legacy_member_profiles_to_canonical
after insert or update or delete on public.member_profiles
for each row execute function public.sync_legacy_member_profile_to_canonical();

revoke all on function public.get_member_directory_entries() from public, anon;
revoke all on function public.update_member_directory_entry(uuid, jsonb) from public, anon;
revoke all on function public.upsert_member_directory_entry(uuid, text, text, text, text, text, text, text[], text[], text, uuid, text, text) from public, anon;
revoke all on function public.get_member_directory_contact_logs() from public, anon;
revoke all on function public.add_member_directory_contact_log(uuid, text, text, timestamptz) from public, anon;
grant execute on function public.get_member_directory_entries() to authenticated;
grant execute on function public.update_member_directory_entry(uuid, jsonb) to authenticated;
grant execute on function public.upsert_member_directory_entry(uuid, text, text, text, text, text, text, text[], text[], text, uuid, text, text) to authenticated;
grant execute on function public.get_member_directory_contact_logs() to authenticated;
grant execute on function public.add_member_directory_contact_log(uuid, text, text, timestamptz) to authenticated;
