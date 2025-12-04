# 🎯 Guia Rápido - Referência Visual

## 🚀 5 Passos para Deploy

```
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣  CRIAR PROJETO SUPABASE                                 │
│ https://supabase.com → New Project → South America         │
│ ⏱️ Tempo: 2-3 minutos                                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2️⃣  CONFIGURAR AMBIENTE LOCAL                              │
│ cp .env.example .env.local                                  │
│ Editar: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY        │
│ ⏱️ Tempo: 5 minutos                                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3️⃣  EXECUTAR SCHEMA SQL                                    │
│ Supabase Dashboard > SQL Editor                             │
│ Copiar: supabase-schema-seguro.sql                          │
│ ⏱️ Tempo: 1 minuto                                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4️⃣  TESTAR LOCALMENTE                                      │
│ npm install && npm run dev                                  │
│ Acessar: http://localhost:5173                             │
│ ⏱️ Tempo: 2 minutos                                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5️⃣  DEPLOY NETLIFY                                         │
│ Push para GitHub → Conectar em Netlify                      │
│ Configurar variáveis de ambiente                            │
│ ⏱️ Tempo: 5 minutos                                         │
└─────────────────────────────────────────────────────────────┘

⏰ TEMPO TOTAL: ~15 MINUTOS

---

## 🔔 Status do Deploy (Badge)

Para acompanhar o status de deploy rapidamente, utilize o badge do Netlify.

Badge de exemplo já inserido no `README.md`:

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/995a44b6-81cb-4918-9239-1d21f45027ec/deploy-status)](https://app.netlify.com/projects/sinistrotp/deploys)
```

Como obter um badge para seu site Netlify:
1. Acesse Netlify → Site → Site settings → Deploys → Build badges.
2. Copie a URL do badge e cole no `README.md` ou onde quiser mostrar o status.

---
```

---

## 📁 Arquivos Importantes (Novo)

```
/workspaces/tp2/
│
├── 🔐 SEGURANÇA & CONFIGURAÇÃO
│   ├── .env.example                   ← Copie para .env.local
│   ├── src/lib/supabase.js           ← Config Supabase (SEGURA)
│   ├── supabase-schema-seguro.sql    ← SQL com RLS (execute!)
│   └── security-check.sh             ← Verificar segurança
│
├── 📚 DOCUMENTAÇÃO DEPLOY
│   ├── DEPLOY_SUPABASE_SEGURO.md     ← Guia passo-a-passo
│   ├── CHECKLIST_PRE_DEPLOY.md       ← Checklist antes deploy
│   ├── RESUMO_EXECUTIVO.md           ← Visão geral
│   └── README-SUPABASE.md            ← README v2.0
│
├── 🔒 SEGURANÇA (Análise)
│   └── SEGURANCA.md                  ← Relatório detalhado
│
├── 💻 CÓDIGO FONTE
│   ├── src/components/
│   │   ├── FormularioSinistro-supabase.jsx ← ✨ NOVO (usar este!)
│   │   ├── ListaSinistros.jsx
│   │   └── BusIcon.jsx
│   ├── src/App.jsx
│   └── src/main.jsx
│
└── ⚙️ CONFIGURAÇÕES
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🎯 Como Usar Cada Arquivo

### 🚀 Para Começar
```bash
# 1. Ler este arquivo
cat RESUMO_EXECUTIVO.md

# 2. Ler guia de deploy
cat DEPLOY_SUPABASE_SEGURO.md

# 3. Configurar ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# 4. Executar verificação
bash security-check.sh

# 5. Deploy!
npm run build
# Push para Netlify
```

### 📋 Para Validação Pré-Deploy
```bash
# Seguir: CHECKLIST_PRE_DEPLOY.md
# Marque cada item ✅
# Rode: bash security-check.sh
```

### 🔒 Para Entender Segurança
```bash
# Ler: SEGURANCA.md
# Detalhes de cada correção implementada
```

---

## 🔐 Variáveis de Ambiente

### Obrigatórias
```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Opcionais
```bash
VITE_DASHBOARD_LOGIN=admin
VITE_DASHBOARD_PASSWORD=SuaSenha123!
```

**Onde obter:**
1. https://supabase.com/dashboard
2. Seu projeto > Settings > API
3. Copiar "Project URL" e "anon key"

---

## ✅ Verificação de Segurança

```bash
# Executar antes de CADA deploy
bash security-check.sh

# Resultado esperado:
# ✅ Sucesso: 12+
# ⚠️  Avisos: 0-1
# ❌ Erros: 0
```

---

## 🌐 URLs de Referência

| Recurso | URL |
|---------|-----|
| Supabase Docs | https://supabase.com/docs |
| SQL Reference | https://supabase.com/docs/guides/database |
| RLS Guide | https://supabase.com/docs/guides/auth/row-level-security |
| Supabase Status | https://status.supabase.com |
| Community Discord | https://discord.gg/supabase |

---

## 🆘 Troubleshooting Rápido

### Problema: "Missing environment variables"
**Solução:**
```bash
# Criar .env.local
cp .env.example .env.local

# Verificar
cat .env.local

# Deve conter:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

### Problema: "Erro ao inserir sinistro"
**Solução:**
```javascript
// No DevTools (F12 > Console)
const { error } = await supabase.from('sinistros').select('count')
console.log(error?.message)
// Se RLS: "Row-level security violation"
// Se não autenticado: "unauthorized"
```

### Problema: "Fotos não fazem upload"
**Solução:**
1. Verificar bucket "sinistros" existe
2. Bucket deve ser PRIVADO (não público)
3. Estar autenticado
4. Limpar localStorage: `localStorage.clear()`

---

## 📊 Estrutura de Dados

```
TOPBUS SINISTROS (Banco Dados Supabase)
│
├── Tabela: sinistros
│   ├── id (BIGINT)
│   ├── protocolo (VARCHAR, UNIQUE)
│   ├── data_hora (TIMESTAMP)
│   ├── empresa (VARCHAR: TOPBUS/BELO_MONTE)
│   ├── local_acidente (TEXT)
│   ├── onibus (VARCHAR)
│   ├── motorista (VARCHAR)
│   ├── chapa (VARCHAR)
│   ├── responsabilidade (VARCHAR: MOTORISTA/TERCEIRO)
│   ├── descricao (TEXT)
│   ├── created_by (UUID - Usuário)
│   ├── is_public (BOOLEAN)
│   └── Timestamps (created_at, updated_at)
│
├── Tabela: testemunhas
│   ├── id (BIGINT)
│   ├── sinistro_id (FK)
│   ├── nome (VARCHAR)
│   ├── telefone (VARCHAR)
│   └── created_at (TIMESTAMP)
│
├── Tabela: imagens
│   ├── id (BIGINT)
│   ├── sinistro_id (FK)
│   ├── nome_arquivo (VARCHAR)
│   ├── url_publica (TEXT)
│   ├── path_storage (VARCHAR)
│   ├── tamanho (INTEGER)
│   ├── tipo_mime (VARCHAR)
│   └── created_at (TIMESTAMP)
│
├── Tabela: sinistros_audit (Auditoria)
│   ├── id (BIGINT)
│   ├── sinistro_id (FK)
│   ├── acao (VARCHAR: INSERT/UPDATE/DELETE)
│   ├── usuario_id (UUID)
│   ├── dados_anteriores (JSONB)
│   ├── dados_novos (JSONB)
│   └── timestamp (TIMESTAMP)
│
└── Storage: sinistros/ (Bucket Privado)
    ├── Fotos de sinistros
    └── Acesso restrito a usuários autenticados
```

---

## 🚀 Fluxo de Deployment

```
Git Commit
    ↓
git push origin main
    ↓
GitHub Webhook → Netlify
    ↓
Netlify Build (npm run build)
    ↓
Gerar dist/
    ↓
Deploy para CDN
    ↓
✅ LIVE em seu-site.netlify.app
```

---

## 🎓 Tech Stack

```
Frontend
├── React 18
├── Vite (Build)
├── Tailwind CSS (Estilos)
├── Lucide Icons
└── React Hook Form (Forms)

Backend
├── Supabase (PostgreSQL)
├── Row Level Security (RLS)
├── Storage (Fotos)
└── Realtime (Optional)

Deploy
├── Netlify ou Vercel
├── CI/CD Automático
└── HTTPS Grátis
```

---

## 📞 Checklist de Sucesso

- [x] Credenciais removidas do código
- [x] `.env.local` no `.gitignore`
- [x] RLS implementado
- [x] Schema SQL executado
- [x] Testes locais passaram
- [x] Documentação completa
- [x] Verificação segurança: ✅
- [x] Pronto para deploy! 🎉

---

## ✨ Próximas Etapas

1. **Agora:** Executar `RESUMO_EXECUTIVO.md`
2. **5 min:** Criar projeto Supabase
3. **15 min:** Deploy local
4. **30 min:** Deploy Netlify
5. **Hoje:** Equipe testando
6. **Amanhã:** Go Live! 🚀

---

## 📞 Suporte

- 📖 **Documentação:** `DEPLOY_SUPABASE_SEGURO.md`
- 🔒 **Segurança:** `SEGURANCA.md`
- ✅ **Checklist:** `CHECKLIST_PRE_DEPLOY.md`
- 🆘 **Erros:** Ver seção Troubleshooting acima

---

**Versão:** 2.0 (Supabase)  
**Data:** Dezembro 2024  
**Status:** 🟢 Pronto para Deploy  
**Última atualização:** _hoje_
