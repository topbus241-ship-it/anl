# =============================================================================
# TESTE DE SINISTRO - BELO MONTE #2
# Teste com danos em passageiro
# =============================================================================

$API_URL = "https://script.google.com/macros/s/AKfycbxdZzZrVadSj6j-QYDYg0_XSo2Tc4yiCdPn_OrlUz2N7D7d4Y5VMdfIIQwzBc-TE3LoLA/exec"
$API_KEY = "a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812"

# Dados do sinistro BELO MONTE #2
$payload = @{
    empresa = "belomonte"
    dataHora = "2025-11-13T11:20:00"
    local = "Rua Getúlio Vargas, 750 - Belo Horizonte, MG"
    onibus = "BM-2105"
    motorista = "Fábio Mendes Guimarães"
    chapa = "2105"
    terceiro = "Pedestre não identificado"
    testemunhas = "Passageiras Bus - (31) 99876-5432 | Motorista táxi - (31) 98765-4321"
    culpabilidade = "Motorista"
    descricao = "Freada brusca. Passageira caiu no corredor do ônibus. Ferimento leve em braço. Encaminhada para UPA."
    images = @()
    apiKey = $API_KEY
} | ConvertTo-Json

Write-Host "================================================"
Write-Host "🏔️ TESTE #4 - BELO MONTE - DANOS EM PASSAGEIRO"
Write-Host "================================================"
Write-Host ""
Write-Host "Enviando dados para o Apps Script..."
Write-Host ""

$response = Invoke-RestMethod -Uri $API_URL -Method Post -ContentType "application/json" -Body $payload

Write-Host "Resposta:"
$response | ConvertTo-Json | Write-Host

Write-Host ""
Write-Host "✅ Teste #4 concluído!"
Write-Host "================================================"
