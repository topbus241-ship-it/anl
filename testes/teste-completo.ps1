# =============================================================================
# TESTE COMPLETO - DISPARA TODOS OS 4 TESTES EM SEQUÊNCIA
# PowerShell Script
# =============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════════╗"
Write-Host "║                                                                            ║"
Write-Host "║          🧪 TESTES AUTOMÁTICOS - TOPBUS SINISTROS v2.0                    ║"
Write-Host "║                   Disparo em sequência de 4 testes                         ║"
Write-Host "║                                                                            ║"
Write-Host "╚════════════════════════════════════════════════════════════════════════════╝"
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "📊 Resumo dos testes que serão executados:"
Write-Host ""
Write-Host "  1️⃣  TOPBUS - Colisão lateral (Terceiro culpado)"
Write-Host "  2️⃣  TOPBUS - Danos em estacionamento (Motorista culpado)"
Write-Host "  3️⃣  BELO MONTE - Colisão frontal (Terceiro culpado)"
Write-Host "  4️⃣  BELO MONTE - Ferimento em passageiro (Motorista culpado)"
Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────────────────────"
Write-Host ""

Write-Host "▶️  Iniciando testes..."
Write-Host ""

# Teste 1
Write-Host "Executando Teste #1..."
& "$scriptPath\teste-01-topbus-colisao.ps1"
Start-Sleep -Seconds 2

Write-Host ""

# Teste 2
Write-Host "Executando Teste #2..."
& "$scriptPath\teste-02-topbus-estacionamento.ps1"
Start-Sleep -Seconds 2

Write-Host ""

# Teste 3
Write-Host "Executando Teste #3..."
& "$scriptPath\teste-03-belomonte-colisao-frontal.ps1"
Start-Sleep -Seconds 2

Write-Host ""

# Teste 4
Write-Host "Executando Teste #4..."
& "$scriptPath\teste-04-belomonte-passageiro.ps1"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────────────────────"
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════════╗"
Write-Host "║                                                                            ║"
Write-Host "║                    ✅ TODOS OS TESTES CONCLUÍDOS!                         ║"
Write-Host "║                                                                            ║"
Write-Host "║  Verifique:                                                               ║"
Write-Host "║  1. Google Sheets - Abas TOPBUS e BELO MONTE preenchidas                 ║"
Write-Host "║  2. Google Drive - Pastas de sinistros criadas                           ║"
Write-Host "║  3. Console - Verifique respostas acima                                  ║"
Write-Host "║                                                                            ║"
Write-Host "╚════════════════════════════════════════════════════════════════════════════╝"
Write-Host ""
