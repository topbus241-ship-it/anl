# =============================================================================
# TESTE DE SINISTRO - TOPBUS #2
# Teste com danos em estacionamento
# =============================================================================

$API_URL = "https://script.google.com/macros/s/AKfycbxdZzZrVadSj6j-QYDYg0_XSo2Tc4yiCdPn_OrlUz2N7D7d4Y5VMdfIIQwzBc-TE3LoLA/exec"
$API_KEY = "a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812"

# Dados do sinistro TOPBUS #2
$payload = @{
    empresa = "topbus"
    dataHora = "2025-11-13T10:15:00"
    local = "Estacionamento Shopping Center - Rua Augusta, 500"
    onibus = "TB-3310"
    motorista = "Ricardo Alves Ferreira"
    chapa = "3310"
    terceiro = "Marcos Oliveira | XYZ-5678 | Honda Civic | (11) 99999-1111"
    testemunhas = "Funcionário Shopping - (11) 98888-2222"
    culpabilidade = "Motorista"
    descricao = "Manobra de marcha ré. Motorista TOPBUS não observou carro estacionado. Danos traseiros. Motorista responsável."
    images = @()
    apiKey = $API_KEY
} | ConvertTo-Json

Write-Host "================================================"
Write-Host "🚌 TESTE #2 - TOPBUS - DANOS EM ESTACIONAMENTO"
Write-Host "================================================"
Write-Host ""
Write-Host "Enviando dados para o Apps Script..."
Write-Host ""

$response = Invoke-RestMethod -Uri $API_URL -Method Post -ContentType "application/json" -Body $payload

Write-Host "Resposta:"
$response | ConvertTo-Json | Write-Host

Write-Host ""
Write-Host "✅ Teste #2 concluído!"
Write-Host "================================================"
