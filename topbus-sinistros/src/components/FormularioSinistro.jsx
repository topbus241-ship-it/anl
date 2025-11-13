import React, { useMemo, useState } from "react";
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
} from "lucide-react";

const LIMITE_IMAGENS = 10;
const TAMANHO_MAX_EM_BYTES = 5 * 1024 * 1024;

const camposObrigatorios = {
  dataHora: "Data e hora",
  local: "Local do acidente",
  onibus: "Identificacao do onibus",
  motorista: "Nome do motorista",
  descricao: "Descricao do ocorrido",
};

const estadoInicial = {
  dataHora: "",
  local: "",
  onibus: "",
  motorista: "",
  terceiro: "",
  testemunhas: "",
  descricao: "",
};

const FormularioSinistro = ({ onSubmit, onSuccess }) => {
  const [formData, setFormData] = useState(estadoInicial);
  const [imagens, setImagens] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const faltandoObrigatorios = useMemo(() => {
    return Object.keys(camposObrigatorios).filter((campo) => !formData[campo]);
  }, [formData]);

  const atualizarCampo = (evento) => {
    const { name, value } = evento.target;
    setFormData((anterior) => ({ ...anterior, [name]: value }));
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
      setErro("Maximo de 10 imagens permitidas.");
      return;
    }

    const novasImagens = [];
    const novasPreviews = [];

    for (const arquivo of arquivos) {
      if (arquivo.size > TAMANHO_MAX_EM_BYTES) {
        setErro(`Arquivo "${arquivo.name}" excede o limite de 5MB.`);
        continue;
      }

      if (!arquivo.type.startsWith("image/")) {
        setErro(`Arquivo "${arquivo.name}" nao e uma imagem valida.`);
        continue;
      }

      try {
        const base64 = await fileToBase64(arquivo);
        const [, payloadBase64] = base64.split(",");

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
        // eslint-disable-next-line no-console
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

  const validarFormulario = () => {
    if (faltandoObrigatorios.length > 0) {
      const nomesCampos = faltandoObrigatorios
        .map((campo) => camposObrigatorios[campo])
        .join(", ");
      setErro(`Preencha os campos obrigatorios: ${nomesCampos}.`);
      return false;
    }

    if (imagens.length === 0) {
      setErro("Adicione pelo menos uma imagem do sinistro.");
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
      setErro("Acao de envio nao configurada.");
      return;
    }

    setCarregando(true);

    try {
      const payload = {
        ...formData,
        images: imagens,
      };

      const resposta = await onSubmit(payload);
      setResultado(resposta || null);

      setFormData(estadoInicial);
      setImagens([]);
      setPreviews([]);

      onSuccess?.(resposta);
    } catch (erroEnvio) {
      setErro(erroEnvio.message || "Erro ao enviar dados.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow">
      <header className="border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <Bus className="h-9 w-9" />
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide">
              TOPBUS Sinistros
            </h1>
            <p className="text-sm text-blue-100">
              Registro completo de ocorrencias com upload de evidencias
            </p>
          </div>
        </div>
      </header>

      {erro && (
        <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="h-5 w-5" />
            <span>{erro}</span>
          </div>
        </div>
      )}

      {resultado && (
        <div className="mx-6 mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-5 text-sm text-emerald-800">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5" />
            <div className="flex-1">
              <p className="text-base font-semibold">
                Sinistro registrado com sucesso.
              </p>
              {resultado.id && (
                <p className="mt-2 font-mono text-sm text-emerald-700">
                  Protocolo: {resultado.id}
                </p>
              )}
              <div className="mt-3 flex flex-col gap-2">
                {resultado.sheetUrl && (
                  <a
                    href={resultado.sheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-blue-700 hover:underline"
                  >
                    <span role="img" aria-label="planilha">
                      📊
                    </span>
                    Visualizar registro na planilha
                  </a>
                )}
                {resultado.folderUrl && (
                  <a
                    href={resultado.folderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-blue-700 hover:underline"
                  >
                    <span role="img" aria-label="drive">
                      📁
                    </span>
                    Visualizar arquivos no Drive
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-6 px-6 py-8" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Calendar className="h-4 w-4 text-blue-600" />
            Data e hora da ocorrencia *
          </label>
          <input
            type="datetime-local"
            name="dataHora"
            value={formData.dataHora}
            onChange={atualizarCampo}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin className="h-4 w-4 text-blue-600" />
            Local do acidente *
          </label>
          <input
            type="text"
            name="local"
            value={formData.local}
            onChange={atualizarCampo}
            placeholder="Ex: Av. Tancredo Neves, 1234 - proximo ao terminal central"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Bus className="h-4 w-4 text-blue-600" />
              Identificacao do onibus *
            </label>
            <input
              type="text"
              name="onibus"
              value={formData.onibus}
              onChange={atualizarCampo}
              placeholder="Ex: TOP-1234 ou Veiculo 101"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <User className="h-4 w-4 text-blue-600" />
              Motorista responsavel *
            </label>
            <input
              type="text"
              name="motorista"
              value={formData.motorista}
              onChange={atualizarCampo}
              placeholder="Ex: Jose da Silva"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <User className="h-4 w-4 text-slate-400" />
            Terceiros envolvidos
          </label>
          <input
            type="text"
            name="terceiro"
            value={formData.terceiro}
            onChange={atualizarCampo}
            placeholder="Ex: Joao Pereira - DEF-5678 - (31) 99999-9999"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Opcional: informe nome, placa e contato se houver terceiros.
          </p>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <User className="h-4 w-4 text-slate-400" />
            Testemunhas
          </label>
          <input
            type="text"
            name="testemunhas"
            value={formData.testemunhas}
            onChange={atualizarCampo}
            placeholder="Ex: Maria Joana - (31) 88888-8888"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Opcional: informe nome e contato das testemunhas.
          </p>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileText className="h-4 w-4 text-blue-600" />
            Descricao detalhada *
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={atualizarCampo}
            rows={5}
            placeholder="Relate como ocorreu o acidente, condicoes do trafego, danos e demais detalhes."
            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-xs text-slate-500">
            Quanto mais detalhes forem registrados, melhor sera a analise.
          </p>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileImage className="h-4 w-4 text-blue-600" />
            Imagens do sinistro *
          </label>
          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-600 transition hover:border-blue-400 hover:bg-blue-50">
            <Upload className="mb-2 h-7 w-7 text-slate-400" />
            <span>Selecione imagens JPEG ou PNG</span>
            <span className="mt-1 text-xs text-slate-400">
              Maximo de 10 arquivos, cada um com ate 5MB
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
              <p className="mb-3 text-sm text-slate-600">
                {previews.length}{" "}
                {previews.length === 1
                  ? "imagem selecionada"
                  : "imagens selecionadas"}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {previews.map((preview, indice) => (
                  <div key={`${preview.name}-${indice}`} className="group relative">
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="h-32 w-full rounded-lg border border-slate-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removerImagem(indice)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                      title="Remover imagem"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <p
                      className="mt-1 truncate text-xs text-slate-600"
                      title={preview.name}
                    >
                      {preview.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {carregando ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Registrando sinistro...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Registrar sinistro
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500">* Campos obrigatorios</p>
      </form>
    </section>
  );
};

export default FormularioSinistro;
