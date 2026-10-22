# Sparrowgen

**More customers. Not more templates.**

Sparrowgen is a web studio that builds hand-coded websites, online stores and landing pages for small businesses across India: cafés, salons, clinics, boutiques, banquet halls and more. This repository holds the studio's public website, the team's internal dashboard, and the API behind both.

🌐 **Live site:** [sparrowgen.com](https://sparrowgen.com) · 📸 [@sparrowgen.in](https://instagram.com/sparrowgen.in)

---

## What's inside

| Folder | What it is | Stack | Port |
| --- | --- | --- | --- |
| [`frontend/`](frontend) | Public website: home, "See your website first" previews, work, about, booking wizard, legal pages, SparrowBot chat | Next.js 16, React 19, TypeScript, plain CSS | 3000 |
| [`admin/`](admin) | Internal team dashboard: leads, stages, comments, activity log | Next.js 16, React 19, TypeScript, plain CSS | 3001 |
| [`backend-node/`](backend-node) | **Current API**: contact form, auth, leads, stages, comments, activity | Node.js 18.18+, MariaDB / MySQL (SQLite locally) | 8000 |
| [`backend/saas-landing-page-main/`](backend/saas-landing-page-main) | Original API, kept as a fallback. Answers identically to the Node one | Python 3.11+, FastAPI, PostgreSQL | 8000 |
| [`tools/`](tools) | `package.mjs`: bundles each app into an archive for Hostinger | Node.js | |

The website and dashboard only know one setting, `NEXT_PUBLIC_API_URL`, so either backend can sit behind them without code changes.

## Features

### Public website (`frontend/`)
- **See your website first** (`/preview`): a visitor types their business name and type and instantly sees 7 ready-made designs (Bold, Clean, Editorial, Showcase, Split, Soft, Luxe) with their name in it, on desktop or mobile. "Book it" pre-fills the booking form.
- **Hand-coding hero**: a code editor types itself while the site builds line by line.
- **Scratch-card services**: a glittery ticket that reveals the services when scratched.
- **Start a project** (`/start`): a 3-question wizard plus contact form with consent checkbox and honeypot spam protection.
- **SparrowBot**: a rule-based chat assistant that runs in the browser. No AI, no server, no API key. All answers live in one JSON file (see [`BOT.md`](BOT.md)).
- **Works, About, Why us** pages, light (Cream) and dark (Night) themes, page transitions and scroll animations tuned for iPhone and Safari.
- **SEO ready**: sitemap, robots.txt, per-page titles, Open Graph share image, structured business info.
- **Legal pages**: privacy, terms and cookies, written with India's DPDP Act in mind (need legal review before launch).

### Team dashboard (`admin/`)
- Team sign-in (no public sign-up; accounts are created from the command line).
- Every website request becomes a **lead**, tracked through three stages: **Backend → Frontend → Deployment**, each with its own status and assignee.
- Filter and search leads, comment on them, and read a full activity log.
- `noindex` and `robots.txt: Disallow: /` so it stays out of search engines.

### API (`backend-node/`)
- One runtime dependency (`mysql2`). HTTP server, password hashing (scrypt), JWT, rate limiting and validation use Node's built-in modules.
- Rate-limited contact form and login, optional email-deliverability check, input sanitising, strict CORS.
- Tables are created and upgraded automatically on start.
- Refuses to start in production with a weak `JWT_SECRET`, SQLite, or empty `CORS_ORIGINS`.
- About 80 tests, plus a parity script that checks it answers exactly like the Python backend.

## Quick start (local)

**Requirements:** Node.js 22.5+ (for the built-in SQLite used in local development and tests). No database server is needed locally.

### 1. API

```bash
cd backend-node
cp .env.example .env      # defaults work locally (SQLite file)
npm install
npm start                 # http://localhost:8000
```

Create a dashboard login (there is no sign-up page):

```bash
node scripts/manage-users.js create --name "Your Name" --email you@example.com
```

### 2. Website

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm install
npm run dev               # http://localhost:3000
```

Leave `NEXT_PUBLIC_API_URL` empty to run the website on its own with a mock API.

### 3. Dashboard

```bash
cd admin
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm install
npm run dev               # http://localhost:3001
```

Make sure `http://localhost:3000` and `http://localhost:3001` are in the API's `CORS_ORIGINS`.

## Tests

```bash
# API (in-memory SQLite, no network needed)
cd backend-node && npm test

# API against a real MySQL / MariaDB (the database name must contain "test")
export TEST_DATABASE_URL='mysql://user:password@host:3306/yourprefix_test'
npm run test:mysql

# SparrowBot rules
cd frontend && npm run test:bot

# Python backend (fallback)
cd backend/saas-landing-page-main && pytest && ruff check .
```

## Configuration

Copy each app's `.env.example`. Never commit real `.env` files.

| App | Key settings |
| --- | --- |
| `frontend/`, `admin/` | `NEXT_PUBLIC_API_URL`: the API address, no trailing slash |
| `backend-node/` | `NODE_ENV`, `PORT`, `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` (or `DATABASE_URL`), `JWT_SECRET`, `JWT_EXPIRE_MINUTES`, `CORS_ORIGINS`, `TRUST_PROXY_HOPS`, `CONTACT_RATE_LIMIT`, `LOGIN_RATE_LIMIT`, `EMAIL_CHECK_DELIVERABILITY`, `AUTO_MIGRATE` |

Brand name, contact details, copy, services, projects and FAQs all live in one file: [`frontend/src/lib/site.ts`](frontend/src/lib/site.ts).

## Deployment

The current plan is to host all three apps on **Hostinger's Node.js hosting** with a MariaDB / MySQL database.

```bash
node tools/package.mjs                 # dist/frontend.tar.gz, dist/admin.tar.gz, dist/backend-node.tar.gz
node tools/package.mjs backend-node    # only one app
```

Upload each archive as its own Node.js app in hPanel. The full step-by-step guide, including team accounts, DNS, HTTPS and smoke tests, is in [`DEPLOYMENT_MIGRATION.md`](DEPLOYMENT_MIGRATION.md).

The website can also be deployed to **Netlify** with no setup: [`netlify.toml`](netlify.toml) points it at `frontend/`.

## Project structure

```
.
├── frontend/            Public website (Next.js)
│   ├── src/app/         Pages: /, /preview, /work, /about, /why-us, /start, legal pages
│   ├── src/components/  UI: hero, scratch card, preview studio, wizard, chatbot
│   ├── src/lib/         site.ts (brand + copy), api.ts, previews.ts, seo.ts, bot/
│   └── tests/           SparrowBot tests
├── admin/               Team dashboard (Next.js)
├── backend-node/        Current API (Node.js + MySQL)
│   ├── src/             http, routes, services, db, core
│   ├── scripts/         manage-users, migrate, print-schema, parity
│   └── tests/
├── backend/             Fallback API (Python + FastAPI + PostgreSQL)
├── tools/package.mjs    Builds upload archives for Hostinger
└── *.md                 Guides (see below)
```

## Guides

| Guide | What it covers |
| --- | --- |
| [`DEPLOYMENT_MIGRATION.md`](DEPLOYMENT_MIGRATION.md) | Deploying the Node backend, website and dashboard on Hostinger (current) |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Original deployment with the Python backend on Render (obsolete) |
| [`MIGRATION.md`](MIGRATION.md) | How the API moved from Python/PostgreSQL to Node/MySQL, and how it was verified |
| [`BACKEND_SWITCH.md`](BACKEND_SWITCH.md) | Switching between the two backends |
| [`BOT.md`](BOT.md) | Adding and changing SparrowBot's answers without touching code |
| [`REBRAND.md`](REBRAND.md) | Renaming the brand and connecting a domain |
| [`backend-node/docs/FRONTEND_API.md`](backend-node/docs/FRONTEND_API.md) | API reference for frontend developers |

## Contact

- ✉️ business@sparrowgen.com
- 💬 WhatsApp: +91 62918 45804 · +91 80178 12091
- 📸 Instagram: [@sparrowgen.in](https://instagram.com/sparrowgen.in)

---

© Sparrowgen. All rights reserved.
