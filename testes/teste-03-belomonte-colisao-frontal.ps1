# =============================================================================
# TESTE DE SINISTRO - BELO MONTE #1
# Teste com acidente em via
# =============================================================================

$API_URL = "https://script.google.com/macros/s/AKfycbxdZzZrVadSj6j-QYDYg0_XSo2Tc4yiCdPn_OrlUz2N7D7d4Y5VMdfIIQwzBc-TE3LoLA/exec"
$API_KEY = "a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812"

# Dados do sinistro BELO MONTE #1
$payload = @{
    empresa = "belomonte"
    dataHora = "2025-11-13T16:45:00"
    local = "BR-116, Km 450 - Juiz de Fora, MG"
    onibus = "BM-1520"
    motorista = "Antônio Costa Carvalho"
    chapa = "1520"
    terceiro = "Leonardo Santos | GHI-9012 | Volkswagen Saveiro | (32) 98765-4321"
    testemunhas = "Passageiro da BM - (32) 99876-5432 | Testemunha via - (32) 97654-3210"
    culpabilidade = "Terceiro"
    descricao = "Terceiro invadiu faixa. Colisão frontal parcial. Danos em capô e radiador. Acionada polícia. BO 123456/2025."
    images = @()
    apiKey = $API_KEY
} | ConvertTo-Json

Write-Host "================================================"
Write-Host "🏔️ TESTE #3 - BELO MONTE - COLISÃO FRONTAL"
Write-Host "================================================"
Write-Host ""
Write-Host "Enviando dados para o Apps Script..."
Write-Host ""

$response = Invoke-RestMethod -Uri $API_URL -Method Post -ContentType "application/json" -Body $payload

Write-Host "Resposta:"
$response | ConvertTo-Json | Write-Host

Write-Host ""
Write-Host "✅ Teste #3 concluído!"
Write-Host "================================================"
