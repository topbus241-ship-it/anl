#!/bin/bash

# =============================================================================
# TESTE DE SINISTRO - BELO MONTE #2
# Teste com danos em passageiro
# =============================================================================

API_URL="https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec"
API_KEY="a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812"

# Dados do sinistro BELO MONTE #2
PAYLOAD=$(cat <<EOF
{
  "empresa": "belomonte",
  "dataHora": "2025-11-13T11:20:00",
  "local": "Rua Getúlio Vargas, 750 - Belo Horizonte, MG",
  "onibus": "BM-2105",
  "motorista": "Fábio Mendes Guimarães",
  "chapa": "2105",
  "terceiro": "Pedestre não identificado",
  "testemunhas": "Passageiras Bus - (31) 99876-5432 | Motorista táxi - (31) 98765-4321",
  "culpabilidade": "Motorista",
  "descricao": "Freada brusca. Passageira caiu no corredor do ônibus. Ferimento leve em braço. Encaminhada para UPA.",
  "images": [],
  "apiKey": "$API_KEY"
}
EOF
)

echo "================================================"
echo "🏔️ TESTE #4 - BELO MONTE - DANOS EM PASSAGEIRO"
echo "================================================"
echo ""
echo "Enviando dados para o Apps Script..."
echo ""

RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

echo "Resposta:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"

echo ""
echo "✅ Teste #4 concluído!"
echo "================================================"
