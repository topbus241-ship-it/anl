
import { useState } from 'react'
import FormularioSinistro from './components/FormularioSinistro'
import ListaSinistros from './components/ListaSinistros'
import BusIcon from './components/BusIcon'

const DASHBOARD_LOGIN = import.meta.env.VITE_DASHBOARD_LOGIN || 'sinistro'
const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || '139702'

export default function App() {
  const [pagina, setPagina] = useState('formulario')
  const [dashboardAuth, setDashboardAuth] = useState(false)
  const [loginInput, setLoginInput] = useState('')
  const [senhaInput, setSenhaInput] = useState('')
  const [erro, setErro] = useState('')

  // Handler para login do painel restrito
  const handleLogin = (e) => {
    e.preventDefault()
    if (loginInput.trim() === DASHBOARD_LOGIN && senhaInput === DASHBOARD_PASSWORD) {
      setDashboardAuth(true)
      setErro('')
    } else {
      setErro('Login ou senha incorretos. Verifique se está digitando exatamente como cadastrado.')
      setSenhaInput('')
    }
  }
  const handleLogout = () => {
    setDashboardAuth(false)
    setLoginInput('')
    setSenhaInput('')
    setPagina('formulario')
  }

  const irParaFormulario = () => {
    setPagina('formulario')
  }

  const irParaDashboard = () => {
    setPagina('dashboard')
  }

  // Navbar visual público
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topo minimalista */}
      <nav className="bg-white/95 border-b border-slate-200 text-slate-900 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BusIcon size={28} color="#0f172a" />
            <span className="text-base sm:text-lg font-semibold tracking-tight select-none">
              Sistema de Gestão de Sinistros
            </span>
          </div>
          {/* Ícone discreto para painel restrito */}
          <button
            aria-label="Acessar painel de gestão"
            onClick={irParaDashboard}
            className={`p-2 rounded-md border border-slate-300 transition-all duration-150 ${
              pagina === 'dashboard' ? 'bg-white shadow-sm' : 'bg-transparent hover:bg-white'
            }`}
            style={{ lineHeight: 0 }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 5.5C4 4.11929 5.11929 3 6.5 3H17.5C18.8807 3 20 4.11929 20 5.5V18.5C20 19.8807 18.8807 21 17.5 21H6.5C5.11929 21 4 19.8807 4 18.5V5.5Z"
                stroke="#0f172a"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 11H15"
                stroke="#0f172a"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M9 15H13"
                stroke="#0f172a"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M8 3V6"
                stroke="#0f172a"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M16 3V6"
                stroke="#0f172a"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      <header className="bg-slate-100/80 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {pagina === 'formulario' ? (
            <>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Formulário público
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">
                  Sistema de Gestão de Sinistros
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl">
                  Utilize este canal oficial para registrar ocorrências operacionais com precisão
                  e segurança. O acompanhamento das análises permanece sob acesso restrito.
                </p>
              </div>
              <button
                onClick={irParaFormulario}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-white"
              >
                Nova Reclamação
              </button>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Área restrita
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">Painel de Gestão</h1>
                <p className="text-sm text-slate-600 max-w-2xl">
                  Acesso reservado à equipe responsável pela análise dos sinistros registrados.
                </p>
              </div>
              <button
                onClick={irParaFormulario}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-white"
              >
                Ir para formulário público
              </button>
            </>
          )}
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="py-8 max-w-5xl mx-auto px-2 sm:px-4">
        {pagina === 'formulario' && <FormularioSinistro />}
        {pagina === 'dashboard' && (
          dashboardAuth ? (
            <>
              <div className="flex justify-end mb-4">
                <button onClick={handleLogout} className="text-xs px-3 py-1 rounded bg-slate-800 text-white hover:bg-black">Sair</button>
              </div>
              <ListaSinistros />
            </>
          ) : (
            <div className="max-w-xs mx-auto mt-12 bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Login</label>
                  <input type="text" value={loginInput} onChange={e => setLoginInput(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-slate-700 text-sm" autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Senha</label>
                  <input type="password" value={senhaInput} onChange={e => setSenhaInput(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-slate-700 text-sm" />
                </div>
                {erro && <div className="text-xs text-red-600 bg-red-50 border-l-2 border-red-400 px-2 py-1 rounded">{erro}</div>}
                <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded font-semibold text-sm hover:bg-black">Acessar Painel</button>
              </form>
              <button
                type="button"
                onClick={irParaFormulario}
                className="mt-4 w-full text-xs font-medium text-slate-500 transition hover:text-slate-700"
              >
                Voltar ao formulário público
              </button>
            </div>
          )
        )}
      </div>

      {/* Footer minimalista */}
      <footer className="bg-slate-900 text-slate-300 py-4 text-center text-xs mt-12 border-t border-slate-800">
        Sistema de Gestão de Sinistros © 2025
      </footer>
    </div>
  )
}
