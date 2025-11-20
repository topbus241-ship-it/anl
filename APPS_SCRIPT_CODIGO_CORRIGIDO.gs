// ============================================================================
// GOOGLE APPS SCRIPT - TOPBUS SINISTROS v3.2
// Corrigido para alinhar com colunas da planilha (incluindo Timestamp)
// ============================================================================

// IDs da Planilha Google Sheets
const SHEET_ID = '1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo';
const TOPBUS_GID = 0;

// ID da Pasta Google Drive
const DRIVE_FOLDER_ID = '1Qjz3df_WZQOQmt9W_S1M25so4dsMcBT7';

// ============================================================================
// FUNÇÃO GET
// ============================================================================
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    sucesso: true,
    mensagem: "TOPBUS Sinistros API v3.2 - Funcionando",
    status: "online",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// FUNÇÃO POST
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

    const empresa = dados.unidade || 'TOPBUS';  // Fixado TOPBUS como padrão
    const dataHora = dados.data;
    const local = dados.local;
    const onibus = dados.numeroCarro;
    const motorista = dados.motorista;
    const chapa = dados.chapa;
    const responsabilidade = dados.responsabilidade;
    const testemunhas = dados.testemunhas || [];
    const descricao = dados.descricao;
    const fotos = dados.fotos || [];

    if (!dataHora || !local || !onibus || !responsabilidade) {
      return responderJSON(false, 'Campos obrigatórios faltando', null);
    }

    const culpabilidade = responsabilidade === 'MOTORISTA_TOPBUS' ? 'Motorista' : 'Terceiro';
    const protocolo = gerarProtocolo('TOPBUS');

    const resultadoSheet = salvarNoSheet({
      empresa: 'TOPBUS',
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

    if (!resultadoSheet.sucesso) {
      return responderJSON(false, resultadoSheet.erro, null);
    }

    let pastaCriada = null;
    let linkPasta = '';
    
    try {
      pastaCriada = criarPastaGoogleDrive({
        empresa: 'TOPBUS',
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
      if (pastaCriada && pastaCriada.url) {
        linkPasta = pastaCriada.url;
      }
    } catch (erroPasta) {
      Logger.log('Erro ao criar pasta: ' + erroPasta.toString());
    }

    let linksImagens = [];
    if (fotos.length > 0 && pastaCriada) {
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
        const pastasSinistro = pastaUnidade.getFoldersByName(protocolo);
        let pastaSinistro;
        if (pastasSinistro.hasNext()) {
          pastaSinistro = pastasSinistro.next();
        } else {
          pastaSinistro = pastaUnidade.createFolder(protocolo);
        }

        fotos.forEach(function(foto) {
          if (foto && foto.dados && foto.nome && foto.tipo) {
            var base64Data = foto.dados.split(',')[1];
            var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), foto.tipo, foto.nome);
            var arquivo = pastaSinistro.createFile(blob);
            linksImagens.push(arquivo.getUrl());
          }
        });
      } catch (erroImg) {
        Logger.log('Erro ao salvar imagens: ' + erroImg.toString());
      }
    }

    if (linksImagens.length > 0 || linkPasta) {
      try {
        const sheet = SpreadsheetApp.openById(SHEET_ID);
        const abaNome = 'TOPBUS';
        const aba = sheet.getSheetByName(abaNome);
        if (aba) {
          const dadosCol = aba.getRange(1, 2, aba.getLastRow(), 1).getValues();
          for (let i = 0; i < dadosCol.length; i++) {
            if (dadosCol[i][0] === protocolo) {
              if (linksImagens.length > 0) {
                aba.getRange(i + 1, 10).setValue(linksImagens.join(' | '));
              }
              if (linkPasta) {
                aba.getRange(i + 1, 11).setValue(linkPasta);
              }
              break;
            }
          }
        }
      } catch (erroPlanilha) {
        Logger.log('Erro ao atualizar links de imagens: ' + erroPlanilha.toString());
      }
    }

    return responderJSON(true, 'Sinistro registrado com sucesso', {
      protocolo: protocolo,
      empresa: 'TOPBUS',
      imagens: linksImagens
    });

  } catch (erro) {
    Logger.log('Erro em doPost: ' + erro.toString());
    return responderJSON(false, 'Erro ao processar: ' + erro.toString(), null);
  }
}

// ============================================================================
// RESPONDER JSON
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
// GERAR PROTOCOLO
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
// SALVAR NO SHEETS - CORRIGIDO PARA TIMESTAMP NA COLUNA A
// Ordem: Timestamp (auto) | ID | DataHora | Local | Onibus | Motorista | 
//        Terceiro | Testemunhas | Descricao | Imagens | PastaLink
// ============================================================================
function salvarNoSheet(dados) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    const abaNome = 'TOPBUS';
    
    let aba = sheet.getSheetByName(abaNome);
    if (!aba) {
      aba = sheet.insertSheet(abaNome);
      aba.appendRow([
        'Timestamp',
        'ID',
        'DataHora',
        'Local',
        'Onibus',
        'Motorista',
        'Terceiro',
        'Testemunhas',
        'Descricao',
        'Imagens',
        'PastaLink'
      ]);
    }

    const testemunhasStr = (Array.isArray(dados.testemunhas) ? dados.testemunhas
      .map(t => `${t.nome} - ${t.telefone}`)
      .join(' | ') : '');

    // IMPORTANTE: Timestamp é gerado automaticamente pelo Google Sheets
    // Não incluir Timestamp no array - o Sheets adiciona automaticamente
    const novaLinha = [
      dados.protocolo,                    // ID (coluna B, mas Sheets vai para A se não tiver Timestamp automático)
      dados.dataHora,                     // DataHora
      dados.local,                        // Local
      dados.onibus,                       // Onibus
      dados.motorista,                    // Motorista
      dados.chapa || '',                  // Chapa (estava faltando!)
      dados.culpabilidade,                // Terceiro
      testemunhasStr,                     // Testemunhas
      dados.descricao,                    // Descricao
      '',                                 // Imagens
      ''                                  // PastaLink
    ];

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
// CRIAR PASTA NO DRIVE
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
      descricao: dados.descricao,
      dataCriacao: new Date().toISOString()
    };

    const blob = Utilities.newBlob(
      JSON.stringify(metadataJson, null, 2),
      'application/json',
      'metadata.json'
    );
    pastaSinistro.createFile(blob);

    return {
      sucesso: true,
      url: pastaSinistro.getUrl()
    };

  } catch (erro) {
    Logger.log(`Erro ao criar pasta Drive: ${erro.toString()}`);
    return {
      sucesso: false,
      url: null
    };
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
        data: '2025-11-17T10:00',
        local: 'Av. Paulista, 1000 - São Paulo, SP',
        numeroCarro: 'TB-2450',
        motorista: 'Carlos Mendes Silva',
        chapa: '2450',
        responsabilidade: 'TERCEIRO',
        testemunhas: [
          { nome: 'Maria Santos', telefone: '(11) 99876-5432' },
          { nome: 'Roberto Costa', telefone: '(11) 97654-3210' }
        ],
        descricao: 'Teste de colisão lateral',
        fotos: []
      })
    }
  };

  const resultado = doPost(testData);
  Logger.log(resultado.getContent());
}
