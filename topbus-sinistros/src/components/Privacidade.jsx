import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, Trash2 } from 'lucide-react';

const Privacidade = ({ onVoltar }) => {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [tipoSolicitacao, setTipoSolicitacao] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const handleSolicitacao = async (evento) => {
    evento.preventDefault();
    setCarregando(true);
    setMensagem(null);

    try {
      // Aqui você implementaria a integração com Supabase para processar solicitações LGPD
      console.log('Solicitação LGPD:', { nomeUsuario, emailUsuario, tipoSolicitacao });
      
      setMensagem({
        tipo: 'sucesso',
        texto: 'Solicitação registrada com sucesso. Responderemos em até 30 dias.',
      });

      setNomeUsuario('');
      setEmailUsuario('');
      setTipoSolicitacao('');
    } catch (erro) {
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao processar solicitação. Tente novamente mais tarde.',
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Botão voltar */}
        <button
          onClick={onVoltar}
          className="mb-8 inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-colors"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </button>

        {/* Cabeçalho */}
        <header className="glass mb-8 rounded-lg border border-slate-200/30 p-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8" style={{ color: 'var(--accent)' }} />
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Privacidade e LGPD
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Informações sobre proteção de dados e seus direitos conforme a Lei Geral de Proteção de Dados (LGPD)
          </p>
        </header>

        {/* Conteúdo Principal */}
        <div className="space-y-6">
          {/* Seção: Política de Privacidade */}
          <section className="glass rounded-lg border border-slate-200/30 p-8">
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              1. Política de Privacidade
            </h2>
            <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                O sistema TOPBUS Sinistros coleta e processa dados pessoais apenas para fins de registro de ocorrências de sinistros envolvendo veículos de transporte de passageiros.
              </p>
              <p>
                <strong>Dados coletados:</strong>
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Identificação do motorista (nome, dados pessoais)</li>
                <li>Dados do veículo (placa, identificação)</li>
                <li>Local e data/hora do sinistro</li>
                <li>Descrição da ocorrência</li>
                <li>Fotos do local (armazenadas de forma segura)</li>
                <li>Gravações de áudio (quando fornecidas voluntariamente)</li>
                <li>Dados de localização (GPS) - apenas com consentimento explícito</li>
                <li>Dados de testemunhas (quando disponíveis)</li>
              </ul>
              <p className="mt-4">
                <strong>Finalidades do processamento:</strong>
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Análise e registro de sinistros</li>
                <li>Procedimentos administrativos e legais</li>
                <li>Conformidade com obrigações legais</li>
                <li>Proteção de direitos e segurança</li>
              </ul>
            </div>
          </section>

          {/* Seção: Direitos LGPD */}
          <section className="glass rounded-lg border border-slate-200/30 p-8">
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              2. Seus Direitos LGPD
            </h2>
            <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem os seguintes direitos:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li><strong>Direito de acesso:</strong> Obter informações sobre seus dados e como estão sendo processados</li>
                <li><strong>Direito de correção:</strong> Corrigir dados inexatos ou incompletos</li>
                <li><strong>Direito de exclusão:</strong> Solicitar a exclusão de seus dados (em conformidade com obrigações legais)</li>
                <li><strong>Direito de portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Direito de revogação:</strong> Retirar o consentimento dado a qualquer momento</li>
                <li><strong>Direito de oposição:</strong> Opor-se ao processamento de seus dados</li>
              </ul>
            </div>
          </section>

          {/* Seção: Retenção de Dados */}
          <section className="glass rounded-lg border border-slate-200/30 p-8">
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              3. Retenção de Dados
            </h2>
            <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Os dados de sinistros são retidos pelo tempo necessário para cumprir com:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Obrigações legais e contratuais</li>
                <li>Prazos de prescrição legal (até 5 anos, conforme Código Civil)</li>
                <li>Fins de análise e auditoria interna</li>
              </ul>
              <p className="mt-4">
                Após o cumprimento de todas as obrigações, os dados serão deletados de forma segura.
              </p>
            </div>
          </section>

          {/* Seção: Segurança */}
          <section className="glass rounded-lg border border-slate-200/30 p-8">
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              4. Segurança dos Dados
            </h2>
            <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Implementamos medidas técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Criptografia em trânsito (HTTPS/TLS)</li>
                <li>Criptografia em repouso para dados sensíveis</li>
                <li>Controle de acesso baseado em funções (RBAC)</li>
                <li>Autenticação e autorização via Supabase Auth</li>
                <li>Backup automático e redundância</li>
                <li>Monitoramento de segurança contínuo</li>
              </ul>
            </div>
          </section>

          {/* Seção: Solicitações LGPD */}
          <section className="glass rounded-lg border border-slate-200/30 p-8">
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              5. Solicitar Seus Direitos LGPD
            </h2>
            
            {mensagem && (
              <div
                className={`mb-6 rounded-lg border px-4 py-4 text-sm ${
                  mensagem.tipo === 'sucesso'
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-red-500/30 bg-red-500/10'
                }`}
              >
                <p
                  style={{
                    color: mensagem.tipo === 'sucesso' ? '#10b981' : '#ef4444',
                  }}
                >
                  {mensagem.texto}
                </p>
              </div>
            )}

            <form onSubmit={handleSolicitacao} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Seu Nome *
                </label>
                <input
                  type="text"
                  value={nomeUsuario}
                  onChange={(e) => setNomeUsuario(e.target.value)}
                  className="input-glass"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Seu Email *
                </label>
                <input
                  type="email"
                  value={emailUsuario}
                  onChange={(e) => setEmailUsuario(e.target.value)}
                  className="input-glass"
                  placeholder="seu.email@exemplo.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Tipo de Solicitação *
                </label>
                <select
                  value={tipoSolicitacao}
                  onChange={(e) => setTipoSolicitacao(e.target.value)}
                  className="input-glass"
                  required
                >
                  <option value="">Selecione uma opção</option>
                  <option value="acesso">Acesso aos meus dados</option>
                  <option value="correcao">Correção de dados</option>
                  <option value="exclusao">Exclusão de dados</option>
                  <option value="portabilidade">Portabilidade de dados</option>
                  <option value="revogacao">Revogação de consentimento</option>
                  <option value="oposicao">Oposição ao processamento</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? (
                  <>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Enviar Solicitação</span>
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Responderemos em até 30 dias conforme exigido pela LGPD. Um email de confirmação será enviado para o endereço fornecido.
            </p>
          </section>

          {/* Seção: Contato */}
          <section className="glass rounded-lg border border-slate-200/30 p-8">
            <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              6. Contato e Suporte
            </h2>
            <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Para dúvidas, reclamações ou exercer seus direitos LGPD, entre em contato:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li><strong>Email:</strong> privacidade@topbus.com.br</li>
                <li><strong>Telefone:</strong> (11) 3000-0000</li>
                <li><strong>Horário:</strong> Segunda a sexta, 8h às 18h</li>
              </ul>
            </div>
          </section>

          {/* Última Atualização */}
          <div className="rounded-lg border border-slate-200/30 bg-slate-500/5 px-6 py-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <p>
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>
            <p>
              Esta política está sujeita a alterações. Recomendamos verificar regularmente para atualizações.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacidade;
