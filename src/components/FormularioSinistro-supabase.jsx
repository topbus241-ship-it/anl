import React, { useState } from 'react'
import { FileText, X, ChevronDown, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function FormularioSinistro() {
  // Estados do formulário
  const [unidade, setUnidade] = useState('')
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [data, setData] = useState('')
  const [local, setLocal] = useState('')
  const [numeroCarro, setNumeroCarro] = useState('')
  const [motorista, setMotorista] = useState('')
  const [chapa, setChapa] = useState('')
  const [responsabilidade, setResponsabilidade] = useState('')
  const [testemunhas, setTestemunhas] = useState([{ nome: '', telefone: '' }])
  const [descricao, setDescricao] = useState('')
  const [fotos, setFotos] = useState([])

  // Estados de controle
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [uploadProgress, setUploadProgress] = useState({})

  const empresas = [
    { id: 'TOPBUS', nome: 'Consórcio Metropolitano' },
    { id: 'BELO_MONTE', nome: 'Belo Monte Transportes' }
  ]

  const opcoesEmpresa = empresas.length > 0 ? empresas : [
    { id: 'GENERICA', nome: 'Empresa' }
  ]

  // Gerenciar cores por empresa
  const coresUnidade = unidade === 'TOPBUS'
    ? { primary: '#0f172a', secondary: '#1e293b', light: '#f1f5f9', hover: '#020617', accent: '#334155' }
    : unidade === 'BELO_MONTE'
      ? { primary: '#1e3a8a', secondary: '#2563eb', light: '#dbeafe', hover: '#1e40af', accent: '#3b82f6' }
      : { primary: '#475569', secondary: '#64748b', light: '#f8fafc', hover: '#334155', accent: '#94a3b8' }

  const adicionarTestemunha = () => {
    setTestemunhas([...testemunhas, { nome: '', telefone: '' }])
  }

  const removerTestemunha = (index) => {
    setTestemunhas(testemunhas.filter((_, i) => i !== index))
  }

  const atualizarTestemunha = (index, campo, valor) => {
    const novas = [...testemunhas]
    novas[index][campo] = valor
    setTestemunhas(novas)
  }

  const handleFileChange = (e) => {
    const arquivos = Array.from(e.target.files || []).map((file) => {
      const preview = URL.createObjectURL(file)
      return Object.assign(file, { preview })
    })
    setFotos([...fotos, ...arquivos])
  }

  const removerFoto = (index) => {
    const arquivo = fotos[index]
    if (arquivo?.preview) {
      URL.revokeObjectURL(arquivo.preview)
    }
    setFotos(fotos.filter((_, i) => i !== index))
  }

  // Gerar protocolo único
  const gerarProtocolo = () => {
    const agora = new Date()
    const ano = agora.getFullYear()
    const mes = String(agora.getMonth() + 1).padStart(2, '0')
    const dia = String(agora.getDate()).padStart(2, '0')
    const horas = String(agora.getHours()).padStart(2, '0')
    const minutos = String(agora.getMinutes()).padStart(2, '0')
    const segundos = String(agora.getSeconds()).padStart(2, '0')
    const aleatorio = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const prefixo = unidade === 'TOPBUS' ? 'TB' : 'BM'
    return `SIN-${prefixo}-${ano}${mes}${dia}-${horas}${minutos}${segundos}-${aleatorio}`
  }

  // Upload de fotos para Storage
  const uploadFotos = async (sinistroId, filesToUpload) => {
    const urlsFotos = []

    for (let i = 0; i < filesToUpload.length; i++) {
      const arquivo = filesToUpload[i]
      try {
        setUploadProgress(prev => ({ ...prev, [i]: 0 }))

        const nomeArquivo = `${sinistroId}/${Date.now()}-${i}-${arquivo.name}`
        const pathStorage = `sinistros/${nomeArquivo}`

        // Upload para Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('sinistros')
          .upload(pathStorage, arquivo, {
            contentType: arquivo.type
          })

        if (uploadError) throw uploadError

        // Obter URL pública
        const { data: publicURL } = supabase.storage
          .from('sinistros')
          .getPublicUrl(pathStorage)

        // Registrar no banco de dados
        const { error: dbError } = await supabase
          .from('imagens')
          .insert({
            sinistro_id: sinistroId,
            nome_arquivo: arquivo.name,
            url_publica: publicURL.publicUrl,
            path_storage: pathStorage,
            tamanho: arquivo.size,
            tipo_mime: arquivo.type
          })

        if (dbError) throw dbError

        urlsFotos.push(publicURL.publicUrl)
        setUploadProgress(prev => ({ ...prev, [i]: 100 }))
      } catch (err) {
        console.error('Erro ao fazer upload da foto:', err)
        throw new Error(`Erro ao fazer upload da foto ${i + 1}: ${err.message}`)
      }
    }

    return urlsFotos
  }

  const handleSubmit = async () => {
    // Validações
    setErro('')
    setSucesso('')

    if (!unidade || !data || !local || !numeroCarro || !responsabilidade) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    if (fotos.length < 4) {
      setErro(`Anexe no mínimo 4 fotos (faltam ${4 - fotos.length}).`)
      return
    }

    if (!testemunhas[0]?.nome) {
      setErro('Adicione pelo menos uma testemunha.')
      return
    }

    setCarregando(true)

    try {
      // 1. Gerar protocolo
      const protocolo = gerarProtocolo()

      // 2. Inserir no Supabase
      const { data: sinistroData, error: sinistroError } = await supabase
        .from('sinistros')
        .insert({
          protocolo,
          data_hora: new Date(data).toISOString(),
          empresa: unidade,
          local_acidente: local,
          onibus: numeroCarro,
          motorista: motorista || 'Não informado',
          chapa: chapa || 'Não informado',
          responsabilidade,
          descricao,
          is_public: false
        })
        .select()

      if (sinistroError) throw sinistroError
      if (!sinistroData || sinistroData.length === 0) throw new Error('Erro ao registrar sinistro')

      const sinistroId = sinistroData[0].id

      // 3. Inserir testemunhas
      const testemunhasParaInserir = testemunhas
        .filter(t => t.nome)
        .map(t => ({
          sinistro_id: sinistroId,
          nome: t.nome,
          telefone: t.telefone || null
        }))

      if (testemunhasParaInserir.length > 0) {
        const { error: testError } = await supabase
          .from('testemunhas')
          .insert(testemunhasParaInserir)

        if (testError) throw testError
      }

      // 4. Upload de fotos
      const fotosFile = fotos.filter(f => f instanceof File)
      if (fotosFile.length > 0) {
        await uploadFotos(sinistroId, fotosFile)
      }

      // Sucesso!
      setSucesso(`✓ Sinistro registrado com sucesso!\nProtocolo: ${protocolo}`)
      limpar()
    } catch (error) {
      console.error('Erro ao enviar sinistro:', error)
      setErro(`Erro ao registrar sinistro: ${error.message}`)
    } finally {
      setCarregando(false)
    }
  }

  const limpar = () => {
    setUnidade('')
    setData('')
    setLocal('')
    setNumeroCarro('')
    setMotorista('')
    setChapa('')
    setResponsabilidade('')
    setTestemunhas([{ nome: '', telefone: '' }])
    setDescricao('')
    fotos.forEach((arquivo) => {
      if (arquivo?.preview) {
        URL.revokeObjectURL(arquivo.preview)
      }
    })
    setFotos([])
    setUploadProgress({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-6 sm:py-12 px-4">
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .btn-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
        .input-focus { transition: all 0.2s ease; }
        .input-focus:focus { transform: scale(1.01); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Mensagens de Feedback */}
        {erro && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg animate-fadeIn">
            <p className="font-bold text-sm">⚠ Erro</p>
            <p className="text-sm whitespace-pre-wrap">{erro}</p>
          </div>
        )}

        {sucesso && (
          <div className="mb-4 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg animate-fadeIn">
            <p className="font-bold text-sm">✓ Sucesso</p>
            <p className="text-sm whitespace-pre-wrap">{sucesso}</p>
          </div>
        )}

        {/* Formulário Principal */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-slate-50 px-6 sm:px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <FileText className="w-5 h-5 text-slate-600" strokeWidth={1.6} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Registro de Sinistro</h2>
                <p className="text-sm text-slate-600">
                  Preencha todos os campos obrigatórios para registrar o sinistro com segurança.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-8 space-y-8">
            {/* Seleção de Empresa */}
            <div className="animate-fadeIn">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Empresa *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownAberto((v) => !v)}
                  className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-gray-400 transition-all duration-200 focus:outline-none focus:border-slate-600 focus:ring-4 focus:ring-slate-100"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownAberto}
                >
                  <span className={`font-medium ${unidade ? 'text-gray-900' : 'text-gray-500'}`}>
                    {unidade ? opcoesEmpresa.find(e => e.id === unidade)?.nome : 'Selecione a empresa'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${dropdownAberto ? 'rotate-180' : ''}`} />
                </button>
                {dropdownAberto && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-slideDown" role="listbox">
                    {opcoesEmpresa.map((empresa) => (
                      <button
                        key={empresa.id}
                        type="button"
                        onClick={() => {
                          setUnidade(empresa.id)
                          setDropdownAberto(false)
                        }}
                        className={`w-full px-5 py-4 text-left ${
                          unidade === empresa.id
                            ? 'bg-slate-50 text-slate-900 font-semibold'
                            : 'text-gray-700 hover:bg-slate-50'
                        }`}
                        role="option"
                        aria-selected={unidade === empresa.id}
                      >
                        {empresa.nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {unidade && (
              <div className="space-y-8 animate-fadeIn" style={{ borderLeftWidth: '4px', borderLeftColor: coresUnidade.primary, paddingLeft: '2rem' }}>
                {/* Dados do Sinistro */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Dados do Sinistro
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Data e Hora *
                      </label>
                      <input
                        type="datetime-local"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Local *
                      </label>
                      <input
                        type="text"
                        value={local}
                        onChange={(e) => setLocal(e.target.value)}
                        placeholder="Endereço completo da ocorrência"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Dados do Veículo */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Dados do Veículo
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nº do Carro *
                      </label>
                      <input
                        type="text"
                        value={numeroCarro}
                        onChange={(e) => setNumeroCarro(e.target.value)}
                        placeholder="Ex: 1001"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-transparent text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Motorista
                      </label>
                      <input
                        type="text"
                        value={motorista}
                        onChange={(e) => setMotorista(e.target.value)}
                        placeholder="Nome completo"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Chapa
                      </label>
                      <input
                        type="text"
                        value={chapa}
                        onChange={(e) => setChapa(e.target.value)}
                        placeholder="Nº da chapa"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Responsabilidade */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Responsabilidade *
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setResponsabilidade('MOTORISTA_TOPBUS')}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 font-semibold text-base btn-hover ${
                        responsabilidade === 'MOTORISTA_TOPBUS'
                          ? 'border-transparent shadow-lg'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      style={responsabilidade === 'MOTORISTA_TOPBUS' ? {
                        backgroundColor: coresUnidade.light,
                        borderColor: coresUnidade.primary,
                        color: coresUnidade.primary
                      } : {}}
                    >
                      Motorista da Empresa
                    </button>
                    <button
                      onClick={() => setResponsabilidade('TERCEIRO')}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 font-semibold text-base btn-hover ${
                        responsabilidade === 'TERCEIRO'
                          ? 'border-transparent shadow-lg'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      style={responsabilidade === 'TERCEIRO' ? {
                        backgroundColor: coresUnidade.light,
                        borderColor: coresUnidade.primary,
                        color: coresUnidade.primary
                      } : {}}
                    >
                      Terceiro
                    </button>
                  </div>
                </div>

                {/* Fotos */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    Fotos da Ocorrência *
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Fotografe os 4 ângulos obrigatórios do veículo</p>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex flex-col items-center">
                      <label className="cursor-pointer px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 btn-hover shadow-md flex items-center gap-2"
                        style={{ backgroundColor: coresUnidade.primary, color: 'white' }}
                      >
                        <Upload size={20} />
                        Adicionar Fotos
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          capture="environment"
                          onChange={handleFileChange}
                          disabled={carregando}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-3">Máximo 4 fotos por sinistro</p>
                    </div>

                    {fotos.length > 0 && (
                      <div className="mt-6 animate-fadeIn">
                        <div className="flex items-center justify-between mb-4 px-2">
                          <span className="text-sm font-bold text-gray-800">
                            {fotos.length} {fotos.length === 1 ? 'foto' : 'fotos'}
                          </span>
                          {fotos.length < 4 ? (
                            <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                              Faltam {4 - fotos.length}
                            </span>
                          ) : (
                            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                              ✓ Completo
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {fotos.map((foto, index) => (
                            <div key={index} className="relative group animate-fadeIn">
                              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md">
                                {foto.preview && (
                                  <img
                                    src={foto.preview}
                                    alt={`Foto ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                )}
                              </div>
                              <button
                                onClick={() => removerFoto(index)}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md">
                                {index + 1}
                              </div>

                              {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                                  <div className="text-white text-xs font-bold">{uploadProgress[index]}%</div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Testemunhas */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Testemunhas *
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </h3>
                  <div className="space-y-3">
                    {testemunhas.map((testemunha, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                        <input
                          type="text"
                          value={testemunha.nome}
                          onChange={(e) => atualizarTestemunha(index, 'nome', e.target.value)}
                          placeholder="Nome da testemunha"
                          className="px-4 py-3 border-2 border-gray-300 rounded-xl input-focus text-sm"
                        />
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            value={testemunha.telefone}
                            onChange={(e) => atualizarTestemunha(index, 'telefone', e.target.value)}
                            placeholder="Telefone"
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl input-focus text-sm"
                          />
                          {index > 0 && (
                            <button
                              onClick={() => removerTestemunha(index)}
                              className="px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={adicionarTestemunha}
                    className="mt-4 text-sm font-semibold hover:underline transition-all duration-200"
                    style={{ color: coresUnidade.primary }}
                  >
                    + Adicionar testemunha
                  </button>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição Detalhada
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva os detalhes da ocorrência, circunstâncias e informações relevantes..."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus resize-none text-sm"
                  />
                </div>

                {/* Botão Enviar */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    disabled={carregando}
                    className="flex-1 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: coresUnidade.primary }}
                  >
                    {carregando ? 'Enviando...' : 'Registrar Sinistro'}
                  </button>
                  <button
                    onClick={limpar}
                    disabled={carregando}
                    className="px-8 py-4 rounded-xl font-bold text-gray-700 border-2 border-gray-300 transition-all duration-300 btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
