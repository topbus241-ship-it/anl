# 🔄 REATIVAR PROJETO PAUSADO NO NETLIFY

**Data:** 2025-11-13  
**Problema:** Netlify pausou o projeto

---

## 🚨 POR QUE O NETLIFY PAUSA PROJETOS?

1. **Inatividade** - Site não acessado por 30+ dias
2. **Limites excedidos** - Build minutes no plano gratuito (300 min/mês)
3. **Email não verificado** - Conta precisa de verificação
4. **Violação de termos** - Uso inadequado (raro)

---

## ✅ COMO REATIVAR

### Opção 1: Via Dashboard (Recomendado)

1. **Acesse:** https://app.netlify.com
2. **Faça login** na sua conta
3. **Localize o site pausado** (aparecerá com badge "Paused")
4. **Clique no site**
5. **Procure o botão "Restore site"** ou "Resume site"
6. **Confirme a reativação**

### Opção 2: Criar Novo Site

Se o site foi deletado ou não consegue restaurar:

1. **Acesse:** https://app.netlify.com
2. **Clique:** "Add new site" → "Import from GitHub"
3. **Selecione:** `guilhermholiveira-debug/topbusanalise`
4. **Configure:**
   ```
   Build command: npm run build
   Publish directory: dist
   Branch: main
   ```
5. **Adicione variáveis de ambiente:**
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec
   VITE_API_KEY=a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812
   ```
6. **Deploy**

---

## 🆓 ALTERNATIVAS GRATUITAS AO NETLIFY

Se estiver com problemas no Netlify, considere:

### 1. Vercel
- **Site:** https://vercel.com
- **Vantagens:** Integração GitHub, deploys automáticos
- **Configuração:**
  ```bash
  npx vercel
  # Configure variáveis de ambiente no dashboard
  ```

### 2. Cloudflare Pages
- **Site:** https://pages.cloudflare.com
- **Vantagens:** CDN global, SSL gratuito
- **Configuração:**
  ```
  Build command: npm run build
  Output directory: dist
  ```

### 3. GitHub Pages
- **Gratuito com GitHub**
- **Configuração:**
  ```bash
  npm install --save-dev gh-pages
  # Adicione no package.json:
  "homepage": "https://guilhermholiveira-debug.github.io/topbusanalise",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
  ```

### 4. Render
- **Site:** https://render.com
- **Vantagens:** Build automático, SSL
- **Configuração:** Similar ao Netlify

---

## 🔧 DEPLOY ALTERNATIVO: VERCEL

Vou te mostrar como fazer deploy no Vercel (muito similar ao Netlify):

### Passo 1: Criar conta

1. Acesse: https://vercel.com
2. Faça login com GitHub

### Passo 2: Importar projeto

1. Clique em "Add New" → "Project"
2. Selecione: `guilhermholiveira-debug/topbusanalise`
3. Configure:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

### Passo 3: Variáveis de ambiente

Adicione no dashboard:
```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec
VITE_API_KEY=a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812
```

### Passo 4: Deploy

Clique em "Deploy" e aguarde.

---

## 📝 CRIAR ARQUIVO vercel.json

Para configurar headers no Vercel (similar ao netlify.toml):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🚀 SOLUÇÃO RÁPIDA: NETLIFY DROP

Se só precisa fazer deploy rápido sem conta:

1. **Acesse:** https://app.netlify.com/drop
2. **Faça build local:**
   ```bash
   npm run build
   ```
3. **Arraste** a pasta `dist/` para o navegador
4. **Pronto!** Site no ar instantaneamente

⚠️ **Limitação:** Não terá variáveis de ambiente configuradas automaticamente.

---

## 📊 COMPARAÇÃO DE PLATAFORMAS

| Plataforma | Build/Mês | Banda | SSL | GitHub Integration |
|------------|-----------|-------|-----|-------------------|
| Netlify    | 300 min   | 100GB | ✅  | ✅                |
| Vercel     | Ilimitado | 100GB | ✅  | ✅                |
| Cloudflare | Ilimitado | Ilimitado | ✅ | ✅           |
| GitHub Pages | N/A    | 100GB | ✅  | ✅                |
| Render     | 750h/mês  | 100GB | ✅  | ✅                |

---

## ✅ CHECKLIST DE REATIVAÇÃO

- [ ] Verificar status do projeto no Netlify
- [ ] Tentar restaurar site pausado
- [ ] Se não funcionar, criar novo site
- [ ] Configurar variáveis de ambiente
- [ ] Fazer deploy
- [ ] Testar URL gerada
- [ ] Verificar integração com Apps Script

---

## 🆘 SE NADA FUNCIONAR

**Opção de último recurso:**

1. **Delete o site atual no Netlify**
2. **Crie novo site do zero**
3. **Ou migre para Vercel** (mais estável ultimamente)

**Comandos para Vercel:**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
cd /workspaces/topbusanalise
npm run build
vercel --prod
```

---

**Recomendação:** Tente restaurar no Netlify primeiro. Se continuar com problemas, migre para Vercel (é gratuito e muito similar). 🚀
