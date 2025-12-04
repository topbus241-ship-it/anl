# 🔐 CONFIGURAR GITHUB SECRETS PARA NETLIFY DEPLOYMENT

## ⚠️ ERRO ATUAL
```
Context access might be invalid: NETLIFY_AUTH_TOKEN
```

## ✅ SOLUÇÃO

Você precisa configurar 2 secrets no GitHub para o deployment automático funcionar:

### 1️⃣ Obter NETLIFY_AUTH_TOKEN

```bash
# Abrir Netlify com seu navegador
# https://app.netlify.com → User settings → Applications → Tokens → New access token

# Ou usar CLI (se tem netlify instalado):
netlify login
# Depois em ~/.netlify/state.json procure o token
```

**Valor esperado:** String longa tipo `nf_long_... `

### 2️⃣ Obter NETLIFY_SITE_ID

```bash
# Opção 1: Dari Netlify Dashboard
# https://app.netlify.com → Site settings → General → API ID

# Opção 2: Do terminal
netlify sites
# Procure por "Site ID" da aplicação "sinistrotp"
```

**Valor esperado:** UUID tipo `995a44b6-81cb-4918-9239-1d21f45027ec`

### 3️⃣ Configurar no GitHub

1. Vá para: **GitHub → tp2 → Settings → Secrets and variables → Actions**

2. Clique em **New repository secret**

3. Adicione:
   ```
   Name: NETLIFY_AUTH_TOKEN
   Value: <cole seu token Netlify>
   ```

4. Clique em **Add secret**

5. Repita para o Site ID:
   ```
   Name: NETLIFY_SITE_ID
   Value: 995a44b6-81cb-4918-9239-1d21f45027ec
   ```

### 4️⃣ Testar

```bash
# Faça um push para main
git push origin main

# Acompanhe em: GitHub → tp2 → Actions
# Veja o status do workflow "Netlify CI Deploy"
```

---

## 📋 CHECKLISTA DE CONFIGURAÇÃO

- [ ] Token Netlify obtido
- [ ] Site ID Netlify obtido
- [ ] `NETLIFY_AUTH_TOKEN` secret criado no GitHub
- [ ] `NETLIFY_SITE_ID` secret criado no GitHub
- [ ] Push para `main` feito
- [ ] Workflow "Netlify CI Deploy" executando com sucesso
- [ ] Build publicado em `sinistrotp.netlify.app`

---

## 🆘 TROUBLESHOOTING

### "Still getting NETLIFY_AUTH_TOKEN error"
- [ ] Confirmar que o token foi copiado **completamente**
- [ ] Verificar se não há espaços extras no início/fim
- [ ] Tentar gerar um novo token no Netlify

### "Build falha after secrets configurados"
- [ ] Verificar logs em GitHub Actions
- [ ] Pode ser problema de build (não de autenticação)
- [ ] Testar `npm run build` localmente

### "Deploy not showing on Netlify"
- [ ] Verificar que `NETLIFY_SITE_ID` está correto
- [ ] Confirmar que app `sinistrotp` existe no Netlify
- [ ] Verificar logs do workflow

---

## 📚 LINKS ÚTEIS

- Netlify Auth: https://app.netlify.com/user/applications
- Netlify Sites: https://app.netlify.com/teams
- GitHub Secrets: https://github.com/respostainteligentebr2-ctrl/tp2/settings/secrets/actions

---

**Próximo passo:** Após configurar os secrets, faça push e o deployment será automático! 🚀
