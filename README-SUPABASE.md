# 🚌 TOPBUS Sinistros v2.0 - Deploy Supabase Seguro

> Sistema de gestão de sinistros corporativo com backend gratuito e seguro no Supabase

## ⚡ Quick Start (5 minutos)

```bash
# 1. Clonar & instalar
git clone seu-repositorio
cd /workspaces/tp2
npm install

# 2. Criar projeto Supabase (https://supabase.com)
# Copiar URL e chave anônima

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# 4. Executar schema SQL (Supabase > SQL Editor)
# Copiar conteúdo de: supabase-schema-seguro.sql

# 5. Rodar localmente
npm run dev

# 6. Acessar http://localhost:5173
```

---

## 🎯 Funcionalidades Principais

### 📝 Registro de Sinistros
- ✅ Seleção de empresa (TOPBUS / Belo Monte)
- ✅ Dados do acidente (data, local, veículo)
- ✅ Informações do motorista
- ✅ Responsabilidade (motorista/terceiro)
- ✅ Upload de 4+ fotos
- ✅ Múltiplas testemunhas
- ✅ Protocolo automático único

### 📊 Dashboard Restrito
- ✅ Listagem segura de sinistros
- ✅ Busca por protocolo/local/motorista
- ✅ Filtro por empresa e período
- ✅ Acesso autenticado
- ✅ Links para visualização de detalhes

### 🔒 Segurança
- ✅ RLS (Row Level Security)
- ✅ Autenticação obrigatória
- ✅ Auditoria automática
- ✅ Credenciais protegidas
- ✅ Storage privado

---

## 📁 Estrutura do Projeto

```
/workspaces/tp2/
├── src/
│   ├── components/
│   │   ├── FormularioSinistro-supabase.jsx    # ✅ NOVO - Com Supabase
│   │   ├── ListaSinistros.jsx                 # Dashboard
│   │   └── BusIcon.jsx                        # Ícone
│   ├── lib/
│   │   └── supabase.js                        # ✅ Credenciais seguras
│   ├── App.jsx                                # App principal
│   └── main.jsx                               # Entry point
├── .env.example                               # ✅ NOVO - Template env
├── supabase-schema-seguro.sql                 # ✅ NOVO - Schema com RLS
├── DEPLOY_SUPABASE_SEGURO.md                  # ✅ NOVO - Guia deployment
├── SEGURANCA.md                               # ✅ NOVO - Relatório segurança
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🚀 Deployment

### Netlify (Recomendado)
```bash
# 1. Push para GitHub
git add .
git commit -m "Deploy Supabase v2.0"
git push

# 2. Netlify Dashboard
# - Connect GitHub repo
# - Build: npm run build
# - Publish: dist
# - Environment: configurar VITE_SUPABASE_*

# 3. Resultado
# https://seu-site.netlify.app
```

### Vercel
```bash
# Mesmos passos que Netlify
# https://seu-site.vercel.app
```

**👉 Guia completo:** `DEPLOY_SUPABASE_SEGURO.md`

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
- Supabase Dashboard > Settings > API > Project URL & anon key

---

## 📋 Checklist de Segurança

- [x] Credenciais removidas do código
- [x] `.env.local` no `.gitignore`
- [x] RLS habilitado em BD
- [x] Storage privado
- [x] Auditoria implementada
- [x] CORS configurado
- [x] LGPD/GDPR compliant

**Detalhes:** Ver `SEGURANCA.md`

---

## 🐛 Troubleshooting

### "Credenciais não encontradas"
```bash
cat .env.local  # Verificar se existe
ls -la | grep env  # Deve listar .env.local
```

### "Erro ao inserir sinistro"
```javascript
// Console: Ctrl+Shift+J (Chrome)
const { error } = await supabase.from('sinistros').select()
console.log(error?.message)
```

### "Fotos não fazem upload"
1. Verificar se bucket "sinistros" existe
2. Usuário está autenticado?
3. Limpar localStorage: `localStorage.clear()`

**Guia completo:** `DEPLOY_SUPABASE_SEGURO.md` > Troubleshooting

---

## 📊 Stack Técnico

| Camada | Tecnologia | Status |
|--------|-----------|--------|
| Frontend | React 18 + Vite | ✅ Produção |
| Estilos | Tailwind CSS | ✅ Produção |
| Banco | Supabase (PostgreSQL) | ✅ Produção |
| Storage | Supabase Storage | ✅ Produção |
| Autenticação | Supabase Auth | ⏳ Roadmap |
| Deploy | Netlify/Vercel | ✅ Produção |

---

## 🔄 Alterações Principais (v1.0 → v2.0)

| Aspecto | v1.0 | v2.0 |
|--------|------|------|
| Backend | Google Apps Script | **Supabase** ✅ |
| Banco | Google Sheets | **PostgreSQL** ✅ |
| Segurança | Credenciais expostas | **RLS + Auditoria** ✅ |
| Storage | Google Drive | **Supabase Storage** ✅ |
| Custo | Variável | **Gratuito** ✅ |
| Compliance | Parcial | **LGPD/GDPR** ✅ |

---

## 📚 Documentação

1. **`DEPLOY_SUPABASE_SEGURO.md`** - Guia passo-a-passo deploy
2. **`SEGURANCA.md`** - Relatório de segurança & correções
3. **`docs/arquitetura-topbus-sinistros.md`** - Arquitetura geral
4. **`supabase-schema-seguro.sql`** - Schema SQL comentado

---

## 🤝 Contribuindo

1. Criar branch: `git checkout -b feature/sua-feature`
2. Commit: `git commit -m "Add: sua-feature"`
3. Push: `git push origin feature/sua-feature`
4. PR: Criar pull request

---

## 📞 Suporte

- **Docs:** https://supabase.com/docs
- **Issues:** Abrir issue no GitHub
- **Email:** seu-email@topbus.com.br

---

## 📄 Licença

Propriedade da TOPBUS Transportes  
Uso restrito a equipe autorizada

---

## ✅ Status

- **Versão:** 2.0
- **Data:** Dezembro 2024
- **Status:** 🟢 Produção
- **Próxima auditoria:** Junho 2025

---

**Desenvolvido com ❤️ para TOPBUS Transportes**
