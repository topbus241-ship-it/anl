# 🔧 Como Atualizar o Google Apps Script

## ⚠️ PROBLEMA IDENTIFICADO

Os testes foram executados, mas **os dados não chegaram** no Google Sheets porque o **Apps Script não está salvando os dados corretamente**.

**Sintomas:**
- ❌ HTTP 302/307 redirects
- ❌ Nenhum dado em Google Sheets
- ❌ Nenhuma pasta em Google Drive
- ❌ Nenhuma resposta JSON válida

**Causa:** O código atual do Apps Script não está processando o POST corretamente.

---

## ✅ SOLUÇÃO

### Passo 1: Acessar o Google Apps Script

1. Abra o Google Apps Script: https://script.google.com
2. Selecione o projeto **"TOPBUS Sinistros"** (ou o projeto vinculado à sua planilha)
3. Clique em **"Código do projeto"** na esquerda

### Passo 2: Limpar Código Existente

1. Selecione **TODO** o código atual no editor (Ctrl+A)
2. Delete (Delete/Backspace)

### Passo 3: Copiar Novo Código

1. Abra o arquivo: `/workspaces/topbusanalise/APPS_SCRIPT_CODIGO.gs`
2. Copie **TODO** o conteúdo
3. Cole no editor do Google Apps Script
4. Salve (Ctrl+S)

### Passo 4: Testar o Código

1. Na função `testDoPost()`, clique no ▶️ (play) de teste
2. Você verá um JSON com `"sucesso": true` e um protocolo `SIN-TB-XXXXX`
3. Verifique Google Sheets: deve ter uma nova linha na aba **TOPBUS**

### Passo 5: Fazer Deploy

1. Clique em **"Deploy"** (botão azul no canto direito)
2. Selecione **"Novo deployment"** (ícone "novo")
3. Tipo: **"Webapp"**
4. Configurar como:
   - **Execute as:** Sua conta do Google
   - **Acesso com:** "Anyone"
5. Clique **"Deploy"**
6. Copie a URL (deve ser algo como `https://script.google.com/macros/s/AKfycbynbT.../exec`)
7. Compare com a URL em `.env.local`:
   - Se **diferente**, atualize o `.env.local` com a nova URL
   - Se **igual**, está correto

---

## 🧪 TESTE RÁPIDO

Após fazer deploy, execute um teste:

```bash
cd /workspaces/topbusanalise/testes
bash teste-01-topbus-colisao.sh
```

**Você deve ver:**
```
{
  "sucesso": true,
  "protocolo": "SIN-TB-20251113-XXXXXX-XXXX",
  "mensagem": "Sinistro registrado com sucesso",
  "empresa": "topbus"
}
```

---

## ✔️ VERIFICAR RESULTADO

### Google Sheets

1. Abra: https://docs.google.com/spreadsheets/d/1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo
2. Clique na aba **"TOPBUS"** (gid=0)
3. Você deve ver 2+ linhas com dados dos testes

### Google Drive

1. Abra: https://drive.google.com/drive/folders/1AQFiXi9-xDulKgO-qZCF3tRrBIsrWcf4
2. Abra pasta **"TOPBUS"**
3. Dentro, você deve ver pastas com nomes como:
   - `SIN-TB-20251113-XXXXXX-XXXX/`
4. Dentro de cada pasta há um `metadata.json` com os dados

---

## 🐛 SE NÃO FUNCIONAR

### Verificar Permissões

1. Vá para o projeto do Apps Script
2. **Configurações** > **Editor** > **Biblioteca de Apps Script**
3. Selecione **Autorização**
4. Garantir que tem acesso à planilha e pasta

### Verificar Planilha/Drive

1. Confirme que você tem acesso à planilha: https://docs.google.com/spreadsheets/d/1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo
2. Confirme que você tem acesso à pasta: https://drive.google.com/drive/folders/1AQFiXi9-xDulKgO-qZCF3tRrBIsrWcf4
3. Se não, peça acesso ao proprietário

### Verificar IDs

Compare com o arquivo `APPS_SCRIPT_CODIGO.gs`:

```javascript
const SHEET_ID = '1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo';
const DRIVE_FOLDER_ID = '1AQFiXi9-xDulKgO-qZCF3tRrBIsrWcf4';
```

Se forem diferentes nos seus recursos, atualize o código.

---

## 📋 CHECKLIST FINAL

- [ ] Novo código copiado para Apps Script
- [ ] Código salvo (Ctrl+S)
- [ ] Teste `testDoPost()` passou com sucesso
- [ ] Deploy realizado
- [ ] URL do deploy atualizava em `.env.local` (se diferente)
- [ ] Teste `bash teste-01-topbus-colisao.sh` retornou JSON com `"sucesso": true`
- [ ] Google Sheets mostra novas linhas na aba TOPBUS
- [ ] Google Drive mostra novas pastas

---

## 🚀 PRÓXIMO PASSO

Depois que tudo estiver funcionando:

```bash
# Re-executar os testes
cd /workspaces/topbusanalise/testes
bash teste-completo.sh

# Verificar todos os dados foram salvos
# Abrir Google Sheets para confirmar
```

---

**Data:** 2025-11-13  
**Status:** Em Progresso ⏳
