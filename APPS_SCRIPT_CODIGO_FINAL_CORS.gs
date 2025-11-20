// ============================================================================
// GOOGLE APPS SCRIPT - TOPBUS SINISTROS v3.3 (CORS FIX)
// Baseado na v3.0 funcional, com remoção de Belo Monte e adição de CORS
// ============================================================================

// IDs da Planilha Google Sheets
const SHEET_ID = '1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo';
const TOPBUS_GID = 0;

// ID da Pasta Google Drive
const DRIVE_FOLDER_ID = '1Qjz3df_WZQOQmt9W_S1M25so4dsMcBT7';

// ============================================================================
// FUNÇÃO OPTIONS (CORS) - ESSENCIAL PARA PREFLIGHT REQUESTS
// ============================================================================
function doOptions(e) {
  return ContentService.createTextOutput()
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ============================================================================
// FUNÇÃO GET - Retorna status da API
// ============================================================================
function doGet(e) {
  const response = ContentService.createTextOutput(JSON.stringify({
    sucesso: true,
    mensagem: "TOPBUS Sinistros API v3.3 - Funcionando",
    status: "online",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
  
  response.addHeader('Access-Control-Allow-Origin', '*');
  return response;
}

// ============================================================================
// FUNÇÃO PRINCIPAL - Receber POST do Formulário (Frontend React)
// ============================================================================
function doPost(e) {
  try {
    if (!e || !e.postData) {
      return responderJSON(false, 'Nenhum dado recebido', null);
    }

    let dados;
    try {
      dados = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return responderJSON(false, 'JSON inválido: ' + parseError.toString(), null);
    }

    // Simplificado: Apenas TOPBUS é aceito
    const empresa = 'TOPBUS';
    const dataHora = dados.data;
    const local = dados.local;
    const onibus = dados.numeroCarro;
    const motorista = dados.motorista;
    const chapa = dados.chapa;
    const responsabilidade = dados.responsabilidade;
    const testemunhas = dados.testemunhas || [];
    const descricao = dados.descricao;

    if (!dataHora || !local || !onibus || !responsabilidade) {
      return responderJSON(false, 'Campos obrigatórios faltando', null);
    }

    const culpabilidade = responsabilidade === 'MOTORISTA_TOPBUS' ? 'Motorista' : 'Terceiro';
    const protocolo = gerarProtocolo(empresa);

    const resultadoSheet = salvarNoSheet({
      empresa: empresa,
      dataHora: dataHora,
      local: local,
      onibus: onibus,
      motorista: motorista,
      chapa: chapa,
      culpabilidade: culpabilidade,
      testemunhas: testemunhas,
      descricao: descricao,
      protocolo: protocolo
    });

    if (resultadoSheet.sucesso) {
      criarPastaGoogleDrive({
        empresa: empresa,
        protocolo: protocolo,
        // Passando todos os dados para o metadata.json
        dataHora: dataHora,
        local: local,
        onibus: onibus,
        motorista: motorista,
        chapa: chapa,
        culpabilidade: culpabilidade,
        testemunhas: testemunhas,
        descricao: descricao
      });

      return responderJSON(true, 'Sinistro registrado com sucesso', {
        protocolo: protocolo,
        empresa: empresa
      });
    } else {
      return responderJSON(false, resultadoSheet.erro, null);
    }

  } catch (erro) {
    Logger.log('Erro em doPost: ' + erro.toString());
    return responderJSON(false, 'Erro ao processar: ' + erro.toString(), null);
  }
}

// ============================================================================
// FUNÇÃO AUXILIAR - Responder em JSON (com CORS)
// ============================================================================
function responderJSON(sucesso, mensagem, dados) {
  const resposta = {
    sucesso: sucesso,
    mensagem: mensagem
  };
  
  if (dados) {
    resposta.dados = dados;
  }
  
  const response = ContentService.createTextOutput(JSON.stringify(resposta))
    .setMimeType(ContentService.MimeType.JSON);
    
  response.addHeader('Access-Control-Allow-Origin', '*');
  return response;
}

// ============================================================================
// GERAR PROTOCOLO ÚNICO (Simplificado para TOPBUS)
// ============================================================================
function gerarProtocolo(empresa) {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  const hora = String(agora.getHours()).padStart(2, '0');
  const minuto = String(agora.getMinutes()).padStart(2, '0');
  const segundo = String(agora.getSeconds()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  return `SIN-TB-${ano}${mes}${dia}-${hora}${minuto}${segundo}-${random}`;
}

// ============================================================================
// SALVAR NO GOOGLE SHEETS (Simplificado para TOPBUS)
// ============================================================================
function salvarNoSheet(dados) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    const abaNome = 'TOPBUS';
    let aba = sheet.getSheetByName(abaNome);

    if (!aba) {
      aba = sheet.insertSheet(abaNome);
      aba.appendRow([
        'ID', 'DataHora', 'Local', 'Onibus', 'Motorista', 'Chapa',
        'Terceiro', 'Testemunhas', 'Descricao', 'Imagens', 'PastaLink'
      ]);
    }

    const testemunhasStr = (dados.testemunhas || [])
      .map(t => `${t.nome} - ${t.telefone}`)
      .join(' | ');

    const novaLinha = [
      dados.protocolo,
      dados.dataHora,
      dados.local,
      dados.onibus,
      dados.motorista,
      dados.chapa,
      dados.culpabilidade,
      testemunhasStr,
      dados.descricao,
      '',
      ''
    ];

    aba.appendRow(novaLinha);

    return { sucesso: true, protocolo: dados.protocolo };

  } catch (erro) {
    Logger.log('Erro ao salvar no Sheet: ' + erro.toString());
    return { sucesso: false, erro: `Erro ao salvar no Sheet: ${erro.toString()}` };
  }
}

// ============================================================================
// CRIAR PASTA NO GOOGLE DRIVE (Simplificado para TOPBUS)
// ============================================================================
function criarPastaGoogleDrive(dados) {
  try {
    const pastaRaiz = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const pastaUnidadeNome = 'TOPBUS';

    let pastaUnidade;
    const pastasUnidade = pastaRaiz.getFoldersByName(pastaUnidadeNome);
    if (pastasUnidade.hasNext()) {
      pastaUnidade = pastasUnidade.next();
    } else {
      pastaUnidade = pastaRaiz.createFolder(pastaUnidadeNome);
    }

    const pastaSinistro = pastaUnidade.createFolder(dados.protocolo);

    const testemunhasStr = (dados.testemunhas || [])
      .map(t => `${t.nome} - ${t.telefone}`)
      .join(' | ');

    const metadataJson = {
      protocolo: dados.protocolo,
      empresa: dados.empresa,
      dataHora: dados.dataHora,
      local: dados.local,
      onibus: dados.onibus,
      motorista: dados.motorista,
      chapa: dados.chapa,
      culpabilidade: dados.culpabilidade,
      testemunhas: testemunhasStr,
      descricao: dados.descricao,
      dataCriacao: new Date().toISOString()
    };

    const blob = Utilities.newBlob(
      JSON.stringify(metadataJson, null, 2),
      'application/json',
      'metadata.json'
    );
    pastaSinistro.createFile(blob);

    return true;

  } catch (erro) {
    Logger.log(`Erro ao criar pasta Drive: ${erro.toString()}`);
    return false;
  }
}

// ============================================================================
// FUNÇÃO DE TESTE
// ============================================================================
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        unidade: 'TOPBUS', // Este campo será ignorado, mas mantido para teste
        data: '2025-11-20T15:00',
        local: 'Av. Faria Lima, 4500 - São Paulo, SP',
        numeroCarro: 'TB-5555',
        motorista: 'Joana D\'arc',
        chapa: '5555',
        responsabilidade: 'MOTORISTA_TOPBUS',
        testemunhas: [{ nome: 'Pedro Alvares', telefone: '(21) 91234-5678' }],
        descricao: 'Teste de colisão traseira.'
      })
    }
  };

  const resultado = doPost(testData);
  Logger.log(resultado.getContent());
}
