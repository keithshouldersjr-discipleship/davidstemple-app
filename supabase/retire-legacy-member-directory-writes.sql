-- Run only after the canonical website build is deployed and
-- verify-canonical-member-directory.sql reports no missing rows.
-- This keeps the legacy tables as a recoverable snapshot but prevents them
-- from becoming a second source of truth again.

do $$
begin
  if exists (
    select 1
    from public.member_profiles legacy
    where not exists (
      select 1
      from public.members canonical
      where canonical.organization_id = '11111111-1111-4111-8111-111111111111'::uuid
        and canonical.external_source_id = coalesce(legacy.external_id, legacy.id::text)
    )
  ) then
    raise exception 'Legacy member rows are still missing from public.members. Retirement stopped.';
  end if;
end;
$$;

drop trigger if exists sync_legacy_member_profiles_to_canonical on public.member_profiles;
drop trigger if exists sync_member_profiles_to_canonical_members on public.member_profiles;

revoke insert, update, delete on public.member_profiles from authenticated;
revoke insert, update, delete on public.member_contact_logs from authenticated;

comment on table public.member_profiles is
  'Read-only legacy snapshot. public.members is the canonical member identity table.';
comment on table public.member_contact_logs is
  'Read-only legacy snapshot. public.contact_logs stores canonical member contact history.';
