# 🚀 DEPLOY NO VERCEL - GUIA RÁPIDO

**Data:** 2025-11-13  
**Motivo:** Créditos do Netlify acabaram  
**Solução:** Migração para Vercel (gratuito e ilimitado)

---

## ✅ POR QUE VERCEL?

- ✅ **Builds ilimitados** (não tem limite de minutos como Netlify)
- ✅ **Gratuito para sempre** em projetos pessoais
- ✅ **Suporte a domínios customizados** (pode usar o domínio atual)
- ✅ **Deploy automático** via GitHub
- ✅ **Mais rápido** que Netlify em média
- ✅ **Mesma facilidade** de uso

---

## 🎯 OPÇÃO 1: DEPLOY VIA DASHBOARD (MAIS RÁPIDO)

### Passo 1: Criar conta
1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel

### Passo 2: Importar projeto
1. No dashboard, clique em **"Add New..."** → **"Project"**
2. Clique em **"Import Git Repository"**
3. Selecione: `guilhermholiveira-debug/topbusanalise`
4. Clique em **"Import"**

### Passo 3: Configurar build
O Vercel detecta automaticamente Vite, mas confirme:
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: ./
```

### Passo 4: Adicionar variáveis de ambiente
Antes de fazer deploy, adicione:

```
VITE_APPS_SCRIPT_URL
Valor: https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec

VITE_API_KEY
Valor: a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812
```

### Passo 5: Deploy
1. Clique em **"Deploy"**
2. Aguarde 1-2 minutos
3. Você receberá uma URL: `https://topbusanalise.vercel.app` ou similar

---

## 🌐 CONFIGURAR SEU DOMÍNIO ATUAL

### Se você tem um domínio apontado para Netlify:

1. No Vercel, vá em **"Settings"** → **"Domains"**
2. Adicione seu domínio (ex: `seudominio.com`)
3. O Vercel mostrará os registros DNS necessários

### Atualizar DNS:

**No seu provedor de domínio** (onde está registrado):

1. Vá na seção **DNS** ou **Nameservers**
2. **Remova** os registros do Netlify:
   ```
   A record: 75.2.60.5 (Netlify)
   CNAME: xxx.netlify.app
   ```

3. **Adicione** os registros do Vercel:
   ```
   A record: 76.76.21.21
   CNAME: cname.vercel-dns.com
   ```

4. Aguarde propagação DNS (5-30 minutos)

---

## 🎯 OPÇÃO 2: DEPLOY VIA CLI

Se preferir linha de comando:

### Passo 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Passo 2: Login
```bash
vercel login
# Use seu email ou GitHub
```

### Passo 3: Deploy
```bash
cd /workspaces/topbusanalise
vercel --prod
```

Siga as instruções:
- Setup and deploy? **Y**
- Which scope? **Sua conta**
- Link to existing project? **N**
- Project name? **topbusanalise**
- Directory? **./** (pressione Enter)
- Override settings? **N**

### Passo 4: Adicionar variáveis de ambiente
```bash
vercel env add VITE_APPS_SCRIPT_URL production
# Cole a URL do Apps Script quando solicitado

vercel env add VITE_API_KEY production
# Cole a API Key quando solicitado
```

### Passo 5: Redeploy com variáveis
```bash
vercel --prod
```

---

## 📊 COMPARAÇÃO: NETLIFY vs VERCEL

| Recurso | Netlify (Pausado) | Vercel (Novo) |
|---------|------------------|---------------|
| Build minutes | 300/mês (acabou) | **Ilimitado** ✅ |
| Bandwidth | 100GB | 100GB |
| Projetos | Ilimitados | Ilimitados |
| Domínios custom | ✅ | ✅ |
| GitHub Integration | ✅ | ✅ |
| Deploy automático | ✅ | ✅ |
| SSL gratuito | ✅ | ✅ |
| Edge Functions | ✅ | ✅ (melhores) |

---

## ✅ VERIFICAÇÃO PÓS-DEPLOY

Após deploy no Vercel:

### 1. Testar URL
- [ ] Acesse a URL fornecida (ex: `topbusanalise.vercel.app`)
- [ ] Verifique se CSS está carregando
- [ ] Teste o dropdown de empresas
- [ ] Veja se cores mudam (TOPBUS azul / BELO MONTE verde)

### 2. Testar formulário
- [ ] Preencha todos os campos
- [ ] Adicione 4 fotos
- [ ] Clique em "Registrar Sinistro"
- [ ] Verifique se recebe protocolo de sucesso

### 3. Verificar integração
- [ ] Abra Google Sheets: https://docs.google.com/spreadsheets/d/1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo
- [ ] Confirme dados na aba TOPBUS ou BELO_MONTE
- [ ] Verifique pasta no Drive: https://drive.google.com/drive/folders/1AQFiXi9-xDulKgO-qZCF3tRrBIsrWcf4

---

## 🔧 ARQUIVOS CRIADOS

- ✅ `vercel.json` - Configuração de headers e cache
- ✅ Build em `dist/` pronto para deploy

---

## 🚀 PRÓXIMOS PASSOS

**AGORA:**
1. Acesse https://vercel.com e faça login com GitHub
2. Importe o projeto `topbusanalise`
3. Adicione as 2 variáveis de ambiente
4. Clique em Deploy
5. **Pronto em 2 minutos!**

**DEPOIS:**
- Configure seu domínio atual no Vercel
- Atualize DNS para apontar para Vercel
- Delete o site no Netlify (se quiser)

---

**Vantagem do Vercel:** Sem limite de builds, perfeito para desenvolvimento contínuo! 🎉

_Tempo estimado: 5 minutos do início ao fim._
