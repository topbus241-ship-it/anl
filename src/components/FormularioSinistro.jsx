import React, { useState, useEffect, useRef } from 'react';
import { FileText, X, ChevronDown, Loader2 } from 'lucide-react';

export default function FormularioSinistros() {
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
  const [fotosPreview, setFotosPreview] = useState([]);
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [telaAtiva, setTelaAtiva] = useState('form');
  const [autenticado, setAutenticado] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [sinistros, setSinistros] = useState([]);
  
  const dropdownRef = useRef(null);

  // URL DO APPS SCRIPT - PREENCHIDA COM O ID CORRETO
  const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec';

  const empresas = [
    { id: 'BELO_MONTE', nome: 'Belo Monte Transportes', cor: '#047857' },
    { id: 'TOPBUS', nome: 'TopBus Transportes', cor: '#1e40af' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAberto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      fotosPreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [fotosPreview]);

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

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setFotos([...fotos, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFotosPreview([...fotosPreview, ...newPreviews]);
  };

  const removerFoto = (index) => {
    URL.revokeObjectURL(fotosPreview[index]);
    setFotos(fotos.filter((_, i) => i !== index));
    setFotosPreview(fotosPreview.filter((_, i) => i !== index));
  };

  const converterParaBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    setErro('');
    
    if (!unidade || !data || !local || !numeroCarro || !responsabilidade) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (fotos.length < 4) {
      setErro('Anexe no mínimo 4 fotos da colisão');
      return;
    }

    try {
      setLoading(true);

      const fotosBase64 = await Promise.all(
        fotos.map(async (foto) => ({
          nome: foto.name,
          dados: await converterParaBase64(foto),
          tipo: foto.type
        }))
      );

      const payload = {
        unidade,
        data,
        local,
        numeroCarro,
        motorista,
        chapa,
        responsabilidade,
        testemunhas: testemunhas.filter(t => t.nome || t.telefone),
        descricao,
        fotos: fotosBase64,
        timestamp: new Date().toISOString(),
        action: 'registrar'
      };

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      alert('Sinistro registrado com sucesso!');
      limpar();
      
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setErro('Erro ao registrar sinistro. Tente novamente.');
    } finally {
      setLoading(false);
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
    fotosPreview.forEach(url => URL.revokeObjectURL(url));
    setFotos([]);
    setFotosPreview([]);
    setGuiaAberto(false);
  };

  const empresaSelecionada = empresas.find(e => e.id === unidade);
  const corPrimaria = empresaSelecionada?.cor || '#1e293b';

  const handleLogin = () => {
    const loginCorreto = import.meta.env.VITE_DASHBOARD_LOGIN || 'sinistro';
    const senhaCorreta = import.meta.env.VITE_DASHBOARD_PASSWORD || '139702';
    
    if (loginInput === loginCorreto && senhaInput === senhaCorreta) {
      setAutenticado(true);
      setTelaAtiva('dashboard');
      carregarSinistros();
      setErro('');
    } else {
      setErro('Login ou senha incorretos');
      setSenhaInput('');
    }
  };

  const handleLogout = () => {
    setAutenticado(false);
    setLoginInput('');
    setSenhaInput('');
    setTelaAtiva('form');
    setSinistros([]);
  };

  const carregarSinistros = async () => {
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=listar`, {
        method: 'GET',
        mode: 'no-cors'
      });
      
      const data = await response.json();
      setSinistros(data.registros || []);
    } catch (error) {
      console.error('Erro ao carregar sinistros:', error);
      setErro('Erro ao carregar registros de sinistros');
    }
  };

  // TELA DE LOGIN
  if (telaAtiva === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-slate-100 p-4 rounded-xl">
              <FileText className="w-10 h-10 text-slate-700" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Acesso ao Dashboard
          </h2>
          
          {erro && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4">
              <p className="text-sm font-semibold text-red-800">{erro}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Login
              </label>
              <input
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-slate-500 focus:ring-4 focus:ring-slate-100 text-sm"
                placeholder="Digite seu login"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={senhaInput}
                onChange={(e) => setSenhaInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-slate-500 focus:ring-4 focus:ring-slate-100 text-sm"
                placeholder="Digite sua senha"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 transition font-semibold"
            >
              Acessar Dashboard
            </button>
            <button
              onClick={() => {
                setTelaAtiva('form');
                setErro('');
              }}
              className="w-full bg-white text-gray-700 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition font-medium"
            >
              Voltar ao Formulário
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TELA DO DASHBOARD
  if (telaAtiva === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-7 h-7 text-slate-700" strokeWidth={1.5} />
                <h1 className="text-xl font-bold text-gray-800">Dashboard de Sinistros</h1>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setTelaAtiva('form');
                    setAutenticado(false);
                  }}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition text-sm font-semibold"
                >
                  Novo Registro
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-gray-700 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {erro && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-red-800">{erro}</p>
            </div>
          )}
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Data/Hora</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nº Carro</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Local</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Motorista</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Responsabilidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sinistros.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        Nenhum sinistro registrado ainda
                      </td>
                    </tr>
                  ) : (
                    sinistros.map((sinistro, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900">{sinistro.data}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            sinistro.unidade === 'TOPBUS' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {sinistro.unidade === 'TOPBUS' ? 'TopBus' : 'Belo Monte'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{sinistro.numeroCarro}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{sinistro.local}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{sinistro.motorista || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            sinistro.responsabilidade === 'MOTORISTA'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sinistro.responsabilidade === 'MOTORISTA' ? 'Motorista' : 'Terceiro'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TELA DO FORMULÁRIO
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
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-hover:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .btn-hover:active:not(:disabled) {
          transform: translateY(0);
        }
        .input-focus {
          transition: all 0.2s ease;
        }
        .input-focus:focus {
          transform: scale(1.01);
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-t-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 sm:px-8 py-6">
            <div className="flex items-center gap-3 justify-between">
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
              <button
                onClick={() => setTelaAtiva('login')}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg backdrop-blur-sm transition-all duration-200 group"
                title="Acesso Gestor"
              >
                <svg className="w-5 h-5 text-white/70 group-hover:text-white transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl shadow-lg">
          <div className="px-6 sm:px-8 py-8 space-y-8">
            
            {erro && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-fadeIn">
                <p className="text-sm font-semibold text-red-800">{erro}</p>
              </div>
            )}

            {/* DROPDOWN DE EMPRESA - CORRIGIDO E DINÂMICO */}
            <div className="animate-fadeIn">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Empresa *
              </label>
              <div className="relative z-10" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownAberto(!dropdownAberto)}
                  className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-gray-400 transition-all duration-200 focus:outline-none focus:border-slate-600 focus:ring-4 focus:ring-slate-100"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownAberto}
                >
                  <span className={`font-medium ${unidade ? 'text-gray-900' : 'text-gray-500'}`}>
                    {empresaSelecionada?.nome || 'Selecione a empresa'}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${dropdownAberto ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {dropdownAberto && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-auto animate-slideDown" style={{ maxHeight: '300px' }}>
                    {empresas.map((empresa) => (
                      <button
                        key={empresa.id}
                        type="button"
                        onClick={() => {
                          setUnidade(empresa.id);
                          setDropdownAberto(false);
                        }}
                        className={`w-full px-5 py-4 text-left transition-all duration-200 flex items-center gap-3 ${
                          unidade === empresa.id 
                            ? 'bg-slate-50 font-semibold' 
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: empresa.cor }}
                        />
                        <span className="text-gray-800">{empresa.nome}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {unidade && (
              <div className="space-y-8 animate-fadeIn" style={{ borderLeftWidth: '4px', borderLeftColor: corPrimaria, paddingLeft: '2rem' }}>
                
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
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-gray-500 focus:ring-4 focus:ring-gray-100 text-sm"
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
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-gray-500 focus:ring-4 focus:ring-gray-100 text-sm"
                      />
                    </div>
                  </div>
                </div>

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
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-gray-500 focus:ring-4 focus:ring-gray-100 text-sm font-medium"
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
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-gray-500 focus:ring-4 focus:ring-gray-100 text-sm"
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
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-gray-500 focus:ring-4 focus:ring-gray-100 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Responsabilidade *
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setResponsabilidade('MOTORISTA')}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 font-semibold text-base btn-hover ${
                        responsabilidade === 'MOTORISTA'
                          ? 'border-transparent shadow-lg'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      style={responsabilidade === 'MOTORISTA' ? { 
                        backgroundColor: `${corPrimaria}15`,
                        borderColor: corPrimaria,
                        color: corPrimaria
                      } : {}}
                    >
                      Motorista da Empresa
                    </button>
                    <button
                      type="button"
                      onClick={() => setResponsabilidade('TERCEIRO')}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 font-semibold text-base btn-hover ${
                        responsabilidade === 'TERCEIRO'
                          ? 'border-transparent shadow-lg'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      style={responsabilidade === 'TERCEIRO' ? { 
                        backgroundColor: `${corPrimaria}15`,
                        borderColor: corPrimaria,
                        color: corPrimaria
                      } : {}}
                    >
                      Terceiro
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    Fotos da Ocorrência *
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Capture 4 ângulos obrigatórios do veículo com avarias</p>
                  
                  {!guiaAberto ? (
                    <button
                      type="button"
                      onClick={() => setGuiaAberto(true)}
                      className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:border-gray-400 transition-all duration-300 btn-hover"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                          style={{ backgroundColor: `${corPrimaria}15` }}>
                          <svg className="w-8 h-8" style={{ color: corPrimaria }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                            <circle cx="12" cy="13" r="3"/>
                          </svg>
                        </div>
                        <span className="text-base font-bold text-gray-800">Iniciar Captura de Fotos</span>
                        <span className="text-sm text-gray-500 mt-1">Clique para ver orientações e fotografar</span>
                      </div>
                    </button>
                  ) : (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
                        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Guia de Captura - Fotografe todos os 4 ângulos
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { titulo: '1. FRENTE', desc: 'Capture a frente completa mostrando para-brisa, faróis e danos frontais' },
                            { titulo: '2. TRASEIRA', desc: 'Fotografe a parte traseira incluindo lanternas e possíveis avarias' },
                            { titulo: '3. LATERAL ESQ.', desc: 'Tire foto do lado esquerdo com todas as janelas e portas visíveis' },
                            { titulo: '4. LATERAL DIR.', desc: 'Capture o lado direito mostrando extensão completa do veículo' }
                          ].map((item, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg mb-3 flex items-center justify-center border-2 border-slate-300">
                                <span className="text-4xl font-bold text-slate-400">{idx + 1}</span>
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-800 block">{item.titulo}</span>
                                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white">
                        <div className="flex flex-col items-center">
                          <label className="cursor-pointer px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 btn-hover shadow-md"
                            style={{ backgroundColor: corPrimaria, color: 'white' }}
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
                              {fotosPreview.map((preview, index) => (
                                <div key={index} className="relative group animate-fadeIn">
                                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md">
                                    <img
                                      src={preview}
                                      alt={`Foto ${index + 1}`}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                  </div>
                                  <button
                                    type="button"
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
                  )}
                </div>

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
                          className="px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-gray-500 focus:ring-4 focus:ring-gray-100 text-sm"
                        />
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            value={testemunha.telefone}
                            onChange={(e) => atualizarTestemunha(index, 'telefone', e.target.value)}
                            placeholder="Telefone"
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-gray-500 focus:ring-4 focus:ring-gray-100 text-sm"
                          />
                          {index > 0 && (
                            <button
                              type="button"
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
                    type="button"
                    onClick={adicionarTestemunha}
                    className="mt-4 text-sm font-semibold hover:underline transition-all duration-200"
                    style={{ color: corPrimaria }}
                  >
                    + Adicionar testemunha
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição Detalhada
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva os detalhes da ocorrência, circunstâncias e informações relevantes..."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl input-focus focus:border-gray-500 focus:ring-4 focus:ring-gray-100 resize-none text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 btn-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: corPrimaria }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Registrar Sinistro'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={limpar}
                    disabled={loading}
                    className="sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-semibold transition-all duration-300 btn-hover disabled:opacity-50"
                  >
                    Limpar Formulário
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Sistema de Gestão de Sinistros © 2025
        </div>
      </div>
    </div>
  );
}
