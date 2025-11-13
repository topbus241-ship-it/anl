# 🚀 INSTRUÇÕES PASSO A PASSO - Apps Script v3

## ⚠️ IMPORTANTE

Você já tem a **v3 implantada**, mas o **código antigo ainda está no editor**. Precisa substituir.

---

## 📋 PASSO 1: Acessar Google Apps Script

1. Abra: **https://script.google.com**
2. Clique em **"TOPBUS Sinistros"** (seu projeto)
3. Você verá o **Editor** com o código antigo

---

## 📝 PASSO 2: Copiar Novo Código

### No VS Code (ou seu editor local):

1. Abra: `/workspaces/topbusanalise/APPS_SCRIPT_CODIGO.gs`
2. Selecione **TODO o código** (Ctrl+A)
3. **Copie** (Ctrl+C)

---

## 🔧 PASSO 3: Substituir no Google Apps Script

### No Google Apps Script:

1. No editor, clique no código (qualquer linha)
2. Selecione **TODO** (Ctrl+A)
3. **Delete tudo**
4. **Cole o novo código** (Ctrl+V)
5. **Salve** (Ctrl+S)

---

## 🧪 PASSO 4: Testar

### No Google Apps Script:

1. Localize a função `function testDoPost()`
2. Clique no play **▶️** ao lado (botão verde)
3. Na pop-up "Selecionar função", clique **"testDoPost"**
4. Clique **"Executar"**
5. Veja a saída no console abaixo

**Você deve ver uma resposta JSON assim:**

```
{"sucesso":true,"mensagem":"Sinistro registrado com sucesso","dados":{"protocolo":"SIN-TB-20251113-xxxxxx-xxxx","empresa":"TOPBUS"}}
```

---

## 🎯 PASSO 5: Fazer Deploy

### No Google Apps Script:

1. Clique no botão **"Deploy"** (azul, canto superior direito)
2. Você verá opções:
   - Se disser "Novo Deployment", clique lá
   - Se disser números (como "v4"), clique em **"Gerenciar deployments"** > **"Criar novo"**
3. Tipo: **"Webapp"**
4. Preencha:
   - Execute como: **Sua conta**
   - Acesso com: **"Anyone"**
5. Clique **"Deploy"**
6. Copie a nova URL

---

## 🔗 PASSO 6: Atualizar URL

Se a **nova URL for diferente** da que tem em `.env.local`:

### No VS Code:

1. Abra: `/workspaces/topbusanalise/.env.local`
2. Atualize:
   ```
   REACT_APP_APPS_SCRIPT_URL=https://script.google.com/macros/s/NOVA_URL_AQUI/exec
   ```

---

## ✅ VERIFICAR FUNCIONAMENTO

### Teste com curl no terminal:

```bash
curl -s -X POST "SEU_URL_NOVO_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"unidade":"TOPBUS","data":"2025-11-13T14:30","local":"Teste","numeroCarro":"TB-2450","motorista":"Teste","chapa":"2450","responsabilidade":"TERCEIRO","testemunhas":[{"nome":"João","telefone":"1198765432"}],"descricao":"Teste"}'
```

**Esperado:**

```
{"sucesso":true,"mensagem":"Sinistro registrado com sucesso",...}
```

### Verificar Google Sheets:

1. Abra: https://docs.google.com/spreadsheets/d/1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo
2. Aba **"TOPBUS"**
3. Você deve ver a **nova linha** com os dados

---

## 🆘 SE NÃO FUNCIONAR

### Erro ao salvar?

- Verifique se você **deletou TUDO** antes de colar
- Verifique se não há **caracteres especiais estranhos**
- Tente **copiar novamente**

### Erro ao testar?

1. Vá para **"Execução"** (esquerda)
2. Procure por erros **vermelhos**
3. Clique no erro para ver detalhes

### Erro 302 (redirect)?

- Significa que o **código antigo ainda está sendo usado**
- Repita o processo de **deletar tudo e colar novo**
- Faça **novo Deploy** (será v4)

---

## 📞 PRÓXIMO PASSO

Depois que tudo funcionar:

1. **Re-execute os testes**: `bash teste-completo.sh`
2. **Teste o formulário React**: `npm start`
3. **Deploy no Netlify** (opcional)

---

**IMPORTANTE**: Não tenha pressa. Cada passo é importante.

Data: 2025-11-13
