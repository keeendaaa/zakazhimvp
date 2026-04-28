# n8n Integration Backup

This folder contains the n8n deployment files copied from `/opt/n8n` on the production server.

## Files

- `docker-compose.yml` - sanitized n8n Docker Compose config. The real basic-auth password was replaced with `CHANGE_ME`.
- `menu_data.json` - compact menu data used by automation/testing.
- `full_menu_data.txt` - larger menu export/reference file.
- `restaurant-menu.ts.backup` - backup of generated or source menu data.

## Related Workflow Exports

The n8n workflow JSON exports are currently stored with the app backup at:

- `backend/zakazhimvp/n8n/VTB SBP Test Payment Simulator.json`
- `backend/zakazhimvp/n8n/VTB SBP Payment QR Code.json`
- `backend/zakazhimvp/n8n/Restaurant Orders to Telegram (1).json`
- `backend/zakazhimvp/n8n/Feedback to Google Sheets.json`
- `backend/zakazhimvp/n8n/Restaurant AI Assistant (1).json`

## Production Notes

- n8n is intended to listen on `127.0.0.1:5678`.
- nginx exposes it through HTTPS at `n8n.zakazhi.online`.
- Webhooks are proxied by nginx and should be reachable under `/webhook...` paths.
- Docker was not running when the backup started. It was later started, but no n8n container was present before `docker compose up` was attempted.
- The persistent volume path on the server is `/var/lib/docker/volumes/n8n_n8n_data/_data`.

## Run

```bash
cd integrations/n8n
docker compose up -d
```

Set a strong `N8N_BASIC_AUTH_PASSWORD` before using this in production.
