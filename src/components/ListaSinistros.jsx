import { useState, useEffect } from 'react'
import { Search, ExternalLink, RotateCcw } from 'lucide-react'

const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec'

const EMPRESA_LABELS = {
  topbus: 'Consórcio Metropolitano',
  belomonte: 'Belo Monte Transportes'
}

const EMPRESA_THEMES = {
  topbus: {
    header: 'bg-slate-800',
    badge: 'bg-slate-100 text-slate-700'
  },
  belomonte: {
    header: 'bg-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700'
  },
  default: {
    header: 'bg-slate-700',
    badge: 'bg-slate-100 text-slate-700'
  }
}

export default function ListaSinistros() {
  const [sinistros, setSinistros] = useState([])
  const [filtroEmpresa, setFiltroEmpresa] = useState('all')
  const [busca, setBusca] = useState('')
  const [periodo, setPeriodo] = useState('todos')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const API_CONFIG = {
    URL: import.meta.env.VITE_APPS_SCRIPT_URL || process.env.REACT_APP_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL,
    API_KEY: import.meta.env.VITE_API_KEY || process.env.REACT_APP_API_KEY
  }

  const SHEET_IDS = {
    topbus: 'https://docs.google.com/spreadsheets/d/1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo/edit#gid=0',
    belomonte: 'https://docs.google.com/spreadsheets/d/1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo/edit#gid=760103440'
  }

  useEffect(() => {
    fetchSinistros()
  }, [filtroEmpresa, periodo])

  const fetchSinistros = async () => {
    try {
      setCarregando(true)
      setErro('')
      if (!API_CONFIG.URL) {
        setErro('URL do serviço não configurada.')
        setSinistros([])
        return
      }

      const url = `${API_CONFIG.URL}?empresa=${encodeURIComponent(filtroEmpresa)}&periodo=${encodeURIComponent(periodo)}`
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setSinistros(data.sinistros || [])
      } else {
        setErro(data.error || 'Erro ao carregar sinistros')
        setSinistros([])
      }
    } catch (err) {
      setErro('Erro de conexão: ' + err.message)
      setSinistros([])
    } finally {
      setCarregando(false)
    }
  }

  const sinistrosFiltrados = sinistros.filter((s) => {
    const termo = busca.toLowerCase()
    return (
      (s.protocolo?.toLowerCase().includes(termo) || false) ||
      (s.local?.toLowerCase().includes(termo) || false) ||
      (s.motorista?.toLowerCase().includes(termo) || false)
    )
  })

  const abrirPlanilha = (empresa) => {
    const chave = (empresa || '').toLowerCase()
    if (SHEET_IDS[chave]) {
      window.open(SHEET_IDS[chave], '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">
          Painel de Sinistros
        </h1>

        {erro && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 mb-6 rounded">
            <p className="font-bold uppercase text-xs tracking-wide">Erro</p>
            <p>{erro}</p>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-slate-600"
                placeholder="Buscar protocolo, local..."
              />
            </div>

            {/* Filtro de Unidade */}
            <div>
              <select
                value={filtroEmpresa}
                onChange={(e) => setFiltroEmpresa(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-slate-600"
              >
                <option value="all">Todas as Unidades</option>
                <option value="topbus">Consórcio Metropolitano</option>
                <option value="belomonte">Belo Monte Transportes</option>
              </select>
            </div>

            {/* Filtro de Período */}
            <div>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-slate-600"
              >
                <option value="todos">Todos os períodos</option>
                <option value="hoje">Hoje</option>
                <option value="semana">Última semana</option>
                <option value="mes">Último mês</option>
              </select>
            </div>

            {/* Botão Atualizar */}
            <button
              onClick={fetchSinistros}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Atualizar
            </button>
          </div>
        </div>

        {/* Estado de Carregamento */}
        {carregando && (
          <div className="text-center py-12 text-gray-600">
            <div className="inline-flex items-center gap-2 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
              Carregando sinistros...
            </div>
          </div>
        )}

        {/* Lista de Sinistros */}
        {!carregando && sinistrosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sinistrosFiltrados.map((sinistro) => {
              const empresaKey = (sinistro.empresa || '').toLowerCase()
              const tema = EMPRESA_THEMES[empresaKey] || EMPRESA_THEMES.default
              const etiqueta = EMPRESA_LABELS[empresaKey] || 'Unidade'

              return (
                <div
                  key={sinistro.id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Header */}
                  <div className={`p-4 text-white ${tema.header}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold">{sinistro.protocolo || 'SIN-XXXX'}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tema.badge}`}>
                        {etiqueta}
                      </span>
                    </div>
                    <p className="text-sm opacity-90">{sinistro.dataHora || '—'}</p>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Local</p>
                      <p className="text-gray-800 font-semibold">{sinistro.local || '—'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Ônibus</p>
                        <p className="text-gray-800 font-semibold">{sinistro.onibus || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Motorista</p>
                        <p className="text-gray-800 font-semibold text-sm">{sinistro.motorista || '—'}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Culpabilidade</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          sinistro.culpabilidade === 'Motorista'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {sinistro.culpabilidade || '—'}
                      </span>
                    </div>

                    {sinistro.descricao && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Descrição</p>
                        <p className="text-gray-700 text-sm line-clamp-2">{sinistro.descricao}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 px-4 py-3 flex gap-2">
                    <button
                      onClick={() => abrirPlanilha(sinistro.empresa)}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white px-3 py-2 rounded-lg hover:bg-slate-900 text-sm font-semibold"
                    >
                      <ExternalLink size={16} /> Planilha
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Sem resultados */}
        {!carregando && sinistrosFiltrados.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg font-semibold">Nenhum sinistro encontrado</p>
            <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros</p>
          </div>
        )}
      </div>
    </div>
  )
}
