import React from "react";
import FormularioSinistro from "./components/FormularioSinistro";
import ListaSinistros from "./components/ListaSinistros";

const API_URL = process.env.REACT_APP_APPS_SCRIPT_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

const App = () => {
  const [registros, setRegistros] = React.useState([]);
  const [carregandoLista, setCarregandoLista] = React.useState(false);
  const [erroLista, setErroLista] = React.useState(null);

  const carregarRegistros = React.useCallback(async () => {
    if (!API_URL || !API_KEY) {
      setErroLista("Configure REACT_APP_APPS_SCRIPT_URL e REACT_APP_API_KEY.");
      return;
    }

    setCarregandoLista(true);
    setErroLista(null);

    try {
      const resposta = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-API-Key": API_KEY,
        },
      });

      if (!resposta.ok) {
        throw new Error(`Falha ao listar: ${resposta.status}`);
      }

      const payload = await resposta.json();
      const dadosLista = Array.isArray(payload)
        ? payload
        : payload?.registros || payload?.sinistros || [];
      setRegistros(Array.isArray(dadosLista) ? dadosLista : []);
    } catch (erro) {
      setErroLista(erro.message || "Erro ao sincronizar registros.");
    } finally {
      setCarregandoLista(false);
    }
  }, []);

  React.useEffect(() => {
    carregarRegistros();
  }, [carregarRegistros]);

  const registrarSinistro = async (dados) => {
    if (!API_URL || !API_KEY) {
      throw new Error("Configure REACT_APP_APPS_SCRIPT_URL e REACT_APP_API_KEY.");
    }

    const bodyPayload = {
      ...dados,
      apiKey: API_KEY,
    };

    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!resposta.ok) {
      throw new Error(`Falha ao registrar: ${resposta.status}`);
    }

    const conteudo = await resposta.json();
    if (conteudo.error) {
      throw new Error(conteudo.message || "Erro ao registrar sinistro.");
    }

    await carregarRegistros();
    return conteudo;
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
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
      </div>
    </main>
  );
};

export default App;
