# 📋 Checklist Pré-Deploy - TOPBUS Sinistros v2.0

## ✅ Antes de Fazer Deploy

### 🔐 Segurança
- [ ] Rodou `bash security-check.sh` (resultado: ✅)
- [ ] Confirmou: `.env.local` não tem credenciais expostas
- [ ] Verificou: Nenhuma chave Supabase no código
- [ ] Confirmou: `.env.local` está no `.gitignore`
- [ ] Criou projeto no Supabase (https://supabase.com)
- [ ] Copiar URL e chave anônima para `.env.local`
- [ ] Executar schema SQL em Supabase > SQL Editor
- [ ] Criar bucket "sinistros" em Supabase > Storage

### 📝 Configuração
- [ ] `.env.local` preenchido com credenciais reais:
  ```
  VITE_SUPABASE_URL=https://seu-projeto.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ...
  VITE_DASHBOARD_LOGIN=admin
  VITE_DASHBOARD_PASSWORD=SuaSenha123!
  ```
- [ ] Testou localmente: `npm run dev`
- [ ] Formulário submete sem erros
- [ ] Dados aparecem em Supabase Dashboard

### 📦 Build
- [ ] Rodou: `npm install`
- [ ] Rodou: `npm run build`
- [ ] Pasta `dist/` foi criada
- [ ] Arquivos estáticos em `dist/` parecem OK

### 🚀 Deployment (Netlify)
- [ ] Conectou repositório GitHub ao Netlify
- [ ] Configurou build command: `npm run build`
- [ ] Configurou publish directory: `dist`
- [ ] Adicionou variáveis de ambiente no Netlify:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_DASHBOARD_LOGIN`
  - `VITE_DASHBOARD_PASSWORD`
- [ ] Fez deploy (seu-site.netlify.app)

### 🌐 Pós-Deployment
- [ ] Acessou URL de produção
- [ ] Testou formulário com dados reais
- [ ] Fotos fazem upload sem erro
- [ ] Dados aparecem em Supabase Dashboard

### 🔒 Supabase Config (Dashboard)
- [ ] RLS habilitado em todas as tabelas
- [ ] Policies aplicadas corretamente
- [ ] Bucket "sinistros" é privado
- [ ] CORS configurado:
  - [ ] Adicionar seu domínio Netlify/Vercel
- [ ] Backups automáticos habilitados

### 📊 Testes
- [ ] Registrou um sinistro de teste
- [ ] Viu protocolo gerado: `SIN-TB-20241204-XXXXXX-XXXX`
- [ ] 4+ fotos foram enviadas
- [ ] Testemunhas foram registradas
- [ ] Acesso ao painel (login/senha)

### 📞 Pós-Deploy
- [ ] Comunicar equipe: Sistema está online
- [ ] Compartilhar URL: https://seu-site.netlify.app
- [ ] Credenciais painel: secretamente (WhatsApp, 1Password, etc)
- [ ] Coletar feedback inicial

---

## 🚨 Se Algo Não Funcionar

### "Deploy falhou"
- [ ] Verificar Netlify > Deploys > logs
- [ ] Procurar por erros em "npm run build"
- [ ] Verificar se `.env.local` está em variáveis Netlify

### "Credenciais não encontradas"
```bash
# Verificar .env.local
cat .env.local

# Ou configurar no Netlify:
# Site settings > Build & Deploy > Environment
```

### "Fotos não fazem upload"
- [ ] Verificar se bucket "sinistros" existe
- [ ] Verificar se usuário está autenticado
- [ ] Limpar localStorage e tentar novamente

### "RLS error ao inserir"
- [ ] Verificar SQL executou sem erros
- [ ] Verificar Supabase > Policies
- [ ] Testar com usuário autenticado

---

## 📞 Suporte Rápido

| Problema | Solução |
|----------|---------|
| Chaves expostas | Ver: `SEGURANCA.md` |
| Deploy Netlify | Ver: `DEPLOY_SUPABASE_SEGURO.md` |
| RLS/Políticas | Ver: `supabase-schema-seguro.sql` |
| Erro de formulário | Abrir DevTools (F12) > Console |

---

## 📅 Próximas Etapas (Roadmap)

- [ ] Autenticação com email (Supabase Auth)
- [ ] 2FA para admins
- [ ] Alertas via email ao registrar sinistro
- [ ] Dashboard com gráficos
- [ ] Export CSV de sinistros
- [ ] Integração com Zapier/Make.com
- [ ] Mobile app (React Native)

---

## ✍️ Assinado Por

- **Data:** _____/_____/_______
- **Responsável:** ___________________________
- **Verificado por:** ___________________________

---

**Última atualização:** Dezembro 2024  
**Versão:** 2.0 - Supabase  
**Status:** Pronto para Deploy ✅
