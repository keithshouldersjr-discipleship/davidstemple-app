# Canonical member-directory cutover

## Outcome

After this cutover, Davidstemple.app, DiscipleDesk, and Watchcare all use
`public.members.id` as the permanent person identifier. The website no longer
creates or updates `member_profiles`.

Website-only directory presentation fields live in
`member_directory_details`, keyed directly to the canonical member ID. Class
enrollment, attendance, care, and serving records continue to reference
`members.id`.

## Why this is needed

The original Member Hub writes to `member_profiles`. The shared ministry apps
read `members`. A one-time import copied the original directory, but people
added later remained only in the legacy table. The cutover removes that split.

## Files

- `supabase/canonical-member-directory-cutover.sql` — backfill, compatibility
  trigger for old browser bundles, extension table, and authenticated RPCs.
- `supabase/verify-canonical-member-directory.sql` — read-only count, identity,
  detail, and class-enrollment checks.
- `supabase/retire-legacy-member-directory-writes.sql` — disables the legacy
  write path after the new website has been verified.
- `lib/member-directory-repository.ts` — the only website client adapter for
  member-directory reads and writes.
- `scripts/check-canonical-member-access.mjs` — fails if application source
  reintroduces direct legacy-table access.

## Deployment order

### 1. Take a database backup

Create a Supabase database backup or point-in-time recovery checkpoint before
changing the live schema. Do not proceed without a restorable snapshot.

### 2. Confirm prerequisites

The shared Supabase project must already contain:

1. `member-directory.sql`
2. `watchcare-schema.sql`
3. `import-davids-temple-member-directory.sql`
4. `church-operations-foundation.sql`

The David's Temple organization ID is currently
`11111111-1111-4111-8111-111111111111`. If that seed ever changes, update the
three cutover scripts before running them.

### 3. Run the cutover SQL

Open the `davidstemple-app` project in Supabase, open SQL Editor, paste
`canonical-member-directory-cutover.sql`, and run it once.

The script is repeatable. It:

- backfills or updates canonical member rows;
- preserves legacy website-only fields in a one-to-one details table;
- migrates legacy contact history to canonical `contact_logs`;
- installs tenant-aware, permission-checked RPCs;
- temporarily synchronizes writes from an old cached website bundle into the
  canonical tables during deployment.

### 4. Run verification before deploying

Run `verify-canonical-member-directory.sql`.

These checks must be zero:

- legacy rows missing a canonical member;
- imported website members missing directory details;
- class enrollments with a missing canonical member.

Keep the two informational row counts for the deployment record.

### 5. Deploy davidstemple.app

Deploy the build containing `lib/member-directory-repository.ts` and the two
updated admin dashboards. The Member Hub and Shepherding dashboard now use the
canonical RPCs rather than reading or writing `member_profiles`.

### 6. Perform the smoke test

Using an administrator account:

1. Open Member Hub and confirm the existing directory count.
2. Open an existing member, change a harmless field, save, and reload.
3. Add a clearly identified test member with first and last name.
4. Open DiscipleDesk, enter a class, choose **Add member**, and search for the
   test member by last name.
5. Add the test member to the class and confirm the full name appears.
6. Open Shepherding and confirm the same member is present.
7. Add and remove a prayer-list status and save a contact note.
8. Run the verification SQL again.

### 7. Retire legacy writes

After at least one successful production test and after old browser tabs have
been refreshed, run `retire-legacy-member-directory-writes.sql`.

This does not delete either legacy table. It retains them as recoverable,
read-only snapshots while preventing future drift.

## Operating rules after cutover

- All website member access goes through `member-directory-repository.ts`.
- Do not add new `.from("member_profiles")` calls.
- Run `npm run check:canonical-members` in CI alongside lint and build.
- Do not store class membership, attendance, care ownership, or serving data in
  `member_directory_details`.
- Removing a person from a class updates `ministry_group_memberships`; it never
  deletes `members`.
- A login in `profiles` is not a member record. Connect them later with an
  optional `member_id` when account-to-member identity is needed.
- Every new ministry table must reference `members.id` and include
  `organization_id` with row-level security.

## Rollback boundary

Before the new website accepts any writes, rollback is simply redeploying the
previous build; the temporary legacy-to-canonical trigger remains safe.

After the new website accepts canonical writes, prefer fixing forward. Do not
redeploy the old write path because it cannot display canonical-only additions.
The database backup remains the recovery path for a failed cutover. The legacy
tables are intentionally retained until the team has completed a full release
cycle and separately approves their deletion.
