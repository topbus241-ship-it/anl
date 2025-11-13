// ============================================================================
// TESTE MÍNIMO - Cole este código para testar se o deploy funciona
// ============================================================================

function doPost(e) {
  return ContentService.createTextOutput(JSON.stringify({
    sucesso: true,
    mensagem: "Apps Script está funcionando!",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    sucesso: true,
    mensagem: "GET funcionando!",
    metodo: "GET"
  })).setMimeType(ContentService.MimeType.JSON);
}
