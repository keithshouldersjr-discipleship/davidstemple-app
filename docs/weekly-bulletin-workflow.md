# Weekly Bulletin Workflow

The public bulletin lives at `/bulletin`.

Each week, update the raw content in:

```text
content/bulletin.current.json
```

The page layout is handled by:

```text
components/bulletin/weekly-bulletin.tsx
```

## Weekly Update Steps

1. Open `content/bulletin.current.json`.
2. Replace the week-specific values:
   - `slug`
   - `dateRange`
   - `pastor.note`
   - `focus.body`
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
