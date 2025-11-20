# Sistema de Gestão de Sinistros v2.0

Sistema de registro e acompanhamento de sinistros de frota integrado com Google Sheets e Google Drive.

## 🏗️ Arquitetura

```text
Frontend React (Vite + Vercel)
    ↓ HTTPS POST/GET
Google Apps Script (Backend)
    ↓
├─→ Google Sheets (Aba TOPBUS)
└─→ Google Drive (Imagens organizadas)
    └── TOPBUS/SIN-TB-XXXX/
```

## 📂 Estrutura do Projeto

```text
src/
├── components/
│   ├── BusIcon.jsx                  # Ícone do sistema
│   ├── FormularioSinistro.jsx       # Formulário de registro
│   └── ListaSinistros.jsx           # Listagem de sinistros
├── App.jsx                          # Componente principal
├── main.jsx                         # Entry point
└── index.css                        # Estilos globais
```

## ⚙️ Funcionalidades

### Registro de Sinistros

- ✅ Empresa fixada (TOPBUS)
- ✅ Dados do acidente (data, local, veículo, motorista, chapa)
- ✅ Identificação de responsabilidade (Motorista/Terceiro)
- ✅ Testemunhas (múltiplas)
- ✅ Upload de fotos (mínimo 4)
- ✅ Descrição detalhada
- ✅ Protocolo automático: `SIN-TB-YYYYMMDD-HHMMSS-XXXX`
- ✅ Validação completa de campos
- ✅ Integração com Google Sheets e Drive

### Dashboard (Acesso Restrito)

- ✅ Login com credenciais
- ✅ Listagem de todos os sinistros
- ✅ Busca por protocolo, local, motorista
- ✅ Visualização de detalhes
- ✅ Links diretos para planilha e Drive

## 🚀 Setup Local

### 1. Pré-requisitos

- Node.js 18+
- npm 9+

### 2. Instalação

```bash
cd /workspaces/topbusanalise
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie `.env.local` na raiz:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec
VITE_DASHBOARD_LOGIN=sinistro
VITE_DASHBOARD_PASSWORD=139702
```

### 4. Executar

```bash
npm start
```

Acesse: `http://localhost:3000`

## 📦 Deploy

### Vercel (Recomendado)

1. Conecte repositório no Vercel
2. Configure variáveis de ambiente:
   - `VITE_APPS_SCRIPT_URL`
   - `VITE_DASHBOARD_LOGIN`
   - `VITE_DASHBOARD_PASSWORD`
3. Deploy automático a cada push

### Netlify

1. Conecte repositório no Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configure as mesmas variáveis de ambiente

## 🔐 Segurança

- `.env.local` **NÃO** é commitado (`.gitignore`)
- Credenciais de dashboard apenas em variáveis de ambiente
- API do Google Apps Script com acesso público controlado
- HTTPS obrigatório (Vercel/Netlify)

## 📊 Configuração Backend

### Google Apps Script

- **URL**: [https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec](https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec)
- **Funções**: doGet(), doPost(), gerarProtocolo(), salvarNoSheet(), criarPastaGoogleDrive()
- **Timezone**: America/Sao_Paulo

### Google Sheets

- **Planilha ID**: `1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo`
- **Aba**: TOPBUS (gid=0)
- **Colunas**: ID | DataHora | Local | Onibus | Motorista | Chapa | Terceiro | Testemunhas | Descricao | Imagens | PastaLink

### Google Drive

- **Pasta ID**: `1AQFiXi9-xDulKgO-qZCF3tRrBIsrWcf4`
- **Estrutura**: TOPBUS/SIN-TB-YYYYMMDD-HHMMSS-XXXX/

## 🛠️ Stack Tecnológica

- **Frontend**: React 18, Vite 4.5, Tailwind CSS 3.4
- **Icons**: Lucide React
- **Backend**: Google Apps Script (V8 runtime)
- **Banco**: Google Sheets
- **Storage**: Google Drive
- **Deploy**: Vercel
- **Node.js**: 20.x

## 📡 Exemplos de requisição em cURL

Use a URL configurada em `VITE_APPS_SCRIPT_URL` (ou o valor padrão abaixo) e envie o payload em JSON:

```bash
API_URL="https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec"

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "unidade": "TOPBUS",
    "data": "2025-03-01T12:30",
    "local": "Av. Paulista, 1000 - São Paulo",
    "numeroCarro": "1001",
    "motorista": "João Silva",
    "chapa": "12345",
    "responsabilidade": "MOTORISTA_TOPBUS",
    "testemunhas": [{"nome": "Maria", "telefone": "+55 11 99999-9999"}],
    "descricao": "Colisão leve em cruzamento com dano no para-choque"
  }'
```

Para testar cenários de erro (ex.: payload incompleto), basta alterar ou omitir campos obrigatórios. O Apps Script retornará a mensagem correspondente informando o problema ou, em modo simulado no frontend (`VITE_SIMULAR_API=true`), lançará o erro configurado em `VITE_SIMULAR_API_ERRO`.

## 📝 Recursos Configurados

| Recurso | ID/Valor |
|---------|----------|
| Apps Script URL | AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA |
| Planilha | 1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo |
| Aba TOPBUS | gid=0 |
| Drive | 1AQFiXi9-xDulKgO-qZCF3tRrBIsrWcf4 |

## 🧪 Teste Completo

1. Acessar o formulário público
2. Preencher todos os campos obrigatórios
3. Adicionar mínimo 4 fotos
4. Adicionar testemunhas (opcional)
5. Registrar sinistro
6. Verificar protocolo gerado (SIN-TB-YYYYMMDD-HHMMSS-XXXX)
7. Acessar dashboard com credenciais
8. Verificar registro na planilha
9. Verificar pasta criada no Drive

## 📚 Scripts de Teste

```bash
cd /workspaces/topbusanalise/testes

# Teste individual
bash teste-01-topbus-colisao.sh

# Teste completo
bash teste-completo.sh
```

## 📚 Documentação Adicional

- `SISTEMA_FUNCIONAL.md` - Documentação completa do sistema
- `APPS_SCRIPT_V3_DEPLOY.md` - Guia de deploy do Apps Script
- `COMO_ATUALIZAR_APPS_SCRIPT.md` - Como atualizar o backend
- `.github/copilot-instructions.md` - Instruções para o Copilot

## 🐛 Troubleshooting

### Frontend não exibe

```bash
# Limpar cache e reiniciar
rm -rf node_modules/.vite dist
npm install
npm start
```

### Erro "React is not defined"

Verifique se todos os componentes importam React:

```javascript
import React from 'react';
```

### Erro ao enviar formulário

- Verifique `VITE_APPS_SCRIPT_URL` no `.env.local`
- Teste a URL do Apps Script diretamente no navegador
- Verifique logs do Apps Script

### Dashboard não autentica

Confirme credenciais em `.env.local`:

```env
VITE_DASHBOARD_LOGIN=sinistro
VITE_DASHBOARD_PASSWORD=139702
```

## 📞 Logs e Debug

Consulte logs:

- **Frontend**: Chrome DevTools (F12) → Console
- **Backend**: Google Apps Script → Execuções → Logs
- **Build**: Terminal do Vite/Vercel/Netlify

---

**Versão**: 2.0  
**Status**: ✅ Em Produção  
**Última atualização**: 20 de Novembro de 2025  
**Commit**: 7a98cf2 - React import fix e remoção de nome da empresa
