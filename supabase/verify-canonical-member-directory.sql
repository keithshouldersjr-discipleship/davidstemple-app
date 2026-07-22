-- Read-only verification for the canonical member-directory cutover.
-- Every result should report zero except the informational row counts.

select 'legacy member_profiles rows' as check_name, count(*)::bigint as issue_count
from public.member_profiles
union all
select 'canonical David''s Temple members', count(*)::bigint
from public.members
where organization_id = '11111111-1111-4111-8111-111111111111'::uuid
union all
select 'legacy rows missing canonical member', count(*)::bigint
from public.member_profiles legacy
where not exists (
  select 1
  from public.members canonical
  where canonical.organization_id = '11111111-1111-4111-8111-111111111111'::uuid
    and canonical.external_source_id = coalesce(legacy.external_id, legacy.id::text)
)
union all
select 'imported website members missing directory details', count(*)::bigint
from public.member_profiles legacy
join public.members canonical
  on canonical.organization_id = '11111111-1111-4111-8111-111111111111'::uuid
 and canonical.external_source_id = coalesce(legacy.external_id, legacy.id::text)
where canonical.organization_id = '11111111-1111-4111-8111-111111111111'::uuid
  and not exists (
    select 1 from public.member_directory_details details where details.member_id = canonical.id
  )
union all
select 'class enrollments with noncanonical member', count(*)::bigint
from public.ministry_group_memberships enrollment
left join public.members canonical on canonical.id = enrollment.member_id
where enrollment.organization_id = '11111111-1111-4111-8111-111111111111'::uuid
  and canonical.id is null
order by check_name;

-- Spot-check the most recently changed canonical records.
select
  id,
  full_name,
  email,
  membership_status,
  active,
  updated_at
from public.members
where organization_id = '11111111-1111-4111-8111-111111111111'::uuid
order by updated_at desc
limit 20;
