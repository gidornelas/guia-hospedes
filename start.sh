#!/bin/sh
# Sync database schema and start standalone Next.js server
npx prisma db push --accept-data-loss
node .next/standalone/server.js
