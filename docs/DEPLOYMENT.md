# Deployment Guide

This repository is a backup of the Zakazhi QR menu application from `92.255.79.122`.

## Repository Layout

- `/` - active QR menu frontend, React 18 + Vite. On the server it was located at `/var/www/zakazhimvp` and served from `/mvp/`.
- `landing/` - static landing site copied from `/var/www/landing` and served at the domain root.
- `backend/` - Wasp/OpenSaaS backend copied from `/opt/zakazhi`.
- `integrations/n8n/` - n8n Docker Compose and menu data copied from `/opt/n8n`.
- `backend/zakazhimvp/n8n/` - exported n8n workflow JSON files.
- `database/backups/` - portable compressed PostgreSQL dumps.
- `database/postgresql-raw/16-main/` - raw PostgreSQL 16 data directory backup copied from `/var/lib/postgresql/16/main`.
- `docs/server/nginx-zakazhi.online.conf` - nginx virtual host copied from `/etc/nginx/sites-available/zakazhi.online`.

## Security Notes

- Real `.env`, tokens, API keys, private keys, TLS keys and passwords are intentionally not committed.
- Use `backend/.env.server.example` and `backend/.env.client.example` as templates.
- The root server password was shared during the backup process and should be rotated.
- The database backup can contain user data and hashed credentials. Keep the repository private.

## Production State Found During Backup

- Domain: `zakazhi.online`.
- Frontend route: `https://zakazhi.online/mvp/`.
- Landing route: `https://zakazhi.online/`.
- Landing path: `/var/www/landing`.
- Frontend path: `/var/www/zakazhimvp`.
- Frontend nginx alias: `/mvp/ -> /var/www/zakazhimvp/build/`.
- Backend path: `/opt/zakazhi`.
- Backend stack: Wasp `^0.18.0`, Prisma, PostgreSQL.
- PostgreSQL: version 16, cluster `16/main`, expected port `5432`.
- `.env.server` pointed to database `zakazhi`; that database had no public tables when checked.
- Wasp/Prisma tables were found in `zakazhi_db`; the table structure was present but row counts were zero when checked.
- n8n path: `/opt/n8n`.
- n8n public domain: `https://n8n.zakazhi.online/`.
- n8n internal port: `127.0.0.1:5678`.
- At first backup time PostgreSQL and Docker were down because `/` was 100% full. Space was later freed and PostgreSQL was started successfully.

## Landing Deploy

The landing in `landing/` is a static built site. Deploy it to `/var/www/landing`:

```bash
rsync -az --delete landing/ root@SERVER:/var/www/landing/
```

Nginx serves it as the domain root:

```nginx
root /var/www/landing;
index index.html;
```

The landing has absolute asset paths like `/assets/...`, so it expects to be served from the domain root, not a subpath.

## Frontend Development And Deploy

```bash
npm install
npm run dev
npm run build
```

On the server, deploy the build output under `/var/www/zakazhimvp/build` and serve it with nginx:

```nginx
location /mvp/ {
    alias /var/www/zakazhimvp/build/;
    try_files $uri $uri/ /mvp/index.html;
    index index.html;
}
```

After nginx changes:

```bash
nginx -t
systemctl reload nginx
```

## Backend Development And Deploy

```bash
curl -sSL https://get.wasp.sh/installer.sh | sh
cd backend
cp .env.server.example .env.server
cp .env.client.example .env.client
npm install
wasp start db
wasp db migrate-dev
wasp start
```

For server deployment, put backend files in `/opt/zakazhi`, fill `.env.server`, prepare PostgreSQL using the real `DATABASE_URL`, run migrations, then start with PM2 or systemd. The backed up `backend/ecosystem.config.js` shows the previous PM2 startup command.

## n8n Deploy And Workflows

n8n deployment files are in `integrations/n8n/`. The production compose file was sanitized, so replace `CHANGE_ME` before running it.

```bash
cd /opt/n8n
docker compose up -d
docker compose ps
```

n8n should listen only locally:

```text
127.0.0.1:5678 -> container 5678
```

nginx exposes n8n over HTTPS at `n8n.zakazhi.online`. The config allows `/webhook...` paths to pass through for automation callbacks.

Workflow exports are stored in `backend/zakazhimvp/n8n/`:

- VTB SBP test payment simulator.
- VTB SBP payment QR code generation.
- Restaurant orders to Telegram.
- Feedback to Google Sheets.
- Restaurant AI assistant.

If the n8n SQLite volume is empty or broken, recreate workflows by importing those JSON files through the n8n UI.

## Database Backup And Restore

Preferred portable backup after PostgreSQL is running:

```bash
source /opt/zakazhi/.env.server
pg_dump "$DATABASE_URL" --no-owner --no-privileges | gzip -9 > zakazhi_postgres.sql.gz
```

Restore a SQL dump:

```bash
gunzip -c zakazhi_postgres.sql.gz | psql "$DATABASE_URL"
```

Backups currently committed:

- `database/backups/zakazhi_postgres_2026-04-29.sql.gz` - configured database `zakazhi`, no public app tables at inspection time.
- `database/backups/zakazhi_db_postgres_2026-04-29.sql.gz` - database `zakazhi_db`, contains Wasp/Prisma tables.

To restore `zakazhi_db` into a fresh database:

```bash
createdb zakazhi_db
gunzip -c database/backups/zakazhi_db_postgres_2026-04-29.sql.gz | psql zakazhi_db
```

Current backup is raw PostgreSQL data because production had no free disk space:

```text
database/postgresql-raw/16-main/
```

Raw recovery requires PostgreSQL 16 and a stopped service:

```bash
systemctl stop postgresql
mv /var/lib/postgresql/16/main /var/lib/postgresql/16/main.bak
cp -a database/postgresql-raw/16-main /var/lib/postgresql/16/main
chown -R postgres:postgres /var/lib/postgresql/16/main
chmod 700 /var/lib/postgresql/16/main
systemctl start postgresql@16-main
```

After recovery, immediately create a SQL dump.

## Current Server Disk Issue

The production root filesystem was 100% full. PostgreSQL failed with `No space left on device`.

The largest immediate cause was PM2 logs:

- `/root/.pm2/logs` - about 3.7 GB.

Cleanup already performed:

```bash
pm2 flush
find /root/.pm2/logs -type f -name "*.log" -exec truncate -s 0 {} +
apt-get clean
npm cache clean --force
rm -rf /root/.cache/prisma
```

After cleanup, disk usage dropped to about 72-73%, PostgreSQL started, and SQL dumps were created.

Cleanup candidates found during backup:

- `/var/www/zakazhimvp/node_modules` - about 356 MB, can be recreated with `npm ci`.
- `/opt/zakazhi/node_modules` - about 428 MB, can be recreated with `npm ci`.

After freeing space:

```bash
systemctl start postgresql@16-main
pg_lsclusters
source /opt/zakazhi/.env.server
pg_dump "$DATABASE_URL" --no-owner --no-privileges | gzip -9 > /root/zakazhi_postgres.sql.gz
```
