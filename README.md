# Zakazhi MVP Backup

Backup repository for the Zakazhi QR menu application.

## Included

- Production frontend from `/var/www/zakazhimvp` in the repository root.
- Backend from `/opt/zakazhi` in `backend/`.
- Raw PostgreSQL 16 data backup in `database/postgresql-raw/16-main/`.
- Nginx config snapshot in `docs/server/nginx-zakazhi.online.conf`.
- Deployment and recovery guide in `docs/DEPLOYMENT.md`.

## Secrets

Real `.env` files, passwords, API tokens, private keys and TLS keys are excluded. Use:

- `backend/.env.server.example`
- `backend/.env.client.example`

## Frontend

```bash
npm install
npm run dev
npm run build
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

Read `docs/DEPLOYMENT.md` before deploying or restoring the database.
