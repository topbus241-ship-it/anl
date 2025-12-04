#!/usr/bin/env bash
set -euo pipefail

# netlify-setup.sh
# Automatiza a criação do site, adição do domínio e configuração de variáveis no Netlify.
# Requisitos:
#   - Node.js + npx
#   - Netlify CLI (npx netlify)
#   - NETLIFY_AUTH_TOKEN no ambiente (se quiser rodar sem prompt)
#   - Valores VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no local

print_help() {
  cat <<EOF
Usage: NETLIFY_AUTH_TOKEN=<token> NETLIFY_SITE_NAME=<site-name> VITE_SUPABASE_URL=<url> VITE_SUPABASE_ANON_KEY=<anon_key> ./scripts/netlify-setup.sh

What it does:
  - Creates or links a Netlify site
  - Adds environment variables
  - Deploys production build
  - Prints instructions for DNS update at Hostinger
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  print_help
  exit 0
fi

if [[ -z "${NETLIFY_AUTH_TOKEN:-}" ]]; then
  echo "ERROR: NETLIFY_AUTH_TOKEN must be set"
  exit 1
fi

if [[ -z "${NETLIFY_SITE_NAME:-}" ]]; then
  echo "ERROR: NETLIFY_SITE_NAME must be set (a friendly unique name)"
  exit 1
fi

if [[ -z "${VITE_SUPABASE_URL:-}" || -z "${VITE_SUPABASE_ANON_KEY:-}" ]]; then
  echo "ERROR: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set"
  exit 1
fi

SITE_NAME="$NETLIFY_SITE_NAME"
DOMAIN=sinistro.site
WWW=www.sinistro.site

echo "Creating or linking a Netlify site with name: $SITE_NAME"
set +e
SITE_JSON=$(npx netlify sites:create --name "$SITE_NAME" --json --auth $NETLIFY_AUTH_TOKEN 2>/dev/null || true)
set -e

if [[ -z "$SITE_JSON" ]]; then
  echo "Site may already exist or create command failed - try link"
  SITE_JSON=$(npx netlify sites:list --json --auth $NETLIFY_AUTH_TOKEN 2>/dev/null | jq -r ".[] | select(.name==\"$SITE_NAME\")")
fi

if [[ -z "$SITE_JSON" ]]; then
  echo "Unable to create or find site automatically. Use 'npx netlify init' or create via Netlify UI and re-run script with NETLIFY_SITE_ID set."
  exit 1
fi

SITE_ID=$(echo "$SITE_JSON" | jq -r '.id')
SITE_URL=$(echo "$SITE_JSON" | jq -r '.site_url')
npx -v >/dev/null 2>&1 || { echo "npx not found. Install Node.js (npm) and npx"; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "jq not found; install jq to parse JSON or run command manually"; exit 1; }
echo "Site created/linked: id=$SITE_ID, url=$SITE_URL"

echo "Adding custom domains: $DOMAIN and $WWW"
npx netlify domains:add $SITE_ID $DOMAIN --auth $NETLIFY_AUTH_TOKEN || true
npx netlify domains:add $SITE_ID $WWW --auth $NETLIFY_AUTH_TOKEN || true

echo "Setting environment variables..."
npx netlify env:set VITE_SUPABASE_URL "$VITE_SUPABASE_URL" production --site $SITE_ID --auth $NETLIFY_AUTH_TOKEN
npx netlify env:set VITE_SUPABASE_ANON_KEY "$VITE_SUPABASE_ANON_KEY" production --site $SITE_ID --auth $NETLIFY_AUTH_TOKEN

echo "Building project..."
npm ci
npm run build

echo "Deploying to production (Netlify)..."
npx netlify deploy --prod --dir=dist --site $SITE_ID --auth $NETLIFY_AUTH_TOKEN

echo "Deploy complete. Links"
npx netlify status --site $SITE_ID --auth $NETLIFY_AUTH_TOKEN

echo "DNS instructions for Hostinger:"
cat <<EOF
  - Set apex (sinistro.site) A records to Netlify's load balancer IPs (check Netlify docs or your site dashboard).
  - Set 'www' as CNAME to $SITE_NAME.netlify.app
  - If Hostinger supports ALIAS/ANAME for the root, add ALIAS to $SITE_NAME.netlify.app
  - Optionally set redirect from apex to www in Netlify site settings
EOF

echo "Done. Check the Netlify dashboard and wait for certificate issuance."
