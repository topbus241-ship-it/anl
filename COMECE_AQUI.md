# 🚀 INÍCIO RÁPIDO - TOPBUS SINISTROS v2

## ⏱️ Tempo estimado: 15 minutos

### 1️⃣ Preparação (5 min)

```bash
# Ir para pasta do projeto
cd /workspaces/tp2/topbus-sinistros

# Criar arquivo de ambiente
cp .env.local.example .env.local

# EDITAR .env.local com suas credenciais Supabase:
# REACT_APP_SUPABASE_URL=https://howaipkfjdtvdyvekwyok.supabase.co
# REACT_APP_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 2️⃣ Instalar Dependências (3 min)

```bash
npm install
```

### 3️⃣ Executar Localmente (2 min)

```bash
npm start
# Abre automaticamente http://localhost:3000
```

### 4️⃣ Testar (5 min)

- [ ] Preencha o formulário com dados de teste
- [ ] Selecione uma imagem
- [ ] Opcionalmente grave áudio
- [ ] Aceite GPS + LGPD
- [ ] Clique "Enviar"
- [ ] Veja mensagem de sucesso com protocolo

### 5️⃣ Verificar no Supabase (3 min)

```sql
-- Supabase Dashboard → SQL Editor
SELECT * FROM sinistros ORDER BY criado_em DESC LIMIT 1;
```

---

## 🌐 Para Deploy em Produção

1. **Primeiro deploy Supabase Schema:**
   - Abra `DEPLOY_SUPABASE_SCHEMA.md`
   - Siga os passos 2.1 a 2.6

2. **Deploy Netlify:**
   ```bash
   git push origin main
   # Netlify inicia automaticamente
   ```

3. **Configurar Domínio (Opcional):**
   - Leia: `DEPLOY_SUPABASE_SCHEMA.md` (seção 4)

---

## 📚 Documentação Completa

- **Checklist:** `CHECKLIST_DEPLOY_FINAL.md` (9 fases)
- **Resumo Executivo:** `RESUMO_FINAL.md`
- **Deploy Schema SQL:** `DEPLOY_SUPABASE_SCHEMA.md`
- **Arquitetura:** `docs/arquitetura-topbus-sinistros.md`

---

## 🆘 Problemas Comuns

| Erro | Solução |
|------|---------|
| `REACT_APP_SUPABASE_URL undefined` | Confirmar `.env.local` existe e foi editado |
| `Cannot find module 'lucide-react'` | Rodar `npm install` novamente |
| `Port 3000 already in use` | Usar `PORT=3001 npm start` |
| Imagens não carregam | Verificar bucket `sinistros` no Supabase |

---

## ✨ Features Principais

✅ Formulário intuitivo  
✅ Gravação de áudio  
✅ Upload de imagens  
✅ Modo escuro/claro  
✅ Conformidade LGPD  
✅ Deploy automático  

---

**Versão:** 2.0.0  
**Status:** Pronto para produção ✅
