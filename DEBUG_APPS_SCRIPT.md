# 🔧 DEBUG: Apps Script não está respondendo com JSON

## ⚠️ Problema

O Apps Script está retornando **HTTP 302 (HTML Redirect)** em vez de **JSON**, o que indica que o código não está sendo executado.

## ✅ Possíveis Causas

1. **Código não foi salvo completamente** no Apps Script
2. **Deploy não tem permissão "Anyone"**
3. **Há um erro de sintaxe** no código copiado
4. **O `doPost()` não está sendo reconhecido**

## 🔧 Solução - Teste Mínimo

### Passo 1: Copiar Código Mínimo

Vá para https://script.google.com e substitua **TODO** o código por isso:

```javascript
function doPost(e) {
  try {
    // Se recebeu dados, processar
    if (e && e.postData) {
      const dados = JSON.parse(e.postData.contents);
      
      return ContentService.createTextOutput(JSON.stringify({
        sucesso: true,
        recebido: dados,
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Se não recebeu dados
    return ContentService.createTextOutput(JSON.stringify({
      sucesso: false,
      erro: "Nenhum dado recebido"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(erro) {
    return ContentService.createTextOutput(JSON.stringify({
      sucesso: false,
      erro: erro.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Passo 2: Salvar e Deploy

1. **Salve** (Ctrl+S)
2. Clique em **"Deploy"** (botão azul)
3. **"Novo Deployment"**
4. Tipo: **"Webapp"**
5. Execute como: **Sua conta**
6. Acesso com: **"Anyone"** ⬅️ IMPORTANTE!
7. Clique **"Deploy"**

### Passo 3: Testar com curl

```bash
curl -s -X POST "https://script.google.com/macros/s/SEU_CODE_AQUI/exec" \
  -H "Content-Type: application/json" \
  -d '{"teste":"ok"}' | jq .
```

**Você deve ver:**
```json
{
  "sucesso": true,
  "recebido": {
    "teste": "ok"
  },
  "timestamp": "2025-11-13T03:52:00.000Z"
}
```

### Passo 4: Comparar URLs

- **URL Nova (após deploy)**: `https://script.google.com/macros/s/AKfycbxlLWTu6Fl6869ItyF_.../exec`
- **URL em .env.local**: `REACT_APP_APPS_SCRIPT_URL=???`

Se forem **diferentes**, atualize `.env.local` com a URL nova.

## 🐛 Se Ainda Não Funcionar

### Verificar Erro no Console

1. Abra https://script.google.com
2. Clique em **"Execução"** (esquerda)
3. Veja se há erros listados
4. Anote a mensagem de erro

### Verificar Permissões

1. Clique em **"Deploy"** > **"Gerenciar deployments"**
2. Clique no ícone de "edit" (lápis)
3. Verifique se está marcado **"Anyone"** em "Acesso com"
4. Se não estiver, altere para "Anyone" e salve

### Testar Função Manualmente

1. Em https://script.google.com, clique no **▶️ play** próximo a `function doPost()`
2. Na janela "Executar função", selecione `doPost`
3. Clique **"Executar"**
4. Veja a saída no console

## 🚀 Próximo Passo

Depois que o código mínimo funcionar (retornar JSON), vou te fornecer o código completo para salvar em Google Sheets e Drive.

---

**Data**: 2025-11-13  
**Status**: Em Debug ⏳

