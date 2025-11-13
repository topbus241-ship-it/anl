import { useState } from 'react';
import { FileText, X, ChevronDown } from 'lucide-react';

export default function FormularioSinistro() {
  const [unidade, setUnidade] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [numeroCarro, setNumeroCarro] = useState('');
  const [motorista, setMotorista] = useState('');
  const [chapa, setChapa] = useState('');
  const [responsabilidade, setResponsabilidade] = useState('');
  const [testemunhas, setTestemunhas] = useState([{ nome: '', telefone: '' }]);
  const [descricao, setDescricao] = useState('');
  const [fotos, setFotos] = useState([]);

  const empresas = [
    { id: 'BELO_MONTE', nome: 'Belo Monte Transportes' },
    { id: 'TOPBUS', nome: 'Consórcio Metropolitano' }
  ];

  const adicionarTestemunha = () => {
    setTestemunhas([...testemunhas, { nome: '', telefone: '' }]);
  };

  const removerTestemunha = (index) => {
    setTestemunhas(testemunhas.filter((_, i) => i !== index));
  };

  const atualizarTestemunha = (index, campo, valor) => {
    const novas = [...testemunhas];
    novas[index][campo] = valor;
    setTestemunhas(novas);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFotos([...fotos, ...files]);
  };

  const removerFoto = (index) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!unidade || !data || !local || !numeroCarro || !responsabilidade) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    if (fotos.length < 4) {
      alert('Anexe no mínimo 4 fotos da colisão.');
      return;
    }

    const payload = {
      unidade,
      data,
      local,
      numeroCarro,
      motorista,
      chapa,
      responsabilidade,
      testemunhas,
      descricao
    };

    try {
      const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.sucesso) {
        alert(`Sinistro registrado com sucesso! Protocolo: ${result.dados.protocolo}`);
        limpar();
      } else {
        alert(`Erro: ${result.mensagem}`);
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      alert('Erro ao enviar dados. Verifique sua conexão.');
    }
  };

  const limpar = () => {
    setUnidade('');
    setData('');
    setLocal('');
    setNumeroCarro('');
    setMotorista('');
    setChapa('');
    setResponsabilidade('');
    setTestemunhas([{ nome: '', telefone: '' }]);
    setDescricao('');
    setFotos([]);
  };

  const coresUnidade = unidade === 'TOPBUS' 
    ? { primary: '#1e40af', secondary: '#3b82f6', light: '#dbeafe', hover: '#1e3a8a' }
    : unidade === 'BELO_MONTE'
    ? { primary: '#047857', secondary: '#10b981', light: '#d1fae5', hover: '#065f46' }
    : { primary: '#1e293b', secondary: '#475569', light: '#f1f5f9', hover: '#0f172a' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-6 sm:py-12 px-4">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .btn-hover:active {
          transform: translateY(0);
        }
        
        .input-focus {
          transition: all 0.2s ease;
        }
        
        .input-focus:focus {
          transform: scale(1.01);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .dropdown-item {
          transition: all 0.2s ease;
        }
        
        .dropdown-item:hover {
          transform: translateX(4px);
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-t-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 sm:px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <FileText className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Sistema de Gestão de Sinistros
                </h1>
                <p className="text-slate-300 text-sm mt-1">Registro e acompanhamento de ocorrências</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl shadow-lg">
          <div className="px-6 sm:px-8 py-8 space-y-8">
            
            {/* Seleção de Empresa */}
            <div className="animate-fadeIn">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Empresa *
              </label>
              <div className="relative">
                <button
                  onClick={() => setDropdownAberto(!dropdownAberto)}
                  className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-gray-400 transition-all duration-200 focus:outline-none focus:border-slate-600 focus:ring-4 focus:ring-slate-100"
                >
                  <span className={`font-medium ${unidade ? 'text-gray-900' : 'text-gray-500'}`}>
                    {unidade ? empresas.find(e => e.id === unidade)?.nome : 'Selecione a empresa'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${dropdownAberto ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownAberto && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-slideDown">
                    {empresas.map((empresa) => (
                      <button
                        key={empresa.id}
                        onClick={() => {
                          setUnidade(empresa.id);
                          setDropdownAberto(false);
                        }}
                        className={`w-full px-5 py-4 text-left dropdown-item ${
                          unidade === empresa.id 
                            ? 'bg-slate-50 text-slate-900 font-semibold' 
                            : 'text-gray-700 hover:bg-slate-50'
                        }`}
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
                  
                  {/* Guia Visual dos Ângulos */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="bg-white border-2 border-gray-300 rounded-xl p-3 text-center hover:border-gray-400 transition-all">
                      <div className="w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg mb-2 flex items-center justify-center p-3 border border-gray-200">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <rect x="25" y="35" width="50" height="45" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="2"/>
                          <rect x="30" y="40" width="40" height="35" rx="2" fill="#64748b"/>
                          <rect x="35" y="45" width="12" height="15" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1"/>
                          <rect x="53" y="45" width="12" height="15" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1"/>
                          <circle cx="38" cy="72" r="4" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5"/>
                          <circle cx="62" cy="72" r="4" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Frente</span>
                    </div>
                    
                    <div className="bg-white border-2 border-gray-300 rounded-xl p-3 text-center hover:border-gray-400 transition-all">
                      <div className="w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg mb-2 flex items-center justify-center p-3 border border-gray-200">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <rect x="25" y="35" width="50" height="45" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="2"/>
                          <rect x="30" y="40" width="40" height="35" rx="2" fill="#64748b"/>
                          <rect x="35" y="45" width="12" height="20" rx="1" fill="#fca5a5" stroke="#dc2626" strokeWidth="1"/>
                          <rect x="53" y="45" width="12" height="20" rx="1" fill="#fca5a5" stroke="#dc2626" strokeWidth="1"/>
                          <circle cx="38" cy="72" r="4" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5"/>
                          <circle cx="62" cy="72" r="4" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Traseira</span>
                    </div>
                    
                    <div className="bg-white border-2 border-gray-300 rounded-xl p-3 text-center hover:border-gray-400 transition-all">
                      <div className="w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg mb-2 flex items-center justify-center p-3 border border-gray-200">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <path d="M 20 45 L 25 35 L 75 35 L 80 45 L 80 70 L 75 75 L 25 75 L 20 70 Z" fill="#334155" stroke="#1e293b" strokeWidth="2"/>
                          <rect x="25" y="40" width="50" height="30" rx="1" fill="#64748b"/>
                          <rect x="30" y="45" width="10" height="12" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8"/>
                          <circle cx="30" cy="72" r="4" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5"/>
                          <circle cx="70" cy="72" r="4" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Lateral Esq.</span>
                    </div>
                    
                    <div className="bg-white border-2 border-gray-300 rounded-xl p-3 text-center hover:border-gray-400 transition-all">
                      <div className="w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg mb-2 flex items-center justify-center p-3 border border-gray-200">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <path d="M 20 45 L 25 35 L 75 35 L 80 45 L 80 70 L 75 75 L 25 75 L 20 70 Z" fill="#334155" stroke="#1e293b" strokeWidth="2"/>
                          <rect x="25" y="40" width="50" height="30" rx="1" fill="#64748b"/>
                          <rect x="60" y="45" width="10" height="12" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8"/>
                          <circle cx="30" cy="72" r="4" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5"/>
                          <circle cx="70" cy="72" r="4" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Lateral Dir.</span>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex flex-col items-center">
                      <label className="cursor-pointer px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 btn-hover shadow-md"
                        style={{ backgroundColor: coresUnidade.primary, color: 'white' }}
                      >
                        Abrir Câmera
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          capture="environment"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-3">A câmera será aberta automaticamente em dispositivos móveis</p>
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
                                <img
                                  src={URL.createObjectURL(foto)}
                                  alt={`Foto ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              </div>
                              <button
                                onClick={() => removerFoto(index)}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-700 btn-hover"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md">
                                {index + 1}
                              </div>
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
                    Testemunhas
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
                              className="px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 btn-hover"
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

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 btn-hover"
                    style={{ backgroundColor: coresUnidade.primary }}
                  >
                    Registrar Sinistro
                  </button>
                  <button
                    onClick={limpar}
                    className="sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-semibold transition-all duration-300 btn-hover"
                  >
                    Limpar Formulário
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Sistema de Gestão de Sinistros © 2025
        </div>
      </div>
    </div>
  );
}
