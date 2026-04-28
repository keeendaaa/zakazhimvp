# Deployment Guide

This repository is a backup of the Zakazhi QR menu application from `92.255.79.122`.

## Repository Layout

- `/` - active QR menu frontend, React 18 + Vite. On the server it was located at `/var/www/zakazhimvp` and served from `/mvp/`.
- `backend/` - Wasp/OpenSaaS backend copied from `/opt/zakazhi`.
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
- Frontend path: `/var/www/zakazhimvp`.
- Frontend nginx alias: `/mvp/ -> /var/www/zakazhimvp/build/`.
- Backend path: `/opt/zakazhi`.
- Backend stack: Wasp `^0.18.0`, Prisma, PostgreSQL.
- PostgreSQL: version 16, cluster `16/main`, expected port `5432`, database name `zakazhi`.
- At backup time PostgreSQL was down because `/` was 100% full. `pg_dump` could not be created until disk space is freed and the cluster starts.

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
