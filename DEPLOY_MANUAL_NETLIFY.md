# 🚀 GUIA RÁPIDO: DEPLOY MANUAL NO NETLIFY

**Data:** 2025-11-13  
**Build:** ✅ Gerado com sucesso em `dist/`

---

## 📦 BUILD PRONTO

O build foi gerado com sucesso:

```
✓ dist/index.html          0.57 kB │ gzip:  0.36 kB
✓ dist/assets/index-c2a57fc0.css   19.96 kB │ gzip:  4.33 kB
✓ dist/assets/index-f8538956.js   168.47 kB │ gzip: 52.16 kB
✓ built in 3.65s
```

---

## 🌐 OPÇÕES DE DEPLOY

### Opção 1: Deploy Automático via GitHub (RECOMENDADO)

1. **Acesse o Netlify Dashboard**
   - URL: <https://app.netlify.com>
   - Faça login com sua conta

2. **Conecte o Repositório GitHub**
   - Clique em "Add new site" → "Import an existing project"
   - Escolha "GitHub"
   - Selecione o repositório: `guilhermholiveira-debug/topbusanalise`

3. **Configure o Build**

   ```
   Branch to deploy: main
   Build command: npm run build
   Publish directory: dist
   ```

4. **Adicione Variáveis de Ambiente**
   - Vá em "Site settings" → "Environment variables"
   - Adicione:

     ```
     VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec
     VITE_API_KEY=a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812
     ```

5. **Deploy**
   - Clique em "Deploy site"
   - Netlify fará o build automaticamente
   - Após conclusão, você receberá uma URL (ex: `https://seu-site.netlify.app`)

---

### Opção 2: Deploy Manual via Dashboard

1. **Acesse Netlify**
   - <https://app.netlify.com>

2. **Faça Upload Manual**
   - Clique em "Add new site" → "Deploy manually"
   - Arraste a pasta `dist/` para o upload
   - OU use o comando:

     ```bash
     cd /workspaces/topbusanalise
     zip -r dist.zip dist/
     # Faça download do dist.zip e faça upload no Netlify
     ```

3. **Configure Variáveis de Ambiente**
   - Após deploy, vá em "Site settings" → "Environment variables"
   - Adicione as variáveis mencionadas acima

4. **Redeploy**
   - Clique em "Trigger deploy" → "Deploy site"

---

### Opção 3: Netlify Drop (Mais Rápido)

1. **Abra** <https://app.netlify.com/drop>

2. **Arraste a pasta `dist/`** diretamente no navegador

3. **Configure depois:**
   - Acesse o site criado
   - Adicione variáveis de ambiente
   - Configure domínio customizado (se necessário)

---

## ✅ VERIFICAÇÃO PÓS-DEPLOY

Após o deploy, verifique:

### 1. Site Carregando

- [ ] Acesse a URL fornecida pelo Netlify
- [ ] Verifica se CSS está carregando (site com cores e estilos)
- [ ] Verifica se JavaScript está funcionando (dropdown, animações)

### 2. Formulário Funcionando

- [ ] Selecione uma empresa (TOPBUS ou BELO MONTE)
- [ ] Preencha todos os campos obrigatórios
- [ ] Adicione pelo menos 4 fotos
- [ ] Clique em "Registrar Sinistro"
- [ ] Verifique se recebe mensagem de sucesso com protocolo

### 3. Integração com Apps Script

- [ ] Abra Google Sheets: <https://docs.google.com/spreadsheets/d/1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo>
- [ ] Verifique se o registro apareceu na aba correta (TOPBUS ou BELO_MONTE)
- [ ] Confira se todos os dados foram salvos corretamente

### 4. Google Drive

- [ ] Abra: <https://drive.google.com/drive/folders/1AQFiXi9-xDulKgO-qZCF3tRrBIsrWcf4>
- [ ] Verifique se a pasta com protocolo foi criada
- [ ] Confirme se o arquivo `metadata.json` existe

### 5. Headers HTTP (DevTools)

- [ ] Pressione F12 no navegador
- [ ] Vá em "Network" → Recarregue a página
- [ ] Clique em `index.css` ou `index.js`
- [ ] Verifique headers:
  - `Content-Type: text/css` (para CSS)
  - `Content-Type: application/javascript` (para JS)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`

---

## 🎨 NOVO LAYOUT - O QUE ESPERAR

Ao acessar o site, você verá:

✅ **Header moderno** com gradiente slate-900 → slate-800  
✅ **Dropdown elegante** para seleção de empresa  
✅ **Cores dinâmicas:**

- TOPBUS: Azul (#1e40af)
- BELO MONTE: Verde (#047857)  
✅ **Guia visual dos 4 ângulos** de fotos (ilustrações SVG de ônibus)  
✅ **Preview de fotos** com contador e indicador "Faltam X" / "✓ Completo"  
✅ **Animações suaves** (slideDown, fadeIn, hover effects)  
✅ **Design responsivo** para mobile e desktop  

---

## 🔧 TROUBLESHOOTING

### Problema: CSS não carrega (site sem estilos)

**Solução:**

1. Verifique se `netlify.toml` está correto (já está ✅)
2. Faça "Clear cache and deploy" no Netlify
3. Verifique variáveis de ambiente

### Problema: Erro ao submeter formulário

**Solução:**

1. Verifique se variáveis de ambiente estão configuradas
2. Abra Console do navegador (F12) e veja erros
3. Teste o Apps Script diretamente:

   ```bash
   curl "https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec"
   ```

### Problema: Dados não chegam no Sheets

**Solução:**

1. Verifique logs do Apps Script (script.google.com → Execuções)
2. Confirme permissões do Apps Script (ANYONE_ANONYMOUS)
3. Teste função `testDoPost()` manualmente no editor

---

## 📊 CONFIGURAÇÃO ATUAL

### Build

```
Framework: Vite 4.5.14
Publish directory: dist/
Node version: 18.17.0 (via .nvmrc)
```

### Variáveis de Ambiente Necessárias

```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec
VITE_API_KEY=a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812
```

### Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "npm install && npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers de segurança globais
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"

# Cache para HTML
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"

# Cache para assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 🎯 PRÓXIMOS PASSOS

1. **Escolha uma opção de deploy acima**
2. **Configure variáveis de ambiente**
3. **Aguarde o build completar**
4. **Teste o site na URL fornecida**
5. **Verifique integração com Sheets/Drive**

---

**Build pronto e aguardando deploy!** 🚀

_Para deploy automático futuro, conecte o repositório GitHub ao Netlify uma vez. Depois, cada push na branch `main` fará deploy automático._
