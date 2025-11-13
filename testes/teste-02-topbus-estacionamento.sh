#!/bin/bash

# =============================================================================
# TESTE DE SINISTRO - TOPBUS #2
# Teste com danos em estacionamento
# =============================================================================

API_URL="https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec"
API_KEY="a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812"

# Dados do sinistro TOPBUS #2
PAYLOAD=$(cat <<EOF
{
  "empresa": "topbus",
  "dataHora": "2025-11-13T10:15:00",
  "local": "Estacionamento Shopping Center - Rua Augusta, 500",
  "onibus": "TB-3310",
  "motorista": "Ricardo Alves Ferreira",
  "chapa": "3310",
  "terceiro": "Marcos Oliveira | XYZ-5678 | Honda Civic | (11) 99999-1111",
  "testemunhas": "Funcionário Shopping - (11) 98888-2222",
  "culpabilidade": "Motorista",
  "descricao": "Manobra de marcha ré. Motorista TOPBUS não observou carro estacionado. Danos traseiros. Motorista responsável.",
  "images": [],
  "apiKey": "$API_KEY"
}
EOF
)

echo "================================================"
echo "🚌 TESTE #2 - TOPBUS - DANOS EM ESTACIONAMENTO"
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
echo "✅ Teste #2 concluído!"
echo "================================================"
