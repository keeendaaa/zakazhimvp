# Zakazhi Production Backup

This repository is a full recovery-oriented backup of the Zakazhi QR menu product from the production server `92.255.79.122`.

It contains the QR menu web app, the public landing, the Wasp backend, n8n automation files, nginx configs, and PostgreSQL backups. It is intentionally documented for humans and future AI agents.

## Start Here

- `docs/AI_AGENT_GUIDE.md` - quick orientation for AI agents.
- `docs/DEPLOYMENT.md` - full deployment and recovery guide.
- `docs/server/nginx-zakazhi.online.conf` - production nginx config for `zakazhi.online`.
- `integrations/n8n/README.md` - n8n-specific notes.

## Architecture

Zakazhi has four main parts:

- Landing site: static marketing site served at `https://zakazhi.online/` from `/var/www/landing`.
- QR menu frontend: React/Vite app served at `https://zakazhi.online/mvp/` from `/var/www/zakazhimvp/build`.
- Backend: Wasp/OpenSaaS app in `/opt/zakazhi`, using Prisma and PostgreSQL.
- Automations: n8n on `127.0.0.1:5678`, intended to be exposed as `https://n8n.zakazhi.online/` for workflows and webhooks.

## Repository Map

- `/` - QR menu frontend source. Main entry: `src/main.tsx`, `src/App.tsx`.
- `build/` - production QR menu build copied from the server.
- `landing/` - static landing copied from `/var/www/landing`.
- `backend/` - Wasp backend copied from `/opt/zakazhi`.
- `backend/main.wasp` - Wasp app config, routes, auth, actions, queries.
- `backend/schema.prisma` - Prisma schema.
- `backend/zakazhimvp/n8n/` - exported n8n workflows.
- `integrations/n8n/` - n8n Docker Compose and menu data from `/opt/n8n`.
- `database/backups/` - compressed SQL dumps.
- `database/postgresql-raw/16-main/` - emergency raw PostgreSQL 16 data directory backup.
- `docs/` - deployment docs, AI guide, nginx snapshots.

## Secrets

Real `.env` files, passwords, API tokens, private keys and TLS keys are excluded. Use templates:

- `backend/.env.server.example`
- `backend/.env.client.example`

The n8n Docker Compose password was replaced with `CHANGE_ME`. Set a strong password before running it.

## QR Menu Frontend

```bash
npm install
npm run dev
npm run build
```

Production serves the built files from `build/` under `/mvp/`.

## Landing

The landing is stored separately in `landing/`. It is a static built site, not the same app as the QR menu frontend.

Production nginx uses it as the root site:

```nginx
root /var/www/landing;
index index.html;
```

## Backend

```bash
cd backend
cp .env.server.example .env.server
cp .env.client.example .env.client
npm install
wasp start db
wasp db migrate-dev
wasp start
```

Backend production path was `/opt/zakazhi`. The old PM2 startup reference is `backend/ecosystem.config.js`.

## Database Backups

Portable dumps:

- `database/backups/zakazhi_postgres_2026-04-29.sql.gz` - database named `zakazhi`, configured by `.env.server`, no public tables at inspection time.
- `database/backups/zakazhi_db_postgres_2026-04-29.sql.gz` - database named `zakazhi_db`, contains the Wasp/Prisma table structure.

Raw emergency backup:

- `database/postgresql-raw/16-main/`

## n8n

n8n files are split by purpose:

- Runtime/deploy config: `integrations/n8n/`.
- Workflow exports: `backend/zakazhimvp/n8n/`.

Expected production routing:

- n8n container listens on `127.0.0.1:5678`.
- nginx exposes `https://n8n.zakazhi.online/`.
- Webhooks are proxied through `/webhook...` paths.

## Server Maintenance Finding

The server was full because PM2 logs used about `3.7G`. Cleanup performed:

- `pm2 flush`
- truncated `/root/.pm2/logs/*.log`
- `apt-get clean`
- `npm cache clean --force`

After cleanup, PostgreSQL started and SQL dumps were created.

Read `docs/DEPLOYMENT.md` before deploying, restoring, or changing server paths.
