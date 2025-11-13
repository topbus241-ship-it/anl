# Arquitetura TOPBUS Sinistros

## Visao Geral
O ecossistema TOPBUS Sinistros combina um frontend React hospedado na Netlify com uma API em Google Apps Script. A API valida o acesso via `X-API-Key`, trata o payload recebido em JSON UTF-8 e distribui os dados para dois destinos do Google Workspace: uma planilha no Google Sheets (dados estruturados) e uma pasta no Google Drive (arquivos de evidencias). Todo o fluxo respeita codificacao UTF-8 e regionalizacao pt-BR.

```mermaid
graph TD
    A[Frontend React<br/>- FormularioSinistro<br/>- ListaSinistros<br/>- Validacao UTF-8<br/>- pt-BR nativo<br/>Hospedagem: Netlify] -->|HTTP POST/GET<br/>X-API-Key: secret<br/>Content-Type: application/json; charset=utf-8| B[Google Apps Script API<br/>- doPost(): registrar<br/>- doGet(): listar<br/>- Validacao API Key<br/>- Upload automatico<br/>Config: UTF-8 + pt-BR]
    B --> C[Google Sheets<br/>- Armazenamento de dados<br/>- Colunas padronizadas<br/>- UTF-8 garantido]
    B --> D[Google Drive<br/>- Subpastas por sinistro<br/>- Upload de anexos<br/>- Permissoes herdadas]
```

## Componentes
- **Frontend React (Netlify)**  
  Aplicacao SPA criada com React, Tailwind CSS e Lucide. Contem os componentes `FormularioSinistro` e `ListaSinistros`, valida campos localmente e exibe conteudo em pt-BR com acentuacao preservada (`meta charset="utf-8"`). O `App.jsx` coordena rotas e estado. Deploy continuo via Netlify.

- **Google Apps Script (API)**  
  Script publicado como Web App que expoe `doPost` (registro de sinistros) e `doGet` (listagem). Valida cabecalhos (`Content-Type`, `X-API-Key`), normaliza strings para UTF-8 e realiza upload de anexos no Drive. Respostas sao geradas com `ContentService` configurado para UTF-8.

- **Google Sheets**  
  Planilha com colunas padronizadas (`protocolo`, `motorista`, `placa`, `status` etc.) usando locale pt-BR (datas e numeros). Recebe dados normalizados pelo Apps Script para consultas e dashboards.

- **Google Drive**  
  Estrutura de pastas onde cada sinistro cria uma subpasta identificada pelo protocolo (`protocolo_YYYYMMDD`). Guarda fotos, PDFs e anexos enviados pelo formulario; o ID da pasta fica registrado no Sheets para rastreabilidade.

## Fluxo de Dados
1. Usuario envia dados pelo `FormularioSinistro`. O frontend valida campos e envia `fetch` para a API com JSON UTF-8 e cabecalho `X-API-Key`.
2. `doPost` valida a chave, grava o registro no Sheets e envia anexos para o Drive. Retorna protocolo e status.
3. `ListaSinistros` consome `doGet`, exibindo dados formatados com `Intl.*` em pt-BR.

## Seguranca e Governanca
- `X-API-Key` armazenada em `.env.local` no frontend e como `APP_SECRET` nas propriedades do Apps Script.
- CORS limitado aos dominios Netlify autorizados.
- Permissoes de Sheets e Drive restritas a contas especificas ou servico.
- Logs de execucao do Apps Script monitoram acesso (auditoria).

## Deploy e Operacao
- **Frontend**: build com `npm run build` e deploy na Netlify (automacao ou upload manual da pasta `build/`).
- **Apps Script**: publicar nova versao do Web App a cada mudanca (`Executar > Implantar > Nova implantacao`).
- **Dados**: realizar backups periodicos da planilha e do Drive (Google Takeout ou automacoes).

## Proximos Passos Recomendados
1. Implementar testes fim a fim (Playwright ou Cypress) para validar o fluxo completo.
2. Adicionar monitoramento de erros (Sentry ou LogRocket) no frontend.
3. Versionar a planilha (abas por sprint) e automatizar arquivamento no Drive.
