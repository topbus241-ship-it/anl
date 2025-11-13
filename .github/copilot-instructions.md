## Quick orientation

Este repositório contém o projeto **TOPBUS Sinistros**, composto por um frontend React (`topbus-sinistros/`) integrado a um backend Google Apps Script já implantado externamente. Há também documentação auxiliar em `docs/` e configurações de editor em `settings/`.

## O que o agente precisa saber primeiro

- **Frontend principal**: `topbus-sinistros/`
  - `package.json`, `tailwind.config.js`, `netlify.toml`
  - `public/index.html` (UTF-8) e `src/` com componentes React (`FormularioSinistro`, `ListaSinistros`, `App.jsx`, `index.js`, `index.css`)
  - `.env.local` com `REACT_APP_APPS_SCRIPT_URL` e `REACT_APP_API_KEY` (não deve ser commitado)
- **Documentação**: `docs/arquitetura-topbus-sinistros.md` descreve o fluxo Netlify → Apps Script → Sheets/Drive.
- **Configurações VS Code**: `settings/settings.json` define UTF-8, LF, Prettier e ESLint automáticos; respeite essas convenções ao editar/gerar arquivos.

## Como agir em pedidos comuns

- **Adicionar/alterar código React**: trabalhe dentro de `topbus-sinistros/src/`. Componentes críticos ficam em `src/components/`. Verifique se novas dependências entram em `package.json` e considere atualizar README ou docs caso afete integrações com Apps Script.
- **Rodar ou testar**:
  - Instalação: `npm install` (na pasta `topbus-sinistros`).
  - Ambiente local: `npm start`.
  - Build: `npm run build`.
  - Tailwind requer `postcss.config.js` com `tailwindcss` e `autoprefixer`; confirme a existência antes de builds.
- **Variáveis de ambiente**: nunca exponha credenciais. Informe ao usuário caso precise de valores reais para testes manuais.
- **Deploy**: Netlify usa `npm run build` com publish `build/`. Garanta que `netlify.toml` permaneça consistente ao ajustar rotas ou comportamento SPA.

## Convenções do projeto

- Código e documentação devem permanecer em pt-BR, preservando acentuação lógica; porém, quando a ferramenta limitar, utilize ASCII compatível.
- Formatação é feita via Prettier com aspas simples, ponto e vírgula e trailing commas (`settings/settings.json` já habilita `formatOnSave`).
- Ao manipular datas e números, priorize `Intl.*` com locale `pt-BR` (vide `ListaSinistros.jsx`).
- Respeite estrutura de pastas listada no README. Novos módulos devem seguir padrão `src/{components,services,utils}`.

## Perguntas a fazer quando faltar contexto

- Para integrações com Apps Script, confirme quais endpoints ou planilhas devem ser usados.
- Antes de adicionar bibliotecas (ex.: validações, máscaras), pergunte se já há preferência (Yup, react-hook-form etc.).
- Caso precise de scripts ou workflows adicionais (CI/CD), questione se Netlify é suficiente ou se há outra plataforma.

## O que não assumir

- Não presuma que o Apps Script será modificado por aqui; alterações nesse backend devem ser documentadas ou solicitadas explicitamente.
- Não gere chaves nem faça deploy automatizado sem autorização expressa.
- Não instale globalmente ferramentas CLI; prefira dependências de projeto ou instruções de uso local.

---
Se descobrir novas convenções específicas (ex.: caminhos adicionais, scripts de automação, CI), atualize este arquivo mantendo a estrutura acima.
