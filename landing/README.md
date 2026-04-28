# Landing

Landing is split into source and production build so agents do not confuse editable code with deployed static assets.

## Folders

- `source/` - full local React/Vite source code copied from `/Users/kenda/dev/final landing`.
- `production-build/` - static files copied from production `/var/www/landing`.

## Development

```bash
cd landing/source
npm install
npm run dev
```

## Build

```bash
cd landing/source
npm run build
```

Build output is `landing/source/dist/`. To deploy to the same server layout, copy the built files to `/var/www/landing`.

## Production Notes

- The production landing expects to be served from `/`, not from a subpath.
- Current production snapshot is in `landing/production-build/`.
- nginx config uses `root /var/www/landing;`.
