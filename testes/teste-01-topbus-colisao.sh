#!/bin/bash

# =============================================================================
# TESTE DE SINISTRO - TOPBUS #1
# Teste básico com dados da unidade TOPBUS
# =============================================================================

API_URL="https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec"
API_KEY="a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812"

# Dados do sinistro TOPBUS #1
PAYLOAD=$(cat <<EOF
{
  "empresa": "topbus",
  "dataHora": "2025-11-13T14:30:00",
  "local": "Av. Paulista, 1000 - São Paulo, SP",
  "onibus": "TB-2450",
  "motorista": "Carlos Mendes Silva",
  "chapa": "2450",
  "terceiro": "João Pereira | ABC-1234 | Fiat Uno | (11) 98765-4321",
  "testemunhas": "Maria Santos - (11) 99876-5432 | Roberto Costa - (11) 97654-3210",
  "culpabilidade": "Terceiro",
  "descricao": "Colisão lateral com carro em semáforo vermelho. Terceiro atravessou sinal. Danos leves na lataria.",
  "images": [],
  "apiKey": "$API_KEY"
}
EOF
)

echo "================================================"
echo "🚌 TESTE #1 - TOPBUS - COLISÃO LATERAL"
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
echo "✅ Teste #1 concluído!"
echo "================================================"
