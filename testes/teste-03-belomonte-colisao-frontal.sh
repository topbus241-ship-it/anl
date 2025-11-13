#!/bin/bash

# =============================================================================
# TESTE DE SINISTRO - BELO MONTE #1
# Teste com acidente em via
# =============================================================================

API_URL="https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec"
API_KEY="a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812"

# Dados do sinistro BELO MONTE #1
PAYLOAD=$(cat <<EOF
{
  "empresa": "belomonte",
  "dataHora": "2025-11-13T16:45:00",
  "local": "BR-116, Km 450 - Juiz de Fora, MG",
  "onibus": "BM-1520",
  "motorista": "Antônio Costa Carvalho",
  "chapa": "1520",
  "terceiro": "Leonardo Santos | GHI-9012 | Volkswagen Saveiro | (32) 98765-4321",
  "testemunhas": "Passageiro da BM - (32) 99876-5432 | Testemunha via - (32) 97654-3210",
  "culpabilidade": "Terceiro",
  "descricao": "Terceiro invadiu faixa. Colisão frontal parcial. Danos em capô e radiador. Acionada polícia. BO 123456/2025.",
  "images": [],
  "apiKey": "$API_KEY"
}
EOF
)

echo "================================================"
echo "🏔️ TESTE #3 - BELO MONTE - COLISÃO FRONTAL"
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
echo "✅ Teste #3 concluído!"
echo "================================================"
