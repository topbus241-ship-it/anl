# TOPBUS Sinistros — Guia de Setup

Este guia adapta o roteiro fornecido nas fases 1 a 6 para o estado atual do projeto. Utilize-o para reconstruir o ambiente ou repassar o fluxo de configuração para outros desenvolvedores.

> **Obs.:** O repositório já contempla a estrutura descrita aqui (pasta `topbus-sinistros/` com arquivos configurados, incluindo os componentes `FormularioSinistro.jsx` e `ListaSinistros.jsx`). Caso esteja iniciando do zero, siga as etapas abaixo; caso já esteja trabalhando no projeto, use como referência/checagem.

---

## Fase 1 — Setup do Projeto

```bash
# 1. Estrutura de pastas
mkdir -p topbus-sinistros/public
mkdir -p topbus-sinistros/src/components
mkdir -p topbus-sinistros/src/services
mkdir -p topbus-sinistros/src/utils
mkdir -p topbus-sinistros/.vscode
cd topbus-sinistros

# 2. Inicializar Node
npm init -y

# 3. Dependencias principais (versoes atuais do repo)
npm install react@18.2.0 react-dom@18.2.0 react-scripts@5.0.1 lucide-react@0.379.0

# 4. Tailwind e ferramentas de build
npm install -D tailwindcss@3.4.3 autoprefixer@10.4.19 postcss@8.4.38

# 5. Inicializar Tailwind
npx tailwindcss init -p   # gera tailwind.config.js e postcss.config.js
```

- O projeto existente já possui `tailwind.config.js` e `postcss.config.js`. Caso gere arquivos novos, substitua os conteúdos pelos valores abaixo (fase 2).

---

## Fase 2 — Arquivos base

Arquivos já criados no repo (confira ou copie se estiver iniciando do zero):

- `.vscode/settings.json` (UTF-8, LF, Prettier/ESLint integrados).
- `tailwind.config.js`:
  ```js
  module.exports = {
    content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: { extend: {} },
    plugins: [],
  };
  ```
- `postcss.config.js` (caso tenha sido criado): 
  ```js
  module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  };
  ```
- `src/index.css` possui os imports `@tailwind base; @tailwind components; @tailwind utilities;` e estilos globais padrão.
- `src/index.js` usa `createRoot` para renderizar `<App />` dentro de `#root`.
- `src/App.jsx` já contem a navegação entre `FormularioSinistro` e `ListaSinistros`, integrada à API (GET/POST via `REACT_APP_*`). Caso esteja iniciando, copie o snippet fornecido originalmente e adapte às novas props (`onSubmit`, `onSuccess`, etc.) conforme a implementação atual.
- `public/index.html` garantido com meta tags UTF-8 e estrutura básica.
- `.gitignore`, `netlify.toml` e `package.json` já atualizados para o projeto em produção. Apenas confirme `lucide-react`, `tailwindcss`, `autoprefixer` e `postcss` nas versão presentes.

---

## Fase 3 — Credenciais (.env.local)

1. Gerar API key local:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. No Apps Script: `Propriedades do script → APP_SECRET = chave gerada`.
3. Copiar a URL do Web App implantado (`https://script.google.com/macros/s/.../exec`).
4. Criar/popular `.env.local` (já existe com placeholders):
   ```env
   REACT_APP_APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID/exec
   REACT_APP_API_KEY=sua_chave_gerada
   ```

> `.env.local` permanece ignorado pelo Git (`.gitignore`). Guarde as credenciais apenas no ambiente.

---

## Fase 4 — Componentes

- `src/components/FormularioSinistro.jsx` e `src/components/ListaSinistros.jsx` já estão completos no repositório (com validações, previews de imagem, filtros, etc.).
- Caso precise recriar, utilize os artefatos originais mencionados ou copie diretamente destes arquivos atuais.
- Arquivos auxiliares em `src/services` ou `src/utils` ainda podem ser adicionados; valide se alguma funcionalidade nova requer organização adicional (ex.: validações customizadas).

---

## Fase 5 — Testes locais

```bash
# Dentro de topbus-sinistros/
npm install        # garante dependencias
npm start          # abre http://localhost:3000
```

Checklist sugerido (replicado do roteiro):
- Preencher campos com dados contendo acentos (UTF-8).
- Enviar 1-3 imagens e verificar previews.
- Confirmar protocolo retornado e links para planilha/Drive.
- Navegar até "Ver Sinistros" e testar busca com acentos/períodos.

---

## Fase 6 — Deploy no Netlify

### Op̧ão A — Drag & Drop
```bash
npm run build
# Arraste a pasta build/ para https://app.netlify.com/drop
```

### Op̧ão B — CLI
```bash
npm install -g netlify-cli
netlify login
netlify init        # configurar site/projeto
netlify env:set REACT_APP_APPS_SCRIPT_URL "https://..."
netlify env:set REACT_APP_API_KEY "sua_chave"
npm run build
netlify deploy --prod
```

### Op̧ão C — Integração Git
1. Inicializar Git (`git init`, `git add .`, `git commit`).
2. Criar repo no GitHub e conectar `origin` (`git remote add origin ...`).
3. Configurar Netlify para usar o repo (Import from Git) e definir as env vars acima.
4. Builds serão executados via `netlify.toml` (`npm run build`, publish `build/`).

---

## Dicas para Copilot (VS Code)

- Use `code src/components/FormularioSinistro.jsx` para abrir o arquivo antes de enviar prompt.
- Exemplos de solicitações úteis:
  - “Analise este componente FormularioSinistro e sugira 5 melhorias de UX…”
  - “Adicione campo numero_boletim com mascara BO-YYYY-NNNNN…”
  - “Criar componente DashboardEstatisticas.jsx com Recharts…”.  
  Ajuste as respostas conforme as convenções do projeto (Tailwind, pt-BR, integração com API).

---

## Validações e utilitários

- Para novas regras, considere criar `src/utils/validacoes.js` (ainda vazio) com funções reaproveitáveis (CPF, placa, etc.).
- Mantenha os arquivos no padrão ASCII quando possível (o projeto inteiro já segue esse padrão).  

---

## Referências rápidas

- Arquitetura geral: `docs/arquitetura-topbus-sinistros.md`
- Estrutura do projeto: `README.md`
- Settings VS Code: `settings/settings.json`

Mantenha este guia atualizado conforme novas fases ou sprints avançarem. Quando adicionar bibliotecas extras (Yup, react-hook-form, Recharts, etc.), ajuste o passo de instalação e explique o uso aqui.
