#!/bin/bash

# =============================================================================
# TESTE COMPLETO - DISPARA TODOS OS 5 TESTES EM SEQUÊNCIA
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                            ║"
echo "║          🧪 TESTES AUTOMÁTICOS - TOPBUS SINISTROS v2.0                    ║"
echo "║                   Disparo em sequência de 5 testes                         ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar se curl está instalado
if ! command -v curl &> /dev/null; then
  echo "❌ ERRO: curl não está instalado!"
  echo "Instale com: apt-get install curl"
  exit 1
fi

# Verificar se jq está instalado (opcional)
if ! command -v jq &> /dev/null; then
  echo "⚠️  AVISO: jq não está instalado (resposta não será formatada)"
  echo "Instale com: apt-get install jq"
  echo ""
fi

echo "📊 Resumo dos testes que serão executados:"
echo ""
echo "  1️⃣  TOPBUS - Colisão lateral (Terceiro culpado)"
echo "  2️⃣  TOPBUS - Danos em estacionamento (Motorista culpado)"
echo "  3️⃣  [REMOVIDO] Teste Belo Monte"
echo "  4️⃣  [REMOVIDO] Teste Belo Monte"
echo "  5️⃣  [ADICIONAL] Teste de validação de campo obrigatório"
echo ""
echo "─────────────────────────────────────────────────────────────────────────────"
echo ""

# Verificar se scripts existem
for i in 1 2 3 4; do
  if [ ! -f "$SCRIPT_DIR/teste-0$i-*.sh" ]; then
    echo "⚠️  Scripts de teste não encontrados em $SCRIPT_DIR"
  fi
done

# Executar testes
echo "▶️  Iniciando testes..."
echo ""

# Teste 1
if [ -f "$SCRIPT_DIR/teste-01-topbus-colisao.sh" ]; then
  bash "$SCRIPT_DIR/teste-01-topbus-colisao.sh"
  sleep 2
else
  echo "❌ teste-01-topbus-colisao.sh não encontrado"
fi

echo ""

# Teste 2
if [ -f "$SCRIPT_DIR/teste-02-topbus-estacionamento.sh" ]; then
  bash "$SCRIPT_DIR/teste-02-topbus-estacionamento.sh"
  sleep 2
else
  echo "❌ teste-02-topbus-estacionamento.sh não encontrado"
fi

echo ""

# Teste 3
# if [ -f "$SCRIPT_DIR/teste-03-belomonte-colisao-frontal.sh" ]; then
#   bash "$SCRIPT_DIR/teste-03-belomonte-colisao-frontal.sh"
#   sleep 2
# else
#   echo "❌ teste-03-belomonte-colisao-frontal.sh não encontrado"
# fi

echo ""

# Teste 4
# if [ -f "$SCRIPT_DIR/teste-04-belomonte-passageiro.sh" ]; then
#   bash "$SCRIPT_DIR/teste-04-belomonte-passageiro.sh"
#   sleep 2
# else
#   echo "❌ teste-04-belomonte-passageiro.sh não encontrado"
# fi

echo ""
echo "─────────────────────────────────────────────────────────────────────────────"
echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                            ║"
echo "║                    ✅ TODOS OS TESTES CONCLUÍDOS!                         ║"
echo "║                                                                            ║"
echo "║  Verifique:                                                               ║"
echo "║  1. Google Sheets - Aba TOPBUS preenchida                               ║"
echo "║  2. Google Drive - Pastas de sinistros criadas                          ║"
echo "║  3. Console - Verifique respostas acima                                  ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
