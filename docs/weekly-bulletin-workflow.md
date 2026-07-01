# Weekly Bulletin Workflow

The public bulletin lives at `/bulletin`.

Each week, use the admin builder:

```text
https://davidstemple.app/admin?tab=bulletin
```

After signing in, the form loads the current bulletin content. Update the fields,
click **Generate bulletin**, and the confirmation window will show the live link:

```text
https://davidstemple.app/bulletin
```

## First-Time Supabase Setup

Run this SQL file in the Supabase SQL Editor before publishing from the form:

```text
supabase/bulletins.sql
```

Until the table exists, `/bulletin` falls back to the bundled JSON content.

## Fallback JSON Update

If Supabase is unavailable, update the raw content in:

```text
content/bulletin.current.json
```

Then deploy the app.

## Form Fields

The admin form maps to the same sections shown on the bulletin:

- Header, slug, and date range
- Pastor note
- This Sunday's scripture passage
- Weekly schedule
- Important links
- Sunday invitation
- Upcoming events
- Serve and get involved
- Ministry spotlight
- Prayer and care
- Stay connected
- Footer details

## Manual JSON Steps

1. Open `content/bulletin.current.json`.
2. Replace the week-specific values:
   - `slug`
   - `dateRange`
   - `pastor.note`
   - `focus.title`
   - `focus.body` for the scripture passage
   - `weeklySchedule`
   - `importantLinks`
   - `sundayInvite`
   - `upcomingEvents`
   - `serve.items`
   - `ministrySpotlight`
   - `prayerCare.items`
   - `stayConnected.items`
3. Run:

```bash
npm run lint
npm run build
```

4. Deploy the app and share:

```text
https://davidstemple.app/bulletin
```

## Supported Icons

Use one of these values for `icon` fields:

```text
book
calendar
church
cross
globe
hands
heart
link
megaphone
phone
sparkles
star
target
users
```

## Future Admin Form

The JSON shape is intentionally the same shape the future admin form should save. A Supabase-backed editor can store one row per issue with the JSON content, then `/bulletin` can load the latest published row.
