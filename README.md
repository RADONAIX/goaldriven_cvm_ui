# Goal-Driven CVM — UI

Frontend for the Agentic CVM (Customer Value Management) telecom app: Persona
Vision, Persona 360, Persona Grid, Persona Churn, and SmartOfferX. Built on
Next.js (App Router) + MUI (Devias Material Kit), with NextAuth for login.

## Prerequisites
- Node.js 18+ and npm
- Network access to the `agentic_cvm` Postgres (login authenticates against it)

## Setup
```bash
npm install
cp .env.example .env.local     # then fill in .env.local (see below)
npm run dev                    # http://localhost:3000
```

### Environment (`.env.local`)
`.env.local` is gitignored and holds secrets. Required variables (see
`.env.example`):

| Var | Purpose |
|---|---|
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Postgres connection for login (NextAuth queries `admin_schema.users`) |
| `NEXTAUTH_URL` | `http://localhost:3000` in dev |
| `NEXTAUTH_SECRET` | JWT signing secret — generate with `openssl rand -hex 32` |

If these DB vars are missing, **every login fails** with "Database query failed".

## Login credentials
The sign-in page authenticates against `admin_schema.users` on the `agentic_cvm`
Postgres (bcrypt). A ready-to-use demo admin:

| Email | Password |
|---|---|
| `admin@cvm.app` | `CvmDemo@2026` |

> These are **demo** credentials for local/staging use. Change them (or add your
> own users) before any real deployment — insert into `admin_schema.users` with a
> bcrypt hash (`bcryptjs`), e.g.
> `node -e "console.log(require('bcryptjs').hashSync('YOUR_PW',10))"`.

## Scripts
| Command | Description |
|---|---|
| `npm run dev` | Dev server (hot reload) at :3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Architecture notes
- **Auth**: `src/app/api/auth/[...nextauth]/route.ts` + `src/lib/db.ts` — NextAuth
  Credentials provider running a direct `pg` query against `admin_schema.users`.
  (The `src/lib/auth/client.ts` mock is unused.)
- **Data APIs**: chart/insight data is fetched from the hosts configured in
  [`apiConfig.ts`](apiConfig.ts). These currently point at the legacy prototype
  servers (`http://10.200.36.156:820x`). To use the new CVM backend, repoint these
  to its `/api/v1/...` endpoints.
- Sidebar/nav: `src/components/dashboard/layout/side-nav.tsx`.
