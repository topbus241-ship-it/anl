## Deploy com Netlify - Guia Rápido

Este documento explica como configurar o deploy automático no Netlify e configurar o domínio `sinistro.site` no Hostinger.

Pré-requisitos
- Conta Netlify
- Conta Hostinger (domínio registrado)
- Netlify CLI (opcional) ou CLI via `npx`
- `NETLIFY_AUTH_TOKEN` (para CLI/CI) e `NETLIFY_SITE_ID` (se já tiver site)

Passos resumidos
1. No Netlify: New Site from Git → conecte ao repositório → escolha a branch `main` → build command: `npm run build` e publish folder: `dist`.
2. No Hostinger: atualize DNS:
   - apex (@): A -> Netlify IP (consulte o painel; tipicamente `75.2.60.5` e `99.83.190.102` mas verifique no painel do Netlify)
   - www: CNAME -> `<your-site>.netlify.app` (ou `<site>.netlify.app` que Netlify fornece)
3. Adicionar domínio no Netlify (Site Settings → Domain Management) e aguardar emissão do certificado.
4. Configure variáveis de ambiente no Netlify (Site Settings → Build & Deploy → Environment variables):
   - `VITE_SUPABASE_URL` -> https://<proj>.supabase.co
   - `VITE_SUPABASE_ANON_KEY` -> chave pública anon
5. Build/Deploy automático: o site será deployado automaticamente em cada `git push` para o branch configurado.

Deploy manual com Netlify CLI

```bash
# exportar token
export NETLIFY_AUTH_TOKEN="<your-token>"
export NETLIFY_SITE_NAME="<unique-site-name>"
export VITE_SUPABASE_URL="https://<your-supabase>.supabase.co"
export VITE_SUPABASE_ANON_KEY="<anon-key>"

# rodar o setup automatizado local:
chmod +x ./scripts/netlify-setup.sh
./scripts/netlify-setup.sh
```

GitHub Actions
1. Adicione `NETLIFY_AUTH_TOKEN` e `NETLIFY_SITE_ID` como secrets no repositório.
2. O workflow em `.github/workflows/netlify-deploy.yml` faz build e deploy a cada push em `main`.

Observações
- Use `npx netlify status --site <site-id> --auth $NETLIFY_AUTH_TOKEN` para consultar status via CLI.
- Se estiver usando Cloudflare, desative proxy (nuvem laranja) para o domínio ou configure SSL corretamente.

---
Se quiser que eu gere automaticamente o `NETLIFY_SITE_ID` ao criar o site com a CLI e colocar o `NETLIFY_SITE_ID` no GitHub Secrets, me diga para prosseguir (precisarei que você me forneça `NETLIFY_AUTH_TOKEN`).
