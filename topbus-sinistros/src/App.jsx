import React from "react";
import FormularioSinistro from "./components/FormularioSinistro";
import ListaSinistros from "./components/ListaSinistros";
import ThemeToggle from "./components/ThemeToggle";
import Privacidade from "./components/Privacidade";
import { buscarSinistros, inserirSinistro, inserirTestemunhas, uploadImagens, uploadAudio, registrarConsentimentoLGPD } from "./lib/supabase";

const App = () => {
  const [paginaAtual, setPaginaAtual] = React.useState("inicio");
  const [registros, setRegistros] = React.useState([]);
  const [carregandoLista, setCarregandoLista] = React.useState(false);
  const [erroLista, setErroLista] = React.useState(null);

  const carregarRegistros = React.useCallback(async () => {
    setCarregandoLista(true);
    setErroLista(null);

    try {
      const dados = await buscarSinistros();
      setRegistros(Array.isArray(dados) ? dados : []);
    } catch (erro) {
      setErroLista(erro.message || "Erro ao carregar sinistros do Supabase.");
    } finally {
      setCarregandoLista(false);
    }
  }, []);

  React.useEffect(() => {
    carregarRegistros();
  }, [carregarRegistros]);

  const registrarSinistro = async (dados) => {
    try {
      // 1. Inserir sinistro principal
      const sinistro = await inserirSinistro(dados);

      // 2. Registrar consentimento LGPD
      await registrarConsentimentoLGPD(sinistro.id, dados.aceitalGPS);

      // 3. Upload de imagens (se houver)
      if (dados.images && dados.images.length > 0) {
        await uploadImagens(sinistro.id, dados.images);
      }

      // 4. Upload de áudio (se houver)
      if (dados.audio && dados.audio.blob) {
        await uploadAudio(sinistro.id, dados.audio.blob);
      }

      // 5. Recarregar lista
      await carregarRegistros();

      return {
        id: sinistro.protocolo,
        protocolo: sinistro.protocolo,
        message: 'Ocorrência registrada com sucesso!',
      };
    } catch (erro) {
      throw new Error(erro.message || 'Erro ao registrar sinistro no Supabase.');
    }
  };

  return (
    <>
      <ThemeToggle />
      {paginaAtual === "privacidade" ? (
        <Privacidade onVoltar={() => setPaginaAtual("inicio")} />
      ) : (
        <main className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
            <FormularioSinistro
              onSubmit={registrarSinistro}
              onSuccess={() => carregarRegistros()}
            />
            <ListaSinistros
              registros={registros}
              carregando={carregandoLista}
              erro={erroLista}
              onRefresh={carregarRegistros}
            />
            {/* Footer com link de privacidade */}
            <footer className="mt-12 border-t border-slate-200/30 pt-8 text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <button
                onClick={() => setPaginaAtual("privacidade")}
                className="hover:underline transition-colors"
              >
                Política de Privacidade e LGPD
              </button>
              <p className="mt-4">© 2024 TOPBUS Sinistros. Todos os direitos reservados.</p>
            </footer>
          </div>
        </main>
      )}
    </>
  );
};

export default App;
