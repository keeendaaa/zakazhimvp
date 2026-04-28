# AI Agent Guide

This file is written for future AI agents working in this repository. Read it before editing.

## Goal Of This Repository

This is a production backup and recovery repository for the Zakazhi QR menu product. It is not a clean monorepo. It intentionally contains several deployed artifacts copied from one server so the project can be restored or migrated.

## Main Map

- `package.json` - root helper scripts only. It is not an app package.
- `apps/qr-menu/package.json` - QR menu frontend app. React 18 + Vite. This is the app served at `/mvp/`.
- `apps/qr-menu/src/` - QR menu frontend source.
- `apps/qr-menu/build/` - production QR menu build copied from the server. It is tracked because the server served this directory directly.
- `landing/source/` - full editable React/Vite landing source copied from `/Users/kenda/dev/final landing`.
- `landing/production-build/` - static landing site copied from `/var/www/landing`. It is served as the root site by nginx.
- `backend/` - Wasp/OpenSaaS backend copied from `/opt/zakazhi`.
- `backend/main.wasp` - backend route/entity/action configuration.
- `backend/schema.prisma` - source Prisma schema.
- `backend/ecosystem.config.js` - old PM2 startup reference.
- `backend/zakazhimvp/n8n/` - exported n8n workflows related to payments, Telegram orders, feedback, and AI assistant.
- `integrations/n8n/` - n8n Docker Compose and menu data copied from `/opt/n8n`.
- `database/backups/` - portable compressed SQL dumps.
- `database/postgresql-raw/16-main/` - raw PostgreSQL 16 data directory emergency backup.
- `docs/server/` - nginx config snapshots.
- `docs/DEPLOYMENT.md` - deployment, restore, and server operations guide.

## Production Routing

- `https://zakazhi.online/` serves `landing/production-build/` equivalent from `/var/www/landing`.
- `https://zakazhi.online/mvp/` serves `apps/qr-menu/build/` equivalent from `/var/www/zakazhimvp/build`.
- `https://n8n.zakazhi.online/` proxies to n8n on `127.0.0.1:5678`.
- `/webhook...` paths on the n8n domain are intended for unauthenticated automation webhook calls.

## Databases

- PostgreSQL cluster: version 16, cluster `main`, path `/var/lib/postgresql/16/main`.
- `.env.server` pointed at database `zakazhi`, but that database had no public tables when inspected.
- Actual Wasp/Prisma tables were found in `zakazhi_db`; row counts were zero at inspection time.
- Dumps in `database/backups/` include both `zakazhi` and `zakazhi_db`.

## n8n Situation

- `/opt/n8n/docker-compose.yml` existed and was backed up in sanitized form.
- Docker was initially failed because the disk was full. Docker was later started.
- Before attempting compose startup, no n8n container was listed by `docker ps -a`.
- The workflow exports are JSON files in `backend/zakazhimvp/n8n/`; use those to recreate workflows if the n8n SQLite volume is empty or inconsistent.

## Do Not Commit

- Real `.env` files.
- API keys, access tokens, private keys, TLS keys, SSH keys.
- New server passwords.
- Large regenerated dependency folders such as `node_modules`.

## Safe Checks

Use these commands before committing frontend changes:

```bash
npm run build:qr
npm run build:landing
```

Use these checks for secrets:

```bash
git status --short
```

Manually inspect any `.env`, `.key`, `.pem`, `.crt`, or config files before staging.

## Editing Advice

- Treat `apps/qr-menu/` and `landing/` as separate deployables.
- Do not delete `apps/qr-menu/build/` or `landing/production-build/` unless deployment strategy is changed; nginx currently serves static build directories directly.
- Prefer documenting production facts over guessing architecture.
- If changing backend env names, update `backend/.env.server.example`, `README.md`, and `docs/DEPLOYMENT.md` together.
- If changing n8n workflows, keep exported JSON in the repo and document expected webhook URLs.
