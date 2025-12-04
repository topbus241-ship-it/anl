import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente Supabase não configuradas!');
  console.error('Configure REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY em .env.local');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Funções auxiliares para integração Supabase
 */

/**
 * Inserir nova ocorrência de sinistro
 */
export const inserirSinistro = async (dados) => {
  try {
    const { data, error } = await supabase
      .from('sinistros')
      .insert([{
        data_hora: dados.dataHora,
        local_acidente: dados.local,
        onibus: dados.onibus,
        motorista: dados.motorista,
        responsabilidade: dados.responsabilidade || 'motorista',
        descricao: dados.descricao,
        empresa: 'TOPBUS',
      }])
      .select('id, protocolo')
      .single();

    if (error) throw error;
    return data;
  } catch (erro) {
    console.error('Erro ao inserir sinistro:', erro);
    throw erro;
  }
};

/**
 * Inserir testemunhas
 */
export const inserirTestemunhas = async (sinistroId, testemunhas) => {
  if (!testemunhas || testemunhas.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from('testemunhas')
      .insert(
        testemunhas.map((t) => ({
          sinistro_id: sinistroId,
          nome: t.nome,
          telefone: t.telefone,
        }))
      )
      .select();

    if (error) throw error;
    return data;
  } catch (erro) {
    console.error('Erro ao inserir testemunhas:', erro);
    throw erro;
  }
};

/**
 * Upload de imagens para Supabase Storage
 */
export const uploadImagens = async (sinistroId, imagens) => {
  if (!imagens || imagens.length === 0) return [];

  try {
    const uploads = [];

    for (const imagem of imagens) {
      const nomeArquivo = `${sinistroId}/${Date.now()}-${imagem.filename}`;
      
      // Converter base64 para Blob
      const byteCharacters = atob(imagem.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: imagem.mimeType });

      // Upload para Supabase Storage
      const { data, error } = await supabase.storage
        .from('sinistros')
        .upload(nomeArquivo, blob, {
          contentType: imagem.mimeType,
        });

      if (error) throw error;

      uploads.push({
        sinistro_id: sinistroId,
        nome_arquivo: imagem.filename,
        path_storage: data.path,
        tamanho: blob.size,
        tipo_mime: imagem.mimeType,
      });
    }

    // Inserir metadados no banco
    const { data, error } = await supabase
      .from('imagens')
      .insert(uploads)
      .select();

    if (error) throw error;
    return data;
  } catch (erro) {
    console.error('Erro ao fazer upload de imagens:', erro);
    throw erro;
  }
};

/**
 * Upload de áudio para Supabase Storage
 */
export const uploadAudio = async (sinistroId, audioBlob) => {
  if (!audioBlob) return null;

  try {
    const nomeArquivo = `${sinistroId}/audio-${Date.now()}.webm`;

    const { data, error } = await supabase.storage
      .from('sinistros')
      .upload(nomeArquivo, audioBlob, {
        contentType: 'audio/webm',
      });

    if (error) throw error;

    // Inserir metadados
    const { data: metaData, error: metaError } = await supabase
      .from('documentos_complementares')
      .insert([{
        sinistro_id: sinistroId,
        tipo: 'audio',
        nome_arquivo: `audio-${Date.now()}.webm`,
        path_storage: data.path,
        tamanho: audioBlob.size,
        tipo_mime: 'audio/webm',
      }])
      .select()
      .single();

    if (metaError) throw metaError;
    return metaData;
  } catch (erro) {
    console.error('Erro ao fazer upload de áudio:', erro);
    throw erro;
  }
};

/**
 * Buscar todos os sinistros
 */
export const buscarSinistros = async () => {
  try {
    const { data, error } = await supabase
      .from('sinistros')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (erro) {
    console.error('Erro ao buscar sinistros:', erro);
    throw erro;
  }
};

/**
 * Buscar sinistro com detalhes (testemunhas + imagens)
 */
export const buscarSinistroDetalhes = async (id) => {
  try {
    const { data: sinistro, error: erroSinistro } = await supabase
      .from('sinistros')
      .select('*')
      .eq('id', id)
      .single();

    if (erroSinistro) throw erroSinistro;

    const { data: testemunhas, error: erroTest } = await supabase
      .from('testemunhas')
      .select('*')
      .eq('sinistro_id', id);

    if (erroTest) throw erroTest;

    const { data: imagens, error: erroImg } = await supabase
      .from('imagens')
      .select('*')
      .eq('sinistro_id', id);

    if (erroImg) throw erroImg;

    return {
      ...sinistro,
      testemunhas,
      imagens,
    };
  } catch (erro) {
    console.error('Erro ao buscar detalhes do sinistro:', erro);
    throw erro;
  }
};

/**
 * Deletar sinistro (solicitação LGPD)
 */
export const deletarSinistro = async (id) => {
  try {
    // Deletar cascata: testemunhas e imagens serão deletadas automaticamente via FK
    const { error } = await supabase
      .from('sinistros')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (erro) {
    console.error('Erro ao deletar sinistro:', erro);
    throw erro;
  }
};

/**
 * Registrar consentimento LGPD
 */
export const registrarConsentimentoLGPD = async (sinistroId, aceito, ip = null) => {
  try {
    const { data, error } = await supabase
      .from('consentimentos_lgpd')
      .insert([{
        sinistro_id: sinistroId,
        aceito,
        data_consentimento: new Date().toISOString(),
        ip_usuario: ip,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (erro) {
    console.error('Erro ao registrar consentimento LGPD:', erro);
    throw erro;
  }
};

export default supabase;
