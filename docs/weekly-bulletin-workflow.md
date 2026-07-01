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

The admin form intentionally locks most layout fields. Only these weekly fields
are editable:

- Pastor note
- This Sunday's scripture passage
- Upcoming events
- Ministry spotlight

The Upcoming Events panel is manually curated so the weekly bulletin can
emphasize the most important dates.

The date range at the top of the public bulletin updates automatically each
week using a Sunday-through-Saturday Central Time range.

## Manual JSON Steps

1. Open `content/bulletin.current.json`.
2. Replace the week-specific values:
   - `slug`
   - `pastor.note`
   - `focus.title`
   - `focus.reference` for the scripture reference
   - `focus.excerpt` for the short key verse or preview
   - `focus.passageUrl` for the full passage link
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
