# Plano de Alinhamento: Código ↔ Documentação PDF

## Status Atual (04/12/2025)

✅ **Completado:**
- GravadorAudio com Web Audio API (áudio gravado diretamente no frontend)
- Tailwind config atualizado com sistema de design completo
- Netlify workflow corrigido (aponta para `topbus-sinistros/build`)
- `.env.example` criado com variáveis Supabase
- tailwindcss-animate instalado

## Gaps Identificados

### 1. Backend: Google Apps Script vs Supabase
**Situação:**
- Código atual: Integrado com `REACT_APP_APPS_SCRIPT_URL` (Google Apps Script)
- PDF/Specs: Define uso de Supabase (Tables: sinistros, testemunhas, imagens, documentos_complementares)

**Ação necessária:**
- [ ] Decidir: Usar Supabase ou Google Apps Script?
- Se Supabase: Substituir `App.jsx` e `FormularioSinistro.jsx` para usar `supabase-js` client
- Se Apps Script: Atualizar PDF para refletir arquitetura atual

### 2. Componentes React vs Documentação
**Componentes atuais:**
- `FormularioSinistro.jsx` - Formulário com upload de fotos + novo GravadorAudio
- `ListaSinistros.jsx` - Lista/Dashboard simples com filtros básicos
- `App.jsx` - Integração com Apps Script

**Specs do PDF exigem:**
- [ ] Dashboard com estatísticas em cards (total, recentes, distribuição)
- [ ] Gráfico BI (funil invertido)
- [ ] Filtros avançados (data, status, responsável)
- [ ] Setor de análise com campos de parecer e status
- [ ] Modal de detalhes com fotos integradas
- [ ] Exportação em PDF
- [ ] Tema claro/escuro (theme toggle discreto)

### 3. Design & Animações
**Implementado:**
- GravadorAudio com UI básica
- Tailwind com animações (fade-in, scale-in, rotate-guide, pulse-soft)

**Faltam no UI dos componentes:**
- [ ] Glassmorphism com transparência (backdrop-blur)
- [ ] Paleta teal/azul escuro conforme PDF
- [ ] Aplicar animações Tailwind nos componentes
- [ ] Theme toggle discreto nos cantos (claro/escuro)

### 4. Documentos Complementares
**PDF menciona:**
- Upload de BO, CNH, documentos, áudio (além de fotos)

**Atual:**
- [ ] FormularioSinistro tem apenas foto + novo áudio
- [ ] Criar setor expansível para "Documentos complementares"

### 5. Banco de Dados
**PDF define schema completo:**
- Tables: sinistros, testemunhas, imagens, documentos_complementares
- RLS policies, índices, triggers de auditoria

**Atual:**
- Schema não foi criado em Supabase
- Usando Apps Script como backend

**Ação:**
- [ ] Se optar por Supabase: Executar `supabase-schema-seguro.sql` no projeto

## Próximos Passos (Prioridade)

### Fase 1: Decisão Backend (CRÍTICO)
1. Confirmar se usa Supabase ou Google Apps Script
2. Se Supabase:
   - Criar projeto em supabase.com
   - Executar schema SQL
   - Obter credenciais (URL, anon key)
   - Adicionar a `.env.local`

### Fase 2: Atualizar Componentes React
1. Reescrever App.jsx para Supabase (ou Apps Script conforme decisão)
2. Adicionar suporte a documentos_complementares em FormularioSinistro
3. Criar Dashboard robusto com:
   - Cards de estatísticas
   - Gráfico funil
   - Filtros avançados
   - Modal de detalhes

### Fase 3: Design & UX
1. Aplicar glassmorphism e paleta de cores
2. Integrar theme toggle
3. Aplicar animações Tailwind
4. Garantir responsividade (mobile-first)

### Fase 4: Features Avançadas
1. Exportação PDF
2. Sistema de status e workflow
3. Campos de análise e parecer
4. Notificações

### Fase 5: Deploy & Testing
1. Validar build local
2. Testar em Netlify staging
3. Configurar DNS (sinistro.site)
4. Deploy em produção

## Perguntas para Clarificar

1. **Backend**: Usar Supabase ou manter Google Apps Script?
2. **Escopo MVP**: Quais features são obrigatórias para a v1.0?
3. **Autenticação Dashboard**: Credenciais hardcoded ou Supabase Auth?
4. **Deploy**: Quando ativar em produção? (sinistro.site)

## Arquivos Modificados Hoje

```
✅ topbus-sinistros/src/components/GravadorAudio.jsx (novo)
✅ topbus-sinistros/src/components/FormularioSinistro.jsx (atualizado)
✅ topbus-sinistros/tailwind.config.js (atualizado)
✅ topbus-sinistros/.env.example (novo)
✅ .github/workflows/netlify-deploy.yml (corrigido)
✅ topbus-sinistros/package.json (tailwindcss-animate adicionado)
```

## Status Deploy Netlify

- Site ID: `995a44b6-81cb-4918-9239-1d21f45027ec` (sinistrotp)
- Webhook configurado: ✅ (GitHub → Netlify)
- Build command: `npm --prefix topbus-sinistros run build`
- Publish dir: `topbus-sinistros/build`
- Next build: Disparará ao fazer push (aguardando)

---

**Próximo passo**: Confirmar qual backend usar (Supabase ou Apps Script).
