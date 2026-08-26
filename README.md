# David's Temple App

A simple digital ministry hub for David's Temple Missionary Baptist Church.

## Local Development

```bash
npm install
npm run dev
```

The app will use mock data until Supabase environment variables are added.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run the SQL in `supabase/schema.sql`.
4. Copy `.env.example` to `.env.local`.
5. Add your Supabase project URL and anon key:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

6. Restart the local development server.

## Supabase Tables

The first Supabase version uses three public read tables:

- `events`: feeds the homepage event preview and `/events`
- `church_info`: feeds ask.dt knowledge-base answers
- `ministry_contacts`: feeds `/serve` and ministry contact answers in ask.dt
- `admin_users`: allowlist for admin dashboard access
- `member_profiles`: church directory profiles for authenticated admins

If you already ran `supabase/schema.sql` before the Serve page was added, run
`supabase/ministry-contacts.sql` in the Supabase SQL Editor to add the new table
and starter ministry contact content.

For the admin directory, run `supabase/member-directory.sql` in the Supabase SQL
Editor, then add your email address to `admin_users`. Create your login user in
Supabase Auth using the same email address. The import template is
`supabase/member-directory-import-template.csv`.

The app falls back to `lib/mock-data.ts` if Supabase is not configured or if a read fails.

## Shared Church Operations

The target architecture and migration plan are documented in
`docs/church-management-architecture.md`. New attendance and serving features use
Watchcare's organization-aware `public.members` model. Apply the canonical migration
from `watchcare/supabase/church-operations-foundation.sql`, then open
`/admin/operations` for the first shared ministry-health dashboard.

## Vercel Environment Variables

In Vercel, add the same variables under:

Project Settings → Environment Variables

After adding them, redeploy the project so production can read from Supabase.

### Prayer Mentor signup spreadsheet

The `/prayer-mentors` page posts mentor and mentee signups to the Google Sheet webhook in
`scripts/prayer-mentor-webhook.gs`. Bind that script to the Prayer Mentor Program workbook,
set its `PRAYER_MENTOR_WEBHOOK_SECRET` script property, deploy it as a web app, and add the
deployment URL and matching secret to `PRAYER_MENTOR_SHEET_WEBHOOK_URL` and
`PRAYER_MENTOR_SHEET_WEBHOOK_SECRET` in Vercel.

## Production Build

```bash
npm run lint
npm run build
```
