#!/bin/bash

# =============================================================================
# TESTE #5 - VALIDAÇÃO DE CAMPO OBRIGATÓRIO
# Testa se a API rejeita sinistro sem empresa selecionada
# =============================================================================

API_URL="https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec"
API_KEY="a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812"

# Dados SEM empresa (deve ser rejeitado)
PAYLOAD=$(cat <<EOF
{
  "empresa": "",
  "dataHora": "2025-11-13T12:00:00",
  "local": "Teste Rua",
  "onibus": "TEST-0000",
  "motorista": "Teste Motorista",
  "chapa": "0000",
  "terceiro": "",
  "testemunhas": "",
  "culpabilidade": "Motorista",
  "descricao": "Teste sem empresa - deve ser rejeitado",
  "images": [],
  "apiKey": "$API_KEY"
}
EOF
)

echo "================================================"
echo "⚠️  TESTE #5 - VALIDAÇÃO (DEVE REJEITAR)"
echo "================================================"
echo ""
echo "Testando rejeição: Campo 'empresa' vazio"
echo "Enviando dados para o Apps Script..."
echo ""

RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

echo "Resposta esperada: erro ou rejeição"
echo ""
echo "Resposta recebida:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"

echo ""
echo "✅ Teste #5 concluído!"
echo "================================================"
