# simple-forms

A SaaS web app for creating, distributing, and collecting digitally-signed forms. Form owners create forms from templates, share a public link, and recipients fill, sign, and submit. Submissions are stored as PDFs in cloud storage and owners are notified by email.

Built with SvelteKit + shadcn/ui.

## Prerequisites

- Node.js 18+
- Bun
- Docker (for local database)

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Key variables:
   - `DATABASE_URL` — Postgres connection string
   - `SUPABASE_PROJECT_URL` + `SUPABASE_API_KEY` — file storage
   - `BETTER_AUTH_SECRET` + `BETTER_AUTH_URL` — auth
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth
   - `WEBHOOK_BASE_URL` — workflow manager for email delivery
   - `PAYMENTS_SERVICE_HOST/PORT` — Freemius payments proxy
   - `BROWSER_SERVICE_HOST/PORT` — headless browser for PDF generation

3. Start local database:
   ```bash
   bun run local:db:up
   ```

4. Run migrations:
   ```bash
   bun run db:migrate
   ```

5. Start dev server:
   ```bash
   bun run dev
   ```
   Open [http://localhost:5173](http://localhost:5173).

## Project Structure

```
simple-forms/
├── src/
│   ├── lib/
│   │   ├── components/        # Reusable UI components
│   │   ├── server/
│   │   │   ├── auth/          # better-auth config
│   │   │   ├── database/      # Drizzle client, schemas, migrations, services
│   │   │   ├── notifications/ # Email notifications via webhooks
│   │   │   ├── providers/     # Supabase client
│   │   │   ├── remote/        # External service integrations
│   │   │   └── storage.ts     # Supabase storage operations
│   │   ├── models/            # TypeScript interfaces
│   │   ├── enums/
│   │   ├── i18n/              # en-US + he-IL translations
│   │   └── templates/emails/  # HTML email templates
│   └── routes/
│       ├── [[lang]]/          # Optional locale prefix
│       │   ├── (application)/ # Auth-guarded app routes (dashboard, forms, templates)
│       │   ├── (public)/      # Public form signing + post-submission pages
│       │   ├── (purchase)/    # Pricing + checkout
│       │   └── (site)/        # Legal/static pages
│       └── api/               # Server API routes
├── scripts/                   # Code-gen scripts
├── docker-compose.local.yml
└── drizzle.config.ts
```

## Available Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run start` | Run production build |
| `bun run check` | TypeScript type-check |
| `bun run lint` | Prettier + ESLint |
| `bun run test:server` | Run server-side tests |
| `bun run db:migrate` | Run database migrations |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run local:db:up` | Start local Postgres via Docker |
| `bun run create:page` | Scaffold a new page |
| `bun run create:api-controller` | Scaffold a new API route |

## Tech Stack

- **Framework:** SvelteKit 2 + Svelte 5, TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (bits-ui)
- **Auth:** better-auth (email/password + Google OAuth)
- **Database:** PostgreSQL + Drizzle ORM
- **Storage:** Supabase Storage
- **Payments:** Freemius
- **i18n:** sveltekit-i18n (English + Hebrew/RTL)
- **PDF:** Headless browser service
- **AI:** Google Gemini
- **Runtime:** Bun + Vite

---

*Generated with [Templates CLI](https://github.com/GantonL/templates)*
