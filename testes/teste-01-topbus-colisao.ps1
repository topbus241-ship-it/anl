# =============================================================================
# TESTE DE SINISTRO - TOPBUS #1
# Teste básico com dados da unidade TOPBUS
# =============================================================================

$API_URL = "https://script.google.com/macros/s/AKfycbynbT_LfA0QClk7u7So3mfL9zjU9Q4Q-SDlPSbEASTCi3bbbUWd78EgbjiUfDVN5qP0Kg/exec"
$API_KEY = "a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812"

# Dados do sinistro TOPBUS #1
$payload = @{
    empresa = "topbus"
    dataHora = "2025-11-13T14:30:00"
    local = "Av. Paulista, 1000 - São Paulo, SP"
    onibus = "TB-2450"
    motorista = "Carlos Mendes Silva"
    chapa = "2450"
    terceiro = "João Pereira | ABC-1234 | Fiat Uno | (11) 98765-4321"
    testemunhas = "Maria Santos - (11) 99876-5432 | Roberto Costa - (11) 97654-3210"
    culpabilidade = "Terceiro"
    descricao = "Colisão lateral com carro em semáforo vermelho. Terceiro atravessou sinal. Danos leves na lataria."
    images = @()
    apiKey = $API_KEY
} | ConvertTo-Json

Write-Host "================================================"
Write-Host "🚌 TESTE #1 - TOPBUS - COLISÃO LATERAL"
Write-Host "================================================"
Write-Host ""
Write-Host "Enviando dados para o Apps Script..."
Write-Host ""

$response = Invoke-RestMethod -Uri $API_URL -Method Post -ContentType "application/json" -Body $payload

Write-Host "Resposta:"
$response | ConvertTo-Json | Write-Host

Write-Host ""
Write-Host "✅ Teste #1 concluído!"
Write-Host "================================================"
