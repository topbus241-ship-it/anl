# TOPBUS Sinistros

Portal React para registrar e acompanhar sinistros de frota integrado ao Google Apps Script, Google Sheets e Google Drive.

## Estrutura
```
topbus-sinistros/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FormularioSinistro.jsx
│   │   └── ListaSinistros.jsx
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env.local
├── .gitignore
├── package.json
├── tailwind.config.js
├── netlify.toml
├── .vscode/
│   └── settings.json
└── README.md
```

## Requisitos
- Node.js 18+
- npm 9+
- Conta Netlify (deploy)
- Acesso ao Google Apps Script configurado

## Configuracao
1. Crie `.env.local` com:
   ```
   REACT_APP_APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID/exec
   REACT_APP_API_KEY=sua_chave_segura
   ```
2. Instale dependencias:
   ```
   npm install
   ```
3. Execute ambiente local:
   ```
   npm start
   ```

## Build e Deploy
- Criar build de producao: `npm run build`
- Deploy na Netlify:
  1. Conecte o repositorio e defina comando `npm run build`
  2. Configure as variaveis `REACT_APP_APPS_SCRIPT_URL` e `REACT_APP_API_KEY`

## Referencias
- Guia de arquitetura em `docs/arquitetura-topbus-sinistros.md`
- Guia de setup detalhado em `docs/guia-setup-topbus-sinistros.md`
- Apps Script Web Apps: https://developers.google.com/apps-script/guides/web
