# 🧪 Testes Automáticos - TOPBUS Sinistros v2.0

## 📋 Visão Geral

Este diretório contém 5 testes automáticos para validar o funcionamento do sistema de registro de sinistros:

- **Teste #1**: TOPBUS - Colisão lateral (Terceiro culpado)
- **Teste #2**: TOPBUS - Danos em estacionamento (Motorista culpado)
- **Teste #3**: BELO MONTE - Colisão frontal (Terceiro culpado)
- **Teste #4**: BELO MONTE - Ferimento em passageiro (Motorista culpado)
- **Teste #5**: Validação de campo obrigatório (deve rejeitar)

## 🚀 Como Executar

### **Opção 1: Linux/Mac - Bash (Recomendado)**

#### Executar teste individual:

```bash
# Teste #1
cd /workspaces/topbusanalise/testes
chmod +x teste-01-topbus-colisao.sh
bash teste-01-topbus-colisao.sh

# Teste #2
bash teste-02-topbus-estacionamento.sh

# Teste #3
bash teste-03-belomonte-colisao-frontal.sh

# Teste #4
bash teste-04-belomonte-passageiro.sh

# Teste #5 - Validação
bash teste-05-validacao.sh
```

#### Executar todos os testes em sequência:

```bash
cd /workspaces/topbusanalise/testes
chmod +x teste-completo.sh
bash teste-completo.sh
```

### **Opção 2: Windows - PowerShell**

#### Executar teste individual:

```powershell
# Abra PowerShell como Administrador e execute:

cd C:\Users\DELL\OneDrive\Desktop\TOPBUSDEV\testes

# Teste #1
.\teste-01-topbus-colisao.ps1

# Teste #2
.\teste-02-topbus-estacionamento.ps1

# Teste #3
.\teste-03-belomonte-colisao-frontal.ps1

# Teste #4
.\teste-04-belomonte-passageiro.ps1
```

#### Executar todos os testes em sequência:

```powershell
cd C:\Users\DELL\OneDrive\Desktop\TOPBUSDEV\testes
.\teste-completo.ps1
```

#### Se receber erro de execução:

```powershell
# Permitir execução de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Depois executar o teste
.\teste-completo.ps1
```

### **Opção 3: cURL - Qualquer plataforma**

Se preferir usar cURL diretamente:

```bash
# Teste #1 - TOPBUS Colisão
curl -X POST "https://script.google.com/macros/s/AKfycbynbT_LfA0QClk7u7So3mfL9zjU9Q4Q-SDlPSbEASTCi3bbbUWd78EgbjiUfDVN5qP0Kg/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "empresa": "topbus",
    "dataHora": "2025-11-13T14:30:00",
    "local": "Av. Paulista, 1000 - São Paulo, SP",
    "onibus": "TB-2450",
    "motorista": "Carlos Mendes Silva",
    "chapa": "2450",
    "terceiro": "João Pereira | ABC-1234 | Fiat Uno | (11) 98765-4321",
    "testemunhas": "Maria Santos - (11) 99876-5432 | Roberto Costa - (11) 97654-3210",
    "culpabilidade": "Terceiro",
    "descricao": "Colisão lateral com carro em semáforo vermelho.",
    "images": [],
    "apiKey": "a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812"
  }'
```

## 📊 Dados dos Testes

### Teste #1 - TOPBUS Colisão Lateral
```
Empresa: TOPBUS
Ônibus: TB-2450
Motorista: Carlos Mendes Silva
Local: Av. Paulista, 1000 - São Paulo, SP
Culpabilidade: Terceiro
Descrição: Colisão lateral com carro em semáforo vermelho
```

### Teste #2 - TOPBUS Danos em Estacionamento
```
Empresa: TOPBUS
Ônibus: TB-3310
Motorista: Ricardo Alves Ferreira
Local: Estacionamento Shopping Center - Rua Augusta, 500
Culpabilidade: Motorista
Descrição: Manobra de marcha ré. Motorista não observou carro estacionado
```

### Teste #3 - BELO MONTE Colisão Frontal
```
Empresa: BELO MONTE
Ônibus: BM-1520
Motorista: Antônio Costa Carvalho
Local: BR-116, Km 450 - Juiz de Fora, MG
Culpabilidade: Terceiro
Descrição: Terceiro invadiu faixa. Colisão frontal parcial
```

### Teste #4 - BELO MONTE Ferimento em Passageiro
```
Empresa: BELO MONTE
Ônibus: BM-2105
Motorista: Fábio Mendes Guimarães
Local: Rua Getúlio Vargas, 750 - Belo Horizonte, MG
Culpabilidade: Motorista
Descrição: Freada brusca. Passageira caiu no corredor
```

### Teste #5 - Validação (deve rejeitar)
```
Empresa: [VAZIO] ⚠️
Esperado: Rejeição pela validação
```

## ✅ Verificação de Sucesso

Após executar os testes, verifique:

### 1. Google Sheets
- [ ] Aba "TOPBUS" tem 2 novos registros (Testes #1 e #2)
- [ ] Aba "BELO_MONTE" tem 2 novos registros (Testes #3 e #4)
- [ ] Colunas preenchidas corretamente

### 2. Google Drive
- [ ] Pasta "TOPBUS/SIN-TB-XXXX/" criada
- [ ] Pasta "BELO_MONTE/SIN-BM-XXXX/" criada
- [ ] Subpastas por categoria de sinistro

### 3. Console/Terminal
- [ ] Resposta com status "success": true
- [ ] Protocolo gerado (SIN-TB-XXXX ou SIN-BM-XXXX)
- [ ] Nenhum erro 500

## 🔍 Troubleshooting

### Erro: curl não encontrado (Bash)
```bash
# Ubuntu/Debian
sudo apt-get install curl

# macOS
brew install curl
```

### Erro: jq não encontrado (Bash - opcional)
```bash
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq
```

### Erro: Execução negada (PowerShell)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro: API não responde
- Verifique conexão de internet
- Confirme que URL do Apps Script está correta
- Verifique se Apps Script está reimplantado

### Erro: CORS ou 403
- Reimplante o Apps Script
- Atualize a URL em `teste-*.sh` ou `teste-*.ps1`

## 📈 Próximos Passos

1. ✅ Executar todos os testes (teste-completo.sh ou teste-completo.ps1)
2. ✅ Verificar dados em Google Sheets
3. ✅ Verificar pastas em Google Drive
4. ✅ Testar pelo formulário web (interface React)
5. ✅ Testar filtros de unidade na listagem

## 📚 Documentação Relacionada

- [README.md](../README.md) - Guia completo do projeto
- [DEPLOY_PRONTO.md](../DEPLOY_PRONTO.md) - Deploy no Netlify
- [CONFIGURACAO_FINAL.md](../CONFIGURACAO_FINAL.md) - Credenciais e IDs

---

**Versão**: 2.0.0  
**Última atualização**: Novembro 2025  
**Status**: ✅ Pronto para testes
