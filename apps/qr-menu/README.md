# QR Menu Frontend

Guest-facing React/Vite application for the restaurant QR menu.

## Production

- Server source/build path: `/var/www/zakazhimvp`.
- Public route: `https://zakazhi.online/mvp/`.
- nginx serves `apps/qr-menu/build/` equivalent from `/var/www/zakazhimvp/build/`.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build output goes to `build/`. This repository keeps the production build snapshot because nginx served that directory directly on the server.
