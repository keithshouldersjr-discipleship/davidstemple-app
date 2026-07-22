# David's Temple Church Management Architecture

Updated July 20, 2026. This document covers `davidstemple-app`, DiscipleDesk (currently in the `early-faith-app` repository), and `watchcare`.

## Decision

Build a small coordinated ecosystem on one Supabase backend:

- **David's Temple web admin** is the secretary/pastor workspace for member maintenance, reporting, attendance setup, and serving oversight.
- **Watchcare** remains the focused native care and discipleship app for pastors, deacons, and care leaders.
- **DiscipleDesk** becomes the focused Christian education workspace for children's, youth, and adult ministry leaders.
- **Supabase** is the single source of truth for identity, organizations, people, households, permissions, attendance, serving, and care data.

Do not merge the native apps now. Their Sunday workflows, permissions, and navigation are different enough that one large app would be harder for volunteers to learn. Reassess after the shared backend and design system have been used for two ministry cycles.

## What exists today

### David's Temple web app

- Next.js 16 public ministry site with Supabase-backed events, ministry contacts, bulletin publishing, requests, and a member directory.
- Admin access uses an email allowlist in `admin_users` with owner/admin/leader/member roles.
- `member_profiles` is a useful legacy directory but mixes household, care, and membership fields in one row.
- The shepherding page duplicates some care concepts that Watchcare models more safely.
- Admin screens call Supabase directly from the browser. RLS is therefore the real security boundary.

### Watchcare

- Expo Router native app with Supabase Auth, organization selection, tenant-scoped RLS, care visibility levels, reminders, audit logs, and tested domain helpers.
- Its `organizations`, `profiles`, `organization_memberships`, `households`, and `members` tables are the strongest existing foundation and should be canonical.
- The David's Temple importer already maps legacy `member_profiles` into `members`.
- Risks already noted in the project remain: push delivery, scheduled reminder materialization, and native production validation.

### DiscipleDesk

- Expo prototype with strong classroom concepts and polished sample workflows, but no authentication or persistence.
- Current students, guardians, attendance, teachers, lessons, and insights are local sample data.
- It should consume the shared member/group/attendance contract before adding secure pickup or notifications.

Both configured apps point at the same Supabase project, which makes an incremental migration possible.

## Product research

| Product | Relevant strengths | Fit for ~175 members | Recommendation |
| --- | --- | --- | --- |
| Planning Center | People is a free central database; modular Check-Ins, Groups, and Services show a strong separation of attendance, discipleship groups, and volunteer scheduling. Check-Ins supports security labels, trusted pickup, medical notes, and first-time guests. | Excellent product benchmark; module pricing and multiple admin surfaces can add complexity. | Trial it as the strongest modular alternative and copy its event/session/attendance separation. |
| ChurchTrac | People, attendance/check-in, groups, volunteer scheduling, automations, website/app, imports, and support are bundled; pricing scales by names and 250 is the relevant tier. | Strongest buy-versus-build candidate because it covers nearly every requested workflow in one system. | Get a live quote and run a two-week sandbox using real workflows before investing in advanced custom check-in. |
| Tithely Church Management / Breeze | Flat $72/month ChMS with unlimited people/admins, check-in/name tags, attendance reporting, volunteer scheduling, groups, messaging, and follow-ups. Tithely All Access is $119/month. | Simple and predictable, but duplicates parts of the existing site and custom Watchcare investment. | Keep as the simplest flat-rate fallback. |

Sources reviewed:

- Planning Center: https://support.planningcenteronline.com/hc/en-us/articles/12214037068827-Use-Planning-Center-for-free
- Planning Center attendance: https://support.planningcenteronline.com/hc/en-us/articles/1260802413009-How-do-I-take-attendance
- Planning Center children's ministry: https://support.planningcenteronline.com/hc/en-us/articles/5876257919771-Using-Planning-Center-for-children-s-ministry
- ChurchTrac pricing/features: https://www.churchtrac.com/pricing
- Tithely ChMS: https://get.tithe.ly/product/church-management-software
- Breeze pricing/features: https://www.breezechms.com/pricing

Prices and packaging change. Confirm them directly before purchase.

## Canonical data model

`organization_id` is required on every ministry record. New features use these domains:

1. **Identity and access:** `profiles`, `organization_memberships`, Supabase Auth.
2. **People and households:** `members`, `households`. `members.external_source_id` preserves the legacy source key.
3. **Ministry structure:** `ministries`, `ministry_groups`, `ministry_group_memberships`.
4. **Attendance:** `attendance_sessions` represents a dated occurrence; `attendance_records` represents a person or guest at that occurrence. A session may also store a headcount when names are not needed.
5. **Serving:** `serving_roles` describes the opportunity; `serving_assignments` captures scheduled, confirmed, served, declined, and no-show outcomes.
6. **Care:** Watchcare's assignments, contact logs, prayer notes, care events, bereavement records, reminders, and visibility model.

`member_profiles` and `admin_users` are compatibility tables during migration, not the long-term source of truth. Avoid dual writes. Run the importer, compare counts and samples, switch one read path at a time, then freeze legacy writes.

### Unified member profile

The shared `members` record owns display name, optional first/last/preferred names, contact information, birthday representation, household, membership status, member-since date, active state, group hints, and care status. Keep these outside the base row:

- guardian/pickup permissions and medical details;
- confidential care notes;
- attendance history;
- serving history;
- background-check reports.

Those have different retention and visibility needs. DiscipleDesk should eventually use a dedicated child-safety profile with restricted access and an audit trail; do not put medical or custody notes in generic attendance notes.

## Roles and permissions

Use Watchcare organization memberships everywhere. The legacy website roles map as follows:

| Legacy | Canonical |
| --- | --- |
| owner | owner |
| admin | admin |
| leader responsible for care | pastor, deacon, elder, or care_team_leader |
| leader responsible for a class/team | ministry_leader |
| view-only helper | read_only |

Current foundation behavior:

- Owners, admins, and pastors manage ministry setup.
- Owners, admins, pastors, elders, deacons, care-team leaders, and ministry leaders can record attendance and serving activity.
- Active organization users can read operational summaries.
- The database checks organization ownership on related group, member, session, and role IDs to block cross-tenant writes.

Before a children's beta, add scoped assignments so a volunteer sees only today's assigned class and only the child-safety fields required for that shift. Do not rely on hiding controls in the app.

## Analytics and decision rules

Start with questions leaders can act on:

- Sunday School and Bible study attendance by week and group.
- First-time guests and whether follow-up occurred within seven days.
- Members absent from a specific group for three consecutive meetings.
- Unique members who served in the last 90 days.
- Active members with no recorded serving in 90 days.
- Open care follow-ups, without exposing note text in general dashboards.

Report denominators and data freshness. A person with no serving record is a follow-up candidate, not proof that they do not serve. Do not create a single member-engagement score.

## Migration sequence

1. Back up Supabase and export `member_profiles`, `members`, memberships, and care tables.
2. Apply `watchcare-schema.sql`, then the existing David's Temple owner bootstrap and directory importer in a staging project.
3. Apply `watchcare/supabase/church-operations-foundation.sql`.
4. Reconcile row counts, external IDs, duplicate candidates, household links, birthdays, and inactive/deceased states.
5. Create canonical organization memberships for secretary, pastor, deacons, and ministry leaders. Remove the broad website admin allowlist only after every user can sign in through the canonical path.
6. Pilot named attendance with one Sunday School class and Bible study for four weeks; keep the existing spreadsheet as a read-only comparison.
7. Pilot serving outcomes with two ministries. Review false “not serving” results before leadership uses the report.
8. Switch the web directory from `member_profiles` to `members`, make legacy rows read-only, then retire legacy care fields.
9. Connect DiscipleDesk to groups/sessions/records. Add secure pickup only after scoped RLS, device procedures, retention policy, and incident review are ready.

Every rollout has an export and rollback point. Do not delete legacy tables in the first release.

## UX principles

- Show each role only the work needed today.
- Make attendance a two-tap roster action with a clear save/sync state.
- Allow headcount-only sessions for worship and named attendance for classes/follow-up.
- Keep confidential care wording out of general previews and push notifications.
- Provide duplicate warnings and import previews; never silently merge people.
- Optimize secretary workflows for desktop and classroom/check-in workflows for phones/tablets.

## Recommended milestones

1. **Data confidence:** apply and verify the migration in staging, add generated Supabase database types, reconcile canonical members, and test RLS with real roles.
2. **Attendance pilot:** web session setup plus DiscipleDesk live roster capture, offline queue, and sync conflict handling.
3. **Serving pilot:** ministry/role setup, scheduling outcome capture, and participation reports.
4. **Member cutover:** web admin edits canonical `members` and households; legacy tables become read-only.
5. **Child safety:** guardian relationships, authorized pickup, security codes/labels, restricted medical alerts, background-check status, audit tests, and written Sunday procedures.
6. **Automation:** visitor/absence follow-up tasks, scheduled Watchcare reminders, and carefully worded notifications.

## Build-versus-buy checkpoint

After milestones 1 and 2, compare six months of expected custom maintenance with ChurchTrac's 250-name quote and a Planning Center configuration. Buy if the commercial product meets child-safety, import/export, care visibility, and reporting needs without forcing duplicate records. Keep the custom ecosystem only where the focused Watchcare/DiscipleDesk experience provides clear ministry value.
