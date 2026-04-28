#!/bin/bash
cd /var/www/zakazhimvp
git pull origin main
npm install
npm run build
systemctl reload nginx
echo "Site updated at $(date)"
