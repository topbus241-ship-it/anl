import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Bus,
  Calendar,
  CheckCircle2,
  FileImage,
  FileText,
  Loader2,
  MapPin,
  Trash2,
  Upload,
  User,
} from 'lucide-react';
import GravadorAudio from './GravadorAudio';

const LIMITE_IMAGENS = 10;
const TAMANHO_MAX_EM_BYTES = 5 * 1024 * 1024;

const camposObrigatorios = {
  dataHora: 'Data e hora',
  local: 'Local do acidente',
  onibus: 'Identificação do ônibus',
  motorista: 'Nome do motorista',
  descricao: 'Descrição do ocorrido',
};

const estadoInicial = {
  dataHora: '',
  local: '',
  onibus: '',
  motorista: '',
  terceiro: '',
  testemunhas: '',
  descricao: '',
  aceitalGPS: false,
};

const FormularioSinistro = ({ onSubmit, onSuccess }) => {
  const [formData, setFormData] = useState(estadoInicial);
  const [imagens, setImagens] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const faltandoObrigatorios = useMemo(() => {
    return Object.keys(camposObrigatorios).filter((campo) => !formData[campo]);
  }, [formData]);

  const atualizarCampo = (evento) => {
    const { name, value, type, checked } = evento.target;
    setFormData((anterior) => ({
      ...anterior,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const fileToBase64 = (arquivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(arquivo);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (erroLeitura) => reject(erroLeitura);
    });
  };

  const handleImageUpload = async (evento) => {
    const arquivos = Array.from(evento.target.files);
    setErro(null);

    if (arquivos.length + imagens.length > LIMITE_IMAGENS) {
      setErro('Máximo de 10 imagens permitidas.');
      return;
    }

    const novasImagens = [];
    const novasPreviews = [];

    for (const arquivo of arquivos) {
      if (arquivo.size > TAMANHO_MAX_EM_BYTES) {
        setErro(`Arquivo "${arquivo.name}" excede o limite de 5MB.`);
        continue;
      }

      if (!arquivo.type.startsWith('image/')) {
        setErro(`Arquivo "${arquivo.name}" não é uma imagem válida.`);
        continue;
      }

      try {
        const base64 = await fileToBase64(arquivo);
        const [, payloadBase64] = base64.split(',');

        novasImagens.push({
          filename: arquivo.name,
          mimeType: arquivo.type,
          base64: payloadBase64,
        });

        novasPreviews.push({
          url: base64,
          name: arquivo.name,
        });
      } catch (erroConversao) {
        setErro(`Erro ao processar imagem "${arquivo.name}".`);
        console.error(erroConversao);
      }
    }

    if (novasImagens.length > 0) {
      setImagens((anteriores) => [...anteriores, ...novasImagens]);
      setPreviews((anteriores) => [...anteriores, ...novasPreviews]);
    }
  };

  const removerImagem = (indice) => {
    setImagens((anteriores) => anteriores.filter((_, i) => i !== indice));
    setPreviews((anteriores) => anteriores.filter((_, i) => i !== indice));
  };

  const handleAudioAdicionado = (blob) => {
    setAudioBlob(blob);
  };

  const handleAudioRemovido = () => {
    setAudioBlob(null);
  };

  const validarFormulario = () => {
    if (faltandoObrigatorios.length > 0) {
      const nomesCampos = faltandoObrigatorios
        .map((campo) => camposObrigatorios[campo])
        .join(', ');
      setErro(`Preencha os campos obrigatórios: ${nomesCampos}.`);
      return false;
    }

    if (imagens.length === 0) {
      setErro('Adicione pelo menos uma imagem da ocorrência.');
      return false;
    }

    if (!formData.aceitalGPS) {
      setErro('Você deve aceitar o uso de dados de localização para prosseguir.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setErro(null);
    setResultado(null);

    if (!validarFormulario()) return;

    if (!onSubmit) {
      setErro('Ação de envio não configurada.');
      return;
    }

    setCarregando(true);

    try {
      const payload = {
        ...formData,
        images: imagens,
        audio: audioBlob ? {
          blob: audioBlob,
          filename: `audio-sinistro-${Date.now()}.webm`,
          mimeType: 'audio/webm',
        } : null,
      };

      const resposta = await onSubmit(payload);
      setResultado(resposta || null);

      setFormData(estadoInicial);
      setImagens([]);
      setPreviews([]);
      setAudioBlob(null);

      onSuccess?.(resposta);
    } catch (erroEnvio) {
      setErro(erroEnvio.message || 'Erro ao enviar dados.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="glass animate-fade-in">
      <header className="border-b border-slate-200/30 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-6 py-8 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Bus className="h-8 w-8" style={{ color: 'var(--accent)' }} />
          <div>
            <h1 className="text-2xl font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
              Registro de Ocorrência
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Preencha com atenção todos os dados e fotos para análise
            </p>
          </div>
        </div>
      </header>

      {erro && (
        <div className="mx-6 mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm backdrop-blur-sm animate-fade-in">
          <div className="flex items-center gap-2 font-medium text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{erro}</span>
          </div>
        </div>
      )}

      {resultado && (
        <div className="mx-6 mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-5 text-sm backdrop-blur-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <div className="flex-1">
              <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                Ocorrência registrada com sucesso!
              </p>
              {resultado.id && (
                <p className="mt-2 font-mono text-sm text-emerald-700 dark:text-emerald-300">
                  Protocolo: {resultado.id}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <form className="space-y-6 px-6 py-8" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <Calendar className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              Data e hora da ocorrência *
            </label>
            <input
              type="datetime-local"
              name="dataHora"
              value={formData.dataHora}
              onChange={atualizarCampo}
              className="input-glass"
              required
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <MapPin className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              Local do acidente *
            </label>
            <input
              type="text"
              name="local"
              value={formData.local}
              onChange={atualizarCampo}
              placeholder="Ex: Av. Tancredo Neves, 1234"
              className="input-glass"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <Bus className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              Identificação do ônibus *
            </label>
            <input
              type="text"
              name="onibus"
              value={formData.onibus}
              onChange={atualizarCampo}
              placeholder="Ex: TOP-1234 ou Veículo 101"
              className="input-glass"
              required
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <User className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              Motorista responsável *
            </label>
            <input
              type="text"
              name="motorista"
              value={formData.motorista}
              onChange={atualizarCampo}
              placeholder="Ex: José da Silva"
              className="input-glass"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            <User className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
            Terceiros envolvidos
          </label>
          <input
            type="text"
            name="terceiro"
            value={formData.terceiro}
            onChange={atualizarCampo}
            placeholder="Ex: João Pereira - DEF-5678 - (31) 99999-9999"
            className="input-glass"
          />
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Opcional: informações do terceiro envolvido
          </p>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            <User className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
            Testemunhas
          </label>
          <input
            type="text"
            name="testemunhas"
            value={formData.testemunhas}
            onChange={atualizarCampo}
            placeholder="Ex: Maria Joana - (31) 88888-8888"
            className="input-glass"
          />
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Opcional: nomes e contatos
          </p>
        </div>

        {/* Seção: Descrição + Áudio em Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <FileText className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              Descrição detalhada *
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={atualizarCampo}
              rows={5}
              placeholder="Relate como ocorreu o acidente, condições do tráfego, danos e demais detalhes."
              className="input-glass resize-none"
              required
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Quanto mais detalhes, melhor será a análise
            </p>
          </div>
          
          <div className="lg:col-span-1">
            <GravadorAudio 
              onAudioAdicionado={handleAudioAdicionado}
              onAudioRemovido={handleAudioRemovido}
            />
          </div>
        </div>
        
        {/* Seção: Consentimento LGPS */}
        <div className="rounded-lg border transition p-4" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-glass)' }}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="aceitalGPS"
              checked={formData.aceitalGPS}
              onChange={atualizarCampo}
              className="mt-1 h-5 w-5 rounded transition cursor-pointer"
              style={{
                accentColor: 'var(--accent)',
              }}
              required
            />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Aceito o uso de dados de localização (GPS) para melhorar a precisão do registro. 
              <span className="block text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Meus dados de localização serão coletados apenas durante o envio deste formulário e serão protegidos conforme nossa política de privacidade.
              </span>
            </span>
          </label>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            <FileImage className="h-4 w-4" style={{ color: 'var(--accent)' }} />
            Imagens da ocorrência *
          </label>
          <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-glass)' }}>
            <Upload className="mb-2 h-8 w-8" style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Selecione imagens</span>
            <span className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Máximo de 10 arquivos, até 5MB cada
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {previews.length > 0 && (
            <div className="mt-4">
              <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {previews.length} {previews.length === 1 ? 'imagem selecionada' : 'imagens selecionadas'}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {previews.map((preview, indice) => (
                  <div key={`${preview.name}-${indice}`} className="group relative rounded-lg overflow-hidden">
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removerImagem(indice)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {carregando ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Registrar Ocorrência
            </>
          )}
        </button>

        <p className="text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
          * Campos obrigatórios
        </p>
      </form>
    </section>
  );
};

export default FormularioSinistro;
