// ============================================================================
// GOOGLE APPS SCRIPT - TOPBUS SINISTROS v3.0
// Adaptado para receber dados do Frontend React
// Cole este código completo no Editor Apps Script do seu projeto
// ============================================================================

// IDs da Planilha Google Sheets
const SHEET_ID = '1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo';
const TOPBUS_GID = 0;  // Aba TOPBUS
const BELO_MONTE_GID = 760103440;  // Aba BELO_MONTE

// ID da Pasta Google Drive
const DRIVE_FOLDER_ID = '1AQFiXi9-xDulKgO-qZCF3tRrBIsrWcf4';

// ============================================================================
// FUNÇÃO GET - Retorna status da API
// ============================================================================
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    sucesso: true,
    mensagem: "TOPBUS Sinistros API v3.0 - Funcionando",
    status: "online",
    metodo: "GET",
    timestamp: new Date().toISOString(),
    timezone: "America/Sao_Paulo",
    endpoints: {
      POST: "Enviar dados de sinistro",
      campos_obrigatorios: ["unidade", "data", "local", "numeroCarro", "responsabilidade"]
    }
  })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// FUNÇÃO PRINCIPAL - Receber POST do Formulário (Frontend React)
// ============================================================================
// ESPERADO DO FRONTEND:
// {
//   "unidade": "TOPBUS" | "BELO_MONTE",
//   "data": "2025-11-13T14:30",
//   "local": "Endereço",
//   "numeroCarro": "TB-2450",
//   "motorista": "Nome",
//   "chapa": "2450",
//   "responsabilidade": "MOTORISTA_TOPBUS" | "TERCEIRO",
//   "testemunhas": [{"nome": "X", "telefone": "Y"}],
//   "descricao": "Texto"
// }

function doPost(e) {
  try {
    // Validar entrada
    if (!e || !e.postData) {
      return responderJSON(false, 'Nenhum dado recebido', null);
    }

    // Parse do JSON recebido
    let dados;
    try {
      dados = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return responderJSON(false, 'JSON inválido: ' + parseError.toString(), null);
    }

    // Mapear nomes do frontend para nomenclatura interna
    const empresa = dados.unidade; // "TOPBUS" ou "BELO_MONTE"
    const dataHora = dados.data; // "2025-11-13T14:30"
    const local = dados.local;
    const onibus = dados.numeroCarro; // "TB-2450"
    const motorista = dados.motorista;
    const chapa = dados.chapa;
    const responsabilidade = dados.responsabilidade; // "MOTORISTA_TOPBUS" ou "TERCEIRO"
    const testemunhas = dados.testemunhas || [];
    const descricao = dados.descricao;

    // Validar campos obrigatórios
    if (!empresa || !dataHora || !local || !onibus || !responsabilidade) {
      return responderJSON(false, 'Campos obrigatórios faltando', null);
    }

    // Validar empresa
    const empresaValida = empresa === 'TOPBUS' || empresa === 'BELO_MONTE';
    if (!empresaValida) {
      return responderJSON(false, 'Empresa inválida: ' + empresa, null);
    }

    // Converter responsabilidade para Culpabilidade
    const culpabilidade = responsabilidade === 'MOTORISTA_TOPBUS' ? 'Motorista' : 'Terceiro';

    // Gerar protocolo
    const protocolo = gerarProtocolo(empresa);

    // Salvar no Sheets
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
      // Criar pasta no Drive
      criarPastaGoogleDrive({
        empresa: empresa,
        dataHora: dataHora,
        local: local,
        onibus: onibus,
        motorista: motorista,
        chapa: chapa,
        culpabilidade: culpabilidade,
        protocolo: protocolo
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
// FUNÇÃO AUXILIAR - Responder em JSON
// ============================================================================
function responderJSON(sucesso, mensagem, dados) {
  const resposta = {
    sucesso: sucesso,
    mensagem: mensagem
  };
  
  if (dados) {
    resposta.dados = dados;
  }
  
  return ContentService.createTextOutput(JSON.stringify(resposta))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// GERAR PROTOCOLO ÚNICO
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

  const prefixo = empresa === 'TOPBUS' ? 'SIN-TB' : 'SIN-BM';
  return `${prefixo}-${ano}${mes}${dia}-${hora}${minuto}${segundo}-${random}`;
}

// ============================================================================
// SALVAR NO GOOGLE SHEETS
// Ordem das colunas: ID, DataHora, Local, Onibus, Motorista, Chapa, 
//                    Terceiro, Testemunhas, Descricao, Imagens, PastaLink
// ============================================================================
function salvarNoSheet(dados) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID);

    // Determinar qual aba usar
    let abaNome, abaGid;
    if (dados.empresa === 'TOPBUS') {
      abaNome = 'TOPBUS';
      abaGid = TOPBUS_GID;
    } else {
      abaNome = 'BELO_MONTE';
      abaGid = BELO_MONTE_GID;
    }

    // Obter ou criar aba
    let aba = sheet.getSheetByName(abaNome);
    if (!aba) {
      aba = sheet.insertSheet(abaNome);
      // Adicionar cabeçalho na mesma ordem do Sheets atual
      aba.appendRow([
        'ID',
        'DataHora',
        'Local',
        'Onibus',
        'Motorista',
        'Chapa',
        'Terceiro',
        'Testemunhas',
        'Descricao',
        'Imagens',
        'PastaLink'
      ]);
    }

    // Formatar testemunhas como string
    const testemunhasStr = dados.testemunhas
      .map(t => `${t.nome} - ${t.telefone}`)
      .join(' | ');

    // Preparar dados para salvar na MESMA ORDEM do Sheets
    const novaLinha = [
      dados.protocolo,                    // ID
      dados.dataHora,                     // DataHora
      dados.local,                        // Local
      dados.onibus,                       // Onibus
      dados.motorista,                    // Motorista
      dados.chapa,                        // Chapa
      dados.culpabilidade,                // Terceiro (na verdade é Culpabilidade)
      testemunhasStr,                     // Testemunhas
      dados.descricao,                    // Descricao
      '',                                 // Imagens (vazio por enquanto)
      ''                                  // PastaLink (será preenchido depois)
    ];

    // Adicionar linha à aba
    aba.appendRow(novaLinha);

    return {
      sucesso: true,
      protocolo: dados.protocolo
    };

  } catch (erro) {
    Logger.log('Erro ao salvar no Sheet: ' + erro.toString());
    return {
      sucesso: false,
      erro: `Erro ao salvar no Sheet: ${erro.toString()}`
    };
  }
}

// ============================================================================
// CRIAR PASTA NO GOOGLE DRIVE
// ============================================================================
function criarPastaGoogleDrive(dados) {
  try {
    const pastaRaiz = DriveApp.getFolderById(DRIVE_FOLDER_ID);

    // Determinar nome da pasta unidade
    const pastaUnidadeNome = dados.empresa === 'TOPBUS' ? 'TOPBUS' : 'BELO_MONTE';

    // Encontrar ou criar pasta da unidade
    let pastaUnidade;
    const pastasUnidade = pastaRaiz.getFoldersByName(pastaUnidadeNome);
    if (pastasUnidade.hasNext()) {
      pastaUnidade = pastasUnidade.next();
    } else {
      pastaUnidade = pastaRaiz.createFolder(pastaUnidadeNome);
    }

    // Criar pasta do protocolo
    const pastaSinistro = pastaUnidade.createFolder(dados.protocolo);

    // Criar arquivo de metadata
    const testemunhasStr = dados.testemunhas && dados.testemunhas.length > 0
      ? dados.testemunhas.map(t => `${t.nome} - ${t.telefone}`).join(' | ')
      : '';

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
    // Não falha o processo se Drive não funcionar
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
        unidade: 'TOPBUS',
        data: '2025-11-13T14:30',
        local: 'Av. Paulista, 1000 - São Paulo, SP',
        numeroCarro: 'TB-2450',
        motorista: 'Carlos Mendes Silva',
        chapa: '2450',
        responsabilidade: 'TERCEIRO',
        testemunhas: [
          { nome: 'Maria Santos', telefone: '(11) 99876-5432' },
          { nome: 'Roberto Costa', telefone: '(11) 97654-3210' }
        ],
        descricao: 'Teste de colisão lateral'
      })
    }
  };

  const resultado = doPost(testData);
  Logger.log(resultado.getContent());
}
