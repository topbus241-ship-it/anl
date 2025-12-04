# 🚀 Guia Completo: Deploy Sistema de Sinistros no Supabase

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Supabase](#configuração-supabase)
3. [Setup Local](#setup-local)
4. [Deploy](#deploy)
5. [Segurança RLS](#segurança-rls)
6. [Troubleshooting](#troubleshooting)

---

## 🔍 Pré-requisitos

- Conta Supabase (gratuita em https://supabase.com)
- Node.js 18+ instalado
- Git configurado
- Um host para deploy (Netlify, Vercel ou similar)

---

## ⚙️ Configuração Supabase

### Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em **"New Project"** ou **"Novo Projeto"**
3. Escolha uma organização (ou crie uma nova)
4. Defina:
   - **Project name**: `topbus-sinistros`
   - **Database password**: Senha forte (salve em local seguro)
   - **Region**: `South America - São Paulo` (ou mais próximo)
5. Clique **"Create new project"** e aguarde (2-3 min)

### Passo 2: Obter Credenciais

1. Após projeto criado, vá para **Settings > API**
2. Copie os valores:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **anon key**: Comece com `eyJ...`
   - **service_role key**: (Salve em local seguro, não compartilhe)

### Passo 3: Executar Schema SQL

1. No dashboard Supabase, vá para **SQL Editor**
2. Clique **"New Query"**
3. Copie todo conteúdo de `/workspaces/tp2/supabase-schema-seguro.sql`
4. Cole na query
5. Clique **"Run"** ▶️
6. Aguarde sucesso (verificar em cada seção)

### Passo 4: Criar Bucket de Storage

1. Vá para **Storage > Buckets**
2. Clique **"New Bucket"**
3. Configure:
   - **Name**: `sinistros`
   - **Public bucket**: ☐ (deixar DESMARCADO para segurança)
4. Clique **"Create Bucket"**

### Passo 5: Configurar Autenticação (Opcional)

Para criar usuários administradores:

1. Vá para **Authentication > Users**
2. Clique **"Invite"**
3. Digite email do administrador
4. Supabase enviará link de convite

---

## 🏠 Setup Local

### Passo 1: Clonar e Instalar

```bash
cd /workspaces/tp2
npm install
```

### Passo 2: Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env.local

# Editar com suas credenciais
nano .env.local
```

**Conteúdo do `.env.local`:**
```dotenv
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (copiar do dashboard)
VITE_DASHBOARD_LOGIN=admin
VITE_DASHBOARD_PASSWORD=SuaSenhaSegura123!
```

### Passo 3: Testar Localmente

```bash
npm run dev
```

Acesse: `http://localhost:5173`

**Teste:**
1. ✅ Preencha o formulário
2. ✅ Envie um sinistro
3. ✅ Verifique se aparece no Supabase Dashboard > Table Editor > `sinistros`

---

## 🚀 Deploy

### Opção A: Deploy no Netlify (Recomendado)

#### 1. Conectar Repositório

```bash
cd /workspaces/tp2
git add .
git commit -m "Deploy seguro com Supabase"
git push origin main
```

#### 2. No Netlify Dashboard

1. Acesse [netlify.com](https://netlify.com)
2. Clique **"New site from Git"**
3. Selecione seu repositório GitHub
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: Clique **"Add"** e configure:
     - `VITE_SUPABASE_URL`: Seu URL Supabase
     - `VITE_SUPABASE_ANON_KEY`: Sua chave anônima
     - `VITE_DASHBOARD_LOGIN`: admin
     - `VITE_DASHBOARD_PASSWORD`: Sua senha

5. Clique **"Deploy"**
6. Aguarde build (~2-3 min)

#### 3. Configurar CORS no Supabase

1. No Supabase Dashboard, vá para **Settings > API**
2. Procure por **CORS settings**
3. Adicione seu domínio Netlify:
   ```
   https://seu-site.netlify.app
   ```

### Opção B: Deploy no Vercel

#### 1. Push para GitHub (igual Netlify)

#### 2. No Vercel Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Clique **"Import Project"**
3. Selecione seu repositório
4. Em **Environment Variables**, adicione mesmas variáveis que Netlify
5. Clique **"Deploy"**

### Opção C: Deploy Manual em Qualquer Host

```bash
# Build local
npm run build

# Arquivos gerados em: /dist
# Upload via FTP, rsync ou painel do host
```

---

## 🔐 Segurança RLS

### Verificar Policies Aplicadas

```sql
-- No Supabase SQL Editor:
SELECT * FROM pg_policies WHERE tablename = 'sinistros';
```

### Fluxo de Segurança

**Sem Autenticação:**
- ✅ Pode ler sinistros com `is_public = true`
- ❌ Não pode criar/editar/deletar

**Com Autenticação:**
- ✅ Pode gerenciar apenas seus próprios sinistros
- ✅ Admin pode gerenciar todos (via JWT role)

### Testar RLS

1. **Como visitante (sem login):**
   ```bash
   curl -H "Authorization: Bearer INVALID" \
     https://seu-projeto.supabase.co/rest/v1/sinistros
   ```
   Resultado: Apenas públicos ou erro 401

2. **Como autenticado:**
   - Use credentials corretas
   - Resultado: Pode ver/editar próprios registros

---

## 🛡️ Checklist de Segurança

- [ ] ✅ Credenciais removidas do código
- [ ] ✅ `.env.local` no `.gitignore`
- [ ] ✅ RLS habilitado em todas as tabelas
- [ ] ✅ Policies corrigidas (não "Allow all")
- [ ] ✅ Storage bucket é privado
- [ ] ✅ CORS configurado apenas para seu domínio
- [ ] ✅ Service role key não exposta no frontend
- [ ] ✅ Backups automáticos habilitados

---

## 🔧 Troubleshooting

### "Missing Supabase environment variables"

**Solução:**
```bash
# Verificar .env.local existe
cat .env.local

# Verificar variáveis
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### "Falha ao inserir sinistro"

**Causas possíveis:**
1. RLS policy bloqueando (não autenticado)
   - Solução: Fazer login ou ajustar policy

2. Validação de dados
   - Solução: Verificar tipos de dados no schema

3. Storage não encontrado
   - Solução: Criar bucket "sinistros"

**Debug:**
```javascript
// No console do navegador:
const { data, error } = await supabase
  .from('sinistros')
  .select()
console.log(error?.message)
```

### "Autorização negada ao fazer upload"

**Solução:**
1. Verificar se bucket "sinistros" existe
2. Verificar se está autenticado
3. Limpar localStorage: `localStorage.clear()`
4. Fazer login novamente

### "CORS error"

**Solução:**
1. No Supabase: Settings > API > CORS settings
2. Adicionar seu domínio completo (com https://)
3. Esperar 2-3 minutos para propagação

---

## 📊 Monitoramento

### Logs no Supabase

1. Vá para **Logs** no menu lateral
2. Selecione tipo: **All Logs** ou **API**
3. Procure por erros recentes

### Métricas

1. **Settings > Database**
2. Verifique uso de storage, conexões, etc.

---

## 🔄 Manutenção

### Rotacionar Chaves

**A cada 90 dias:**

1. Supabase Dashboard > Settings > API
2. Clique ícone "rotate" próximo às chaves
3. Atualize `.env.local` e variáveis do host

### Backups

Supabase faz backups automáticos a cada 24h (plano gratuito).

Para backup manual:
1. Settings > Backups
2. Clique **"Request backup"**

---

## ✅ Próximos Passos

1. **Autenticação com Email:**
   - Implementar login com Supabase Auth

2. **Dashboard Avançado:**
   - Adicionar filtros, exportar CSV, gráficos

3. **Notificações:**
   - Email ao registrar sinistro
   - Webhooks para integração externa

4. **Mobile App:**
   - React Native + Expo com Supabase

---

## 📞 Suporte

- Docs Supabase: https://supabase.com/docs
- Community: https://discord.gg/supabase
- Issues: Abrir issue no repositório

---

**Última atualização:** Dezembro 2024  
**Versão:** 2.0 (Supabase)
