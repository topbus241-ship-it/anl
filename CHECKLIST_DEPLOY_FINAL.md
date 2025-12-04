# ✅ CHECKLIST DE IMPLANTAÇÃO - TOPBUS SINISTROS v2

## 📋 Resumo Executivo

Você está prestes a implantar o **TOPBUS Sinistros v2**, um sistema moderno de registro de sinistros com:
- ✅ Backend Supabase (PostgreSQL + RLS + Storage)
- ✅ Frontend React com Glassmorphism + Dark Mode
- ✅ Conformidade LGPD (Lei Geral de Proteção de Dados)
- ✅ Integração de áudio (Web Audio API)
- ✅ Deploy automático via Netlify

---

## 🔧 FASE 1: PREPARAÇÃO LOCAL

### 1.1 Clonar/Atualizar Repositório
- [ ] Repositório clonado em `/workspaces/tp2`
- [ ] Branch `main` atualizado
- [ ] `git log --oneline` mostra commits recentes de migração Supabase

### 1.2 Verificar Node.js e npm
```bash
node --version  # Deve ser v16+
npm --version   # Deve ser v8+
```
- [ ] Node.js versão 16 ou superior
- [ ] npm versão 8 ou superior

### 1.3 Instalar Dependências
```bash
cd topbus-sinistros
npm install
```
- [ ] `npm install` executado com sucesso
- [ ] Pasta `node_modules/` criada
- [ ] Sem erros críticos de vulnerabilidades

### 1.4 Configurar Variáveis de Ambiente
```bash
cd topbus-sinistros
# Copiar exemplo para arquivo real
cp .env.local.example .env.local
# Editar com credenciais reais do Supabase
nano .env.local
```
- [ ] `.env.local` criado na pasta `topbus-sinistros/`
- [ ] `REACT_APP_SUPABASE_URL` preenchido
- [ ] `REACT_APP_SUPABASE_ANON_KEY` preenchido
- [ ] ⚠️ Arquivo `.env.local` **NÃO** será commitado (verifica `.gitignore`)

### 1.5 Testar Build Local
```bash
cd topbus-sinistros
npm run build
```
- [ ] Build executado com sucesso
- [ ] Pasta `build/` criada
- [ ] Sem erros de compilação
- [ ] Mensagem: "Compiled successfully"

### 1.6 Testar Servidor Local (Opcional)
```bash
cd topbus-sinistros
npm start
```
- [ ] Servidor inicia em `http://localhost:3000`
- [ ] Página carrega sem erros no console
- [ ] Theme toggle funciona (luz/escuro)
- [ ] Formulário exibe corretamente

---

## 🗄️ FASE 2: CONFIGURAÇÃO SUPABASE

### 2.1 Projeto Supabase Criado
- [ ] Projeto criado: `howaipkfjdtvdyvekwyok`
- [ ] URL: `https://howaipkfjdtvdyvekwyok.supabase.co`
- [ ] Acesso ao Supabase Dashboard confirmado

### 2.2 Implantar Schema SQL
1. [ ] Arquivo `SUPABASE_SCHEMA.sql` aberto
2. [ ] Supabase Dashboard → **SQL Editor**
3. [ ] Novo Query criado
4. [ ] Conteúdo completo do SQL copiado e colado
5. [ ] Clicado **Run** (ou Ctrl+Enter)
6. [ ] Mensagens de sucesso exibidas (CREATE TABLE, CREATE POLICY, etc.)

### 2.3 Verificar Tabelas Criadas
No SQL Editor, execute:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```
- [ ] Tabelas criadas:
  - [ ] `sinistros`
  - [ ] `testemunhas`
  - [ ] `imagens`
  - [ ] `documentos_complementares`
  - [ ] `consentimentos_lgpd`
  - [ ] `solicitacoes_lgpd`

### 2.4 Criar Storage Bucket
1. [ ] Supabase Dashboard → **Storage**
2. [ ] Clicado **New Bucket**
3. [ ] Nome: `sinistros`
4. [ ] Marcado "Make it public"
5. [ ] Bucket criado com sucesso

### 2.5 Configurar Políticas de Storage
1. [ ] Clicado no bucket `sinistros`
2. [ ] Aba **Policies** aberta
3. [ ] Criadas 3 políticas:
   - [ ] Upload público
   - [ ] Leitura pública
   - [ ] Deleção

### 2.6 Testar Conexão Supabase
```bash
cd topbus-sinistros
npm start
# Ir para http://localhost:3000
# Abrir DevTools (F12)
# Console deve estar sem erros relacionados a Supabase
```
- [ ] Nenhum erro de conexão no console
- [ ] Nenhum erro de variáveis de ambiente não definidas
- [ ] Página carrega normalmente

---

## 🌐 FASE 3: DEPLOY NETLIFY

### 3.1 Conectar Repositório GitHub
1. [ ] Netlify Dashboard: `https://app.netlify.com`
2. [ ] Clicado **Add new site → Import an existing project**
3. [ ] Autenticação GitHub bem-sucedida
4. [ ] Repositório `tp2` selecionado
5. [ ] Branch `main` configurado

### 3.2 Configurar Build Settings
1. [ ] Build command: `npm --prefix topbus-sinistros run build`
2. [ ] Publish directory: `topbus-sinistros/build`
3. [ ] Deploy preview branches: ✓ Habilitado
4. [ ] Clicado **Deploy site**

### 3.3 Adicionar Variáveis de Ambiente
1. [ ] Netlify Dashboard → **Site settings → Build & deploy → Environment**
2. [ ] Clicado **Edit variables**
3. [ ] Adicionadas:
   - [ ] `REACT_APP_SUPABASE_URL` = `https://howaipkfjdtvdyvekwyok.supabase.co`
   - [ ] `REACT_APP_SUPABASE_ANON_KEY` = (chave de anon do Supabase)
4. [ ] Clicado **Save**

### 3.4 Primeiro Deploy
1. [ ] Push para `main`:
   ```bash
   git push origin main
   ```
2. [ ] Netlify inicia build automaticamente
3. [ ] Esperado: 2-3 minutos
4. [ ] Verificar em Netlify Dashboard:
   - [ ] Status: **Published** (verde)
   - [ ] Nenhum erro nos logs

### 3.5 Testar URL de Deploy
1. [ ] URL gerada pelo Netlify (ex: `sinistrotp.netlify.app`)
2. [ ] Acessar a URL no navegador
3. [ ] Página carrega corretamente
4. [ ] Theme toggle funciona
5. [ ] Formulário exibe
6. [ ] Nenhum erro no console do navegador (F12)

---

## 🔐 FASE 4: CONFIGURAÇÃO DE DOMÍNIO (OPCIONAL)

### 4.1 Configurar Domínio no Netlify
1. [ ] Netlify Dashboard → **Domain settings**
2. [ ] **Add domain**
3. [ ] Digitado: `sinistro.site`
4. [ ] Instruções de DNS exibidas

### 4.2 Configurar DNS no Hostinger
1. [ ] Hostinger Dashboard → Domains
2. [ ] Selecionado domínio: `sinistro.site`
3. [ ] **DNS Zone** aberto
4. [ ] Anotados nameservers do Netlify:
   - [ ] `dns1.p09.nsone.net`
   - [ ] `dns2.p09.nsone.net`
   - [ ] `dns3.p09.nsone.net`
   - [ ] `dns4.p09.nsone.net`
5. [ ] Nameservers atualizados no Hostinger
6. [ ] Propagação DNS aguardada (até 48h, geralmente 5-30 min)

### 4.3 Verificar DNS
```bash
# Após propagação
nslookup sinistro.site
# Deve retornar IPs do Netlify
```
- [ ] DNS resolvido para Netlify
- [ ] Site acessível via `https://sinistro.site`
- [ ] SSL/TLS ativado automaticamente (Let's Encrypt)

---

## ✅ FASE 5: TESTES FUNCIONAIS

### 5.1 Teste de Formulário Completo
1. [ ] Acessado site de deploy
2. [ ] Preenchido formulário com dados de teste:
   - [ ] Data/hora
   - [ ] Local
   - [ ] Identificação ônibus
   - [ ] Nome motorista
   - [ ] Descrição
   - [ ] Foto (1+ imagem)
   - [ ] Aceitar LGPD GPS
3. [ ] Opcionalmente: Gravado áudio
4. [ ] Clicado "Enviar"
5. [ ] Mensagem de sucesso exibida com protocolo

### 5.2 Verificar Dados no Supabase
1. [ ] Supabase Dashboard → **SQL Editor**
2. [ ] Executado:
   ```sql
   SELECT * FROM sinistros LIMIT 10;
   ```
   - [ ] Sinistro de teste aparece
   - [ ] Protocolo gerado corretamente
   
3. [ ] Verificado imagens:
   ```sql
   SELECT * FROM imagens LIMIT 10;
   ```
   - [ ] Entrada de imagem aparece
   
4. [ ] Verificado consentimentos:
   ```sql
   SELECT * FROM consentimentos_lgpd LIMIT 10;
   ```
   - [ ] Entrada de consentimento GPS

### 5.3 Verificar Arquivo no Storage
1. [ ] Supabase Dashboard → **Storage → sinistros**
2. [ ] Pasta `sinistros/` contém subpastas/arquivos
3. [ ] Imagem de teste está acessível (clique e visualize)
4. [ ] Opcional: Se gravou áudio, arquivo `.webm` presente

### 5.4 Testar Página de Privacidade
1. [ ] Rodapé da página tem link "Política de Privacidade e LGPD"
2. [ ] Clicado no link
3. [ ] Página de Privacidade carrega
4. [ ] Seções visíveis:
   - [ ] 1. Política de Privacidade
   - [ ] 2. Seus Direitos LGPD
   - [ ] 3. Retenção de Dados
   - [ ] 4. Segurança dos Dados
   - [ ] 5. Solicitar Seus Direitos
   - [ ] 6. Contato
5. [ ] Formulário de solicitação LGPD funciona

### 5.5 Testar Dark Mode
1. [ ] Clicado em Theme Toggle (canto superior direito)
2. [ ] Interface muda para modo escuro
3. [ ] Clicado novamente → volta para claro
4. [ ] Preferência persiste ao recarregar página

### 5.6 Testar Responsividade
1. [ ] Acessado em desktop (largura > 1024px)
   - [ ] Layout com 3 colunas em desktop
   - [ ] Áudio ao lado de descrição
   
2. [ ] Acessado em tablet (768px - 1024px)
   - [ ] Layout adaptado
   - [ ] Elementos legíveis
   
3. [ ] Acessado em mobile (< 768px)
   - [ ] Layout empilhado verticalmente
   - [ ] Botões grandes e clicáveis
   - [ ] Sem scrolling horizontal

---

## 🔍 FASE 6: VALIDAÇÃO DE SEGURANÇA

### 6.1 Verificar RLS no Supabase
1. [ ] Supabase → SQL Editor
2. [ ] Executado:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public' LIMIT 10;
   ```
   - [ ] Múltiplas políticas listadas
   - [ ] RLS ativo nas tabelas

### 6.2 Testar Sem Credenciais
1. [ ] Retirado `.env.local` ou definido variáveis vazias
2. [ ] Tentado acessar aplicação
3. [ ] Erro claro exibido (sem travamento)

### 6.3 Validar Variáveis de Ambiente
1. [ ] `.env.local` não está versionado:
   ```bash
   git status | grep .env.local
   # Não deve aparecer
   ```
   - [ ] Confirmado no `.gitignore`

### 6.4 Verificar HTTPS
1. [ ] URL de produção (sinistro.site) acessada
2. [ ] Cadeado de segurança visível no navegador
3. [ ] Certificado válido (clique no cadeado → Detalhes)

---

## 📊 FASE 7: MONITORAMENTO PÓS-DEPLOY

### 7.1 Configurar Alertas Netlify
1. [ ] Netlify → Site settings → Notifications
2. [ ] Habilitadas notificações de:
   - [ ] Failed builds
   - [ ] Deployment succeeded

### 7.2 Configurar Backups Supabase
1. [ ] Supabase → Project settings → Backups
2. [ ] Verificado:
   - [ ] Backup automático ativado
   - [ ] Frequência: Diária ou semanal
   - [ ] Retenção: Mínimo 7 dias

### 7.3 Monitorar Performance
1. [ ] Netlify Dashboard → Analytics
2. [ ] Verificado tempo de build médio
3. [ ] Google PageSpeed Insights acessado
4. [ ] Objetivo: Score > 80 em Performance

### 7.4 Log de Erros
1. [ ] Netlify → Logs → Build logs
2. [ ] Verificado últimas compilações
3. [ ] Sem erros críticos
4. [ ] Supabase → Logs → Edge Functions (se usar)

---

## 📝 FASE 8: DOCUMENTAÇÃO E HANDOVER

### 8.1 Documentação Criada
- [ ] `DEPLOY_SUPABASE_SCHEMA.md` - Guia de implantação SQL
- [ ] `README.md` atualizado com instruções de deploy
- [ ] `.env.local.example` criado
- [ ] Comentários em código explicam lógica-chave

### 8.2 Procedimentos Operacionais
- [ ] Documento: Como fazer push de atualizações
- [ ] Documento: Como acessar Supabase em emergência
- [ ] Documento: Plano de backup e recuperação
- [ ] Documento: Contatos de suporte

### 8.3 Treinar Usuários Finais
- [ ] [ ] Equipe sabe como acessar o sistema
- [ ] [ ] Equipe sabe como usar o formulário
- [ ] [ ] Equipe sabe como visualizar histórico
- [ ] [ ] Equipe sabe sobre LGPD e privacidade

---

## 🎯 FASE 9: GO-LIVE (PRODUÇÃO)

### 9.1 Confirmações Finais
- [ ] Todos os itens anteriores marcados como ✅
- [ ] Gerente de projeto aprovou
- [ ] Equipe de TI validou segurança
- [ ] Testes de aceitação passaram

### 9.2 Comunicação
- [ ] Email enviado para stakeholders
- [ ] Mensagem: Sistema está ao vivo em `sinistro.site`
- [ ] Instruções de uso distribuídas
- [ ] Suporte disponível

### 9.3 Monitoramento Inicial (24h)
- [ ] Verificado Netlify Dashboard a cada hora
- [ ] Esperado para erros em produção
- [ ] Suporte pronto para escalar

### 9.4 Relatório Pós-Deploy
- [ ] Documento criado com:
  - Hora/data do deploy
  - Commit hash
  - Alterações principais
  - Problemas encontrados
  - Plano de mitigação

---

## 🆘 TROUBLESHOOTING

| Problema | Solução |
|----------|---------|
| Build falha no Netlify | Verificar logs, confirmar variáveis de ambiente, testar localmente |
| Conectar recusa no Supabase | Validar credenciais ANON_KEY, verificar URL, testar CORS |
| Fotos não fazem upload | Verificar políticas de Storage, confirmar bucket público |
| Página branca em produção | Verificar console (F12), buscar erros de React |
| DNS não resolve | Aguardar propagação (48h), validar nameservers no Hostinger |
| Banco de dados não encontrado | Re-executar SQL de schema, confirmar conexão ao Supabase |

---

## ✨ CONCLUSÃO

Se todos os itens acima estão marcados ✅, seu sistema está:
- ✅ Deployado em produção
- ✅ Conectado ao Supabase
- ✅ Protegido por LGPD
- ✅ Monitorado e mantido
- ✅ Pronto para uso

**Parabéns! 🚀 O TOPBUS Sinistros está ao vivo!**

---

**Próximas Melhorias (Futuro):**
- [ ] Dashboard de análise (relatórios)
- [ ] Autenticação de usuários avançada
- [ ] Notificações por email/SMS
- [ ] Integração com sistemas externos
- [ ] Machine learning para detecção de fraude

**Última atualização:** 2024
**Versão:** 2.0.0 (Supabase + LGPD)
