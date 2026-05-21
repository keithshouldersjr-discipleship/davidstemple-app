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

The first Supabase version uses two public read tables:

- `events`: feeds the homepage event preview and `/events`
- `church_info`: feeds ask.dt knowledge-base answers

The app falls back to `lib/mock-data.ts` if Supabase is not configured or if a read fails.

## Vercel Environment Variables

In Vercel, add the same variables under:

Project Settings → Environment Variables

After adding them, redeploy the project so production can read from Supabase.

## Production Build

```bash
npm run lint
npm run build
```
