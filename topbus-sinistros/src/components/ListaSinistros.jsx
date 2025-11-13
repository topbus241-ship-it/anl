import React from "react";
import {
  AlertCircle,
  Bus,
  Calendar,
  ExternalLink,
  Filter,
  FileImage,
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  User,
} from "lucide-react";

const normalizar = (valor) =>
  String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const obterData = (valor) => {
  if (!valor) return null;
  const data = valor instanceof Date ? valor : new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
};

const ListaSinistros = ({
  registros = [],
  carregando = false,
  erro = null,
  onRefresh,
}) => {
  const [busca, setBusca] = React.useState("");
  const [filtroPeriodo, setFiltroPeriodo] = React.useState("todos");

  const listaRegistros = Array.isArray(registros) ? registros : [];
  const totalRegistros = listaRegistros.length;

  const registrosFiltrados = React.useMemo(() => {
    const agora = new Date();
    const termo = normalizar(busca);

    const filtrados = listaRegistros
      .filter((registro) => {
        if (!termo) return true;
        const texto = normalizar(
          [
            registro.id,
            registro.protocolo,
            registro.local,
            registro.onibus,
            registro.placa,
            registro.motorista,
            registro.terceiro,
            registro.testemunhas,
            registro.descricao,
            registro.status,
          ]
            .filter(Boolean)
            .join(" ")
        );
        return texto.includes(termo);
      })
      .filter((registro) => {
        if (filtroPeriodo === "todos") return true;
        const dataRegistro = obterData(
          registro.dataHora ||
            registro.ocorrenciaEm ||
            registro.ocorridoEm ||
            registro.atualizadoEm
        );
        if (!dataRegistro) return false;
        const diffDias = Math.floor(
          (agora - dataRegistro) / (1000 * 60 * 60 * 24)
        );
        if (filtroPeriodo === "hoje") return diffDias === 0;
        if (filtroPeriodo === "semana") return diffDias <= 7;
        if (filtroPeriodo === "mes") return diffDias <= 30;
        return true;
      })
      .sort((a, b) => {
        const dataA = obterData(
          a.timestamp || a.atualizadoEm || a.dataHora || a.ocorrenciaEm
        );
        const dataB = obterData(
          b.timestamp || b.atualizadoEm || b.dataHora || b.ocorrenciaEm
        );
        return (dataB?.getTime() || 0) - (dataA?.getTime() || 0);
      });

    return filtrados;
  }, [listaRegistros, busca, filtroPeriodo]);

  const formatarData = (valor) => {
    const data = obterData(valor);
    if (!data) return "Data nao informada";
    try {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(data);
    } catch (erroFormatacao) {
      return String(valor);
    }
  };

  if (carregando && totalRegistros === 0) {
    return (
      <section className="flex min-h-[320px] items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8 shadow">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg font-semibold text-slate-700">
            Carregando sinistros...
          </p>
          <p className="text-sm text-slate-500">
            Aguarde enquanto buscamos os dados mais recentes.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow">
      <div className="rounded-xl border border-white/60 bg-white shadow-lg">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Bus className="h-10 w-10 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Sinistros registrados
              </h2>
              <p className="text-sm text-slate-500">
                {totalRegistros}{" "}
                {totalRegistros === 1
                  ? "ocorrencia cadastrada"
                  : "ocorrencias cadastradas"}
              </p>
            </div>
          </div>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={carregando}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <RefreshCw
                className={`h-4 w-4 ${carregando ? "animate-spin" : ""}`}
              />
              Atualizar
            </button>
          )}
        </div>

        {erro && (
          <div className="mx-6 mt-6 rounded border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">Erro ao carregar dados.</p>
                <p className="mt-1">{erro}</p>
                {onRefresh && (
                  <button
                    type="button"
                    onClick={onRefresh}
                    className="mt-3 inline-flex items-center text-sm font-medium text-red-600 hover:underline"
                  >
                    Tentar novamente
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 px-6 py-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                placeholder="Buscar por protocolo, local, onibus ou motorista..."
                className="w-full rounded-lg border border-slate-300 px-10 py-3 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:w-56">
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  value={filtroPeriodo}
                  onChange={(evento) => setFiltroPeriodo(evento.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-10 py-3 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos os periodos</option>
                  <option value="hoje">Hoje</option>
                  <option value="semana">Ultima semana</option>
                  <option value="mes">Ultimo mes</option>
                </select>
              </div>
            </div>
          </div>

          {busca && (
            <p className="text-sm text-slate-500">
              {registrosFiltrados.length === 0
                ? "Nenhum resultado encontrado para a busca atual."
                : `${registrosFiltrados.length} ${
                    registrosFiltrados.length === 1
                      ? "resultado encontrado"
                      : "resultados encontrados"
                  }`}
            </p>
          )}

          {carregando && totalRegistros > 0 && (
            <div className="flex items-center gap-2 rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              Sincronizando registros recentes...
            </div>
          )}

          {registrosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
              {busca ? (
                <>
                  <Search className="mb-4 h-16 w-16 text-slate-300" />
                  <p className="text-lg font-semibold text-slate-600">
                    Nenhum resultado encontrado
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Tente usar outros termos ou filtros.
                  </p>
                </>
              ) : (
                <>
                  <FileText className="mb-4 h-16 w-16 text-slate-300" />
                  <p className="text-lg font-semibold text-slate-600">
                    Nenhum sinistro cadastrado
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Os registros aparecerao aqui assim que forem criados.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {registrosFiltrados.map((sinistro, indice) => {
                const id = sinistro.id || sinistro.protocolo || "Nao informado";
                const protocolo =
                  sinistro.protocolo && sinistro.protocolo !== id
                    ? sinistro.protocolo
                    : null;
                const linkDrive = sinistro.pastaLink || sinistro.folderUrl;
                const linkPlanilha = sinistro.sheetUrl;
                const imagensLista =
                  sinistro.imagens ||
                  sinistro.imageUrls ||
                  sinistro.images ||
                  [];

                return (
                  <article
                    key={`${id}-${indice}`}
                    className="rounded-lg border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-bold uppercase text-white">
                            {id}
                          </span>
                          {protocolo && (
                            <span className="rounded-full border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700">
                              Protocolo: {protocolo}
                            </span>
                          )}
                          <span className="text-sm text-slate-500">
                            Registrado em:{" "}
                            {formatarData(
                              sinistro.timestamp ||
                                sinistro.atualizadoEm ||
                                sinistro.dataHora
                            )}
                          </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="flex items-start gap-2">
                            <Calendar className="mt-1 h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Data e hora da ocorrencia
                              </p>
                              <p className="text-sm text-slate-700">
                                {formatarData(
                                  sinistro.dataHora || sinistro.ocorrenciaEm
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin className="mt-1 h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Local do acidente
                              </p>
                              <p className="text-sm text-slate-700">
                                {sinistro.local || "Nao informado"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Bus className="mt-1 h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Onibus
                              </p>
                              <p className="text-sm text-slate-700">
                                {sinistro.onibus ||
                                  sinistro.placa ||
                                  "Nao informado"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <User className="mt-1 h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Motorista
                              </p>
                              <p className="text-sm text-slate-700">
                                {sinistro.motorista || "Nao informado"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {sinistro.terceiro && (
                          <div className="rounded border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                              Terceiro envolvido
                            </p>
                            <p className="mt-1">{sinistro.terceiro}</p>
                          </div>
                        )}

                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Descricao do ocorrido
                          </p>
                          <p className="mt-2 text-sm text-slate-700">
                            {sinistro.descricao || "Sem descricao fornecida."}
                          </p>
                        </div>

                        {sinistro.testemunhas && (
                          <p className="text-sm text-slate-600">
                            <span className="font-semibold">Testemunhas:</span>{" "}
                            {sinistro.testemunhas}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 md:w-56">
                        {linkPlanilha && (
                          <a
                            href={linkPlanilha}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Planilha
                          </a>
                        )}

                        {linkDrive && (
                          <a
                            href={linkDrive}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Pasta no Drive
                          </a>
                        )}

                        {Array.isArray(imagensLista) &&
                          imagensLista.length > 0 && (
                            <div className="max-h-36 overflow-y-auto rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                              <p className="mb-2 flex items-center gap-2 font-semibold">
                                <FileImage className="h-4 w-4" />
                                {imagensLista.length}{" "}
                                {imagensLista.length === 1
                                  ? "imagem"
                                  : "imagens"}
                              </p>
                              <div className="space-y-1">
                                {imagensLista.slice(0, 5).map((imagem, idx) => (
                                  <a
                                    key={`${id}-imagem-${idx}`}
                                    href={imagem}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block truncate text-xs text-blue-700 hover:underline"
                                  >
                                    Imagem {idx + 1}
                                  </a>
                                ))}
                                {imagensLista.length > 5 && (
                                  <p className="text-xs text-slate-500">
                                    +{imagensLista.length - 5} arquivos
                                    adicionais
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <footer className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-500">
          Sistema TOPBUS (c) 2025 -{" "}
          {registrosFiltrados.length === totalRegistros
            ? `Exibindo ${totalRegistros} sinistros`
            : `Exibindo ${registrosFiltrados.length} de ${totalRegistros} sinistros`}
        </footer>
      </div>
    </section>
  );
};

export default ListaSinistros;
