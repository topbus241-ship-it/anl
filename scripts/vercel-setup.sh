#!/usr/bin/env bash
set -euo pipefail

# vercel-setup.sh
# Script para automatizar a configuração do domínio, variáveis e deploy no Vercel.
# Requisitos (local): node (npx), vercel CLI ou npx vercel; VERCEL_TOKEN, VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

print_help() {
  cat <<EOF
Usage: VERCEL_TOKEN=<token> VITE_SUPABASE_URL=<url> VITE_SUPABASE_ANON_KEY=<anon_key> ./scripts/vercel-setup.sh

This script will:
  - Create the `sinistro.site` and `www.sinistro.site` domains in Vercel
  - Add environment variables for Production
  - Trigger a production deploy
  - Wait and check DNS/TLS issuance

You must configure your DNS on Hostinger to point your apex -> 76.76.21.21 and www -> cname.vercel-dns.com
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  print_help
  exit 0
fi

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "ERROR: VERCEL_TOKEN must be set in the environment"
  exit 1
fi

if [[ -z "${VITE_SUPABASE_URL:-}" || -z "${VITE_SUPABASE_ANON_KEY:-}" ]]; then
  echo "ERROR: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in the environment"
  exit 1
fi

DOMAIN=sinistro.site
WWW=www.sinistro.site

echo "Adding domains to Vercel (if not present)..."
npx vercel domains add "$DOMAIN" --token "$VERCEL_TOKEN" --confirm || true
npx vercel domains add "$WWW" --token "$VERCEL_TOKEN" --confirm || true

echo "Adding environment variables to Vercel production ..."
set +e
npx vercel env add VITE_SUPABASE_URL "$VITE_SUPABASE_URL" production --token "$VERCEL_TOKEN" --confirm
npx vercel env add VITE_SUPABASE_ANON_KEY "$VITE_SUPABASE_ANON_KEY" production --token "$VERCEL_TOKEN" --confirm
set -e

echo "Triggering production deploy..."
npx vercel --prod --token "$VERCEL_TOKEN" --confirm

echo "Waiting for DNS to point to 76.76.21.21 (Vercel) and provision certificate..."
for i in {1..30}; do
  sleep 10
  ip=$(dig +short "$DOMAIN" | head -n1 || true)
  if [[ "$ip" == "76.76.21.21" ]]; then
    echo "DNS ok; ip=$ip"
    break
  fi
  echo "waiting DNS (attempt $i/30) - current ip: $ip"
done

echo "Checking TLS cert issuance (openssl will output certificate info)..."
openssl s_client -servername "$DOMAIN" -connect "$DOMAIN":443 -showcerts </dev/null 2>/dev/null | sed -n '1,10p'

echo "Done. Check Vercel dashboard or run: npx vercel logs <deploy-url> --since 10m"
