# Editor HTML

Create and share personal HTML pages. Write raw HTML in a Monaco editor with a live preview, and share it with a unique link. Pages auto-expire after 7 days (30 days for logged-in users).

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict)
- **UI:** Tailwind CSS 4, lucide-react, Monaco editor
- **Auth:** Google OAuth via Auth.js (NextAuth v5)
- **Database:** PostgreSQL (Neon) via Drizzle ORM
- **Security:** DOMPurify HTML sanitization
- **Deploy:** Vercel (+ daily cron to purge expired pages)

## Getting started

Requires [bun](https://bun.sh) (or npm).

```bash
bun install
cp env.example .env    # fill in DATABASE_URL and Google OAuth credentials
bun run dev            # http://localhost:3000
```

### Google OAuth setup

1. Create an OAuth 2.0 Client ID (Web application) in the
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://<your-vercel-domain>/api/auth/callback/google`
3. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env`.
4. Generate `AUTH_SECRET` with `openssl rand -base64 32`.

## Scripts

| Command          | Description                  |
| ---------------- | ---------------------------- |
| `bun run dev`    | Start dev server (Turbopack) |
| `bun run build`  | Production build             |
| `bun run start`  | Start production server      |
| `bun run lint`   | Run ESLint                   |
| `bun run db:generate` | Generate a Drizzle migration |

## Database

The Drizzle schema lives in `app/lib/schema.ts`. To evolve it:

```bash
bunx drizzle-kit generate   # create migration
bunx drizzle-kit push       # apply to database
```

## Expired-page cleanup

Expired pages are deleted by a Vercel cron hitting `/api/services/scheduler`
(schedule: `15 06 * * *`). The endpoint requires the `CRON_SECRET` bearer
token, so it can't be triggered by unauthenticated requests.

## Structure

```
app/
  api/auth/[...nextauth]/  Auth.js route handlers
  api/page/create/      POST create a page
  api/page/edit/        POST update page content (owner-checked)
  api/services/scheduler/  cron cleanup of expired pages
  components/editor.tsx     Monaco editor + preview (client)
  lib/                  db, schema, validators, helpers
  p/create/             create form
  p/edit/[nanoid]/      editor for a page (owner-only)
  p/[nanoid]/           public page (sanitized, private-aware)
auth.ts                 Auth.js config (Google provider)
proxy.ts                session-refresh middleware
```

## Privacy model

- Pages created while logged in are linked to the owner; only the owner can
  edit them.
- Anonymous pages can be edited by anyone with the link.
- Pages marked **private** are only visible to their owner.
