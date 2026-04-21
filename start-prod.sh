#!/bin/sh
# Clear Railway domain variables that lack protocol (breaks NextAuth v5)
unset RAILWAY_PUBLIC_DOMAIN
unset RAILWAY_STATIC_URL
unset RAILWAY_SERVICE_GUIA_HOSPEDES_URL
unset VERCEL_URL

# Ensure NextAuth URLs have protocol
if [ -z "$NEXTAUTH_URL" ] || ! echo "$NEXTAUTH_URL" | grep -q "^http"; then
  export NEXTAUTH_URL="https://guia-hospedes-production.up.railway.app"
fi

if [ -z "$AUTH_URL" ] || ! echo "$AUTH_URL" | grep -q "^http"; then
  export AUTH_URL="https://guia-hospedes-production.up.railway.app"
fi

if [ -z "$NEXT_PUBLIC_APP_URL" ] || ! echo "$NEXT_PUBLIC_APP_URL" | grep -q "^http"; then
  export NEXT_PUBLIC_APP_URL="https://guia-hospedes-production.up.railway.app"
fi

# Sync database schema
npx prisma db push --accept-data-loss

# Start Next.js server
node server.js
