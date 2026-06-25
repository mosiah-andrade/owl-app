"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import ModalCadastro from "./components/ModalCadastro";
import ListaHoje from "./components/ListaHoje";
import CronogramaGeral from "./components/CronogramaGeral";
import BarraProgresso from "./components/BarraProgresso";
import { Aula } from "./types";
import LembreteNotificacao from "./components/LembreteNotificacao";
import localforage from "localforage";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<"hoje" | "painel">("hoje");
  
  const [disciplinasDisponiveis, setDisciplinasDisponiveis] = useState<string[]>([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("Todas");
  
  // Captura a data local exata (ano-mes-dia) sem sofrer com desvios de fuso horário do UTC à noite
  const hoje = new Date();
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    // Inicializa as configurações do banco localforage/IndexedDB
    localforage.config({ name: "owl_app", storeName: "dados" });

    // Carrega a lista de aulas salvas do IndexedDB
    localforage.getItem<Aula[]>("@owl:aulas").then((dadosSalvos) => {
      if (dadosSalvos) setAulas(dadosSalvos);
    });

    // Carrega a lista de disciplinas customizadas do IndexedDB
    localforage.getItem<string[]>("@owl:disciplinas").then((disciplinasSalvas) => {
      if (disciplinasSalvas) {
        setDisciplinasDisponiveis(disciplinasSalvas);
      } else {
        setDisciplinasDisponiveis(["Farmacologia 💊", "Fisiologia 🧠", "Anatomia 🦴", "Bioquímica 🧪"]);
      }
    });
  }, [isModalOpen]); 

  const calcularDataFutura = (dataBaseStr: string, diasParaSomar: number): string => {
    const data = new Date(dataBaseStr + "T00:00:00");
    data.setDate(data.getDate() + diasParaSomar);
    return data.toISOString().split("T")[0];
  };

  const handleSalvarAula = async (novaAulaDados: Omit<Aula, "id" | "datasRevisao" | "estagioAtual" | "revisoesConcluidas">) => {
    const datasRevisao = {
      r1: calcularDataFutura(novaAulaDados.dataEstudo, 1),
      r7: calcularDataFutura(novaAulaDados.dataEstudo, 7),
      r21: calcularDataFutura(novaAulaDados.dataEstudo, 21),
      r60: calcularDataFutura(novaAulaDados.dataEstudo, 60),
    };

    const novaAula: Aula = {
      id: crypto.randomUUID(),
      ...novaAulaDados,
      datasRevisao,
      estagioAtual: 0,
      revisoesConcluidas: [],
    };

    const listaAtualizada = [...aulas, novaAula];
    setAulas(listaAtualizada);
    
    // Grava de forma assíncrona no IndexedDB
    await localforage.setItem("@owl:aulas", listaAtualizada);

    // Notifica o Service Worker para rodar a verificação imediata caso esteja ativo
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) {
        reg.active.postMessage({ type: "CHECAR_REVISOES_DIARIAS" });
      }
    }
  };

  const obterIdentificadorFaseHoje = (aula: Aula): string => {
    if (aula.dataEstudo === hojeStr) return "estudo";
    if (aula.datasRevisao?.r1 === hojeStr) return "r1";
    if (aula.datasRevisao?.r7 === hojeStr) return "r7";
    if (aula.datasRevisao?.r21 === hojeStr) return "r21";
    if (aula.datasRevisao?.r60 === hojeStr) return "r60";
    return "";
  };

  const aulasDeHoje = aulas.filter((aula) => {
    const faseHoje = obterIdentificadorFaseHoje(aula);
    if (!faseHoje) return false;
    const jaConcluidoHoje = aula.revisoesConcluidas?.includes(faseHoje) || false;
    const mtCicloFinalizado = (aula.estagioAtual ?? 0) >= 4;
    return !jaConcluidoHoje && !mtCicloFinalizado;
  });

  const handleConcluirTarefa = async (aulaId: string) => {
    const listaAtualizada = aulas.map((aula) => {
      if (aula.id !== aulaId) return aula;
      const faseHoje = obterIdentificadorFaseHoje(aula);
      const novasConclusoes = [...(aula.revisoesConcluidas || []), faseHoje];
      return {
        ...aula,
        revisoesConcluidas: novasConclusoes,
        estagioAtual: (aula.estagioAtual ?? 0) + 1,
      };
    });
    
    setAulas(listaAtualizada);
    await localforage.setItem("@owl:aulas", listaAtualizada);
  };

  const obterTextoBadge = (aula: Aula): string => {
    if (aula.dataEstudo === hojeStr) return "Estudo Novo 📝";
    if (aula.datasRevisao?.r1 === hojeStr) return "Revisão 1d ⏳";
    if (aula.datasRevisao?.r7 === hojeStr) return "Revisão 7d 🗓️";
    if (aula.datasRevisao?.r21 === hojeStr) return "Revisão 21d 🧠";
    return "Revisão Final 60d 🎯";
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 min-h-screen pb-16">
      <div className="flex flex-col items-center justify-start w-full max-w-md p-4 font-alan">
        
        {/* CABEÇALHO */}
        <section className="flex flex-col items-start justify-start w-full border border-gray-200 p-6 rounded-2xl shadow-sm bg-white mb-4">
          <div className="flex flex-row items-center justify-start w-full">
            <Image 
              src="/Owl-icon.png" 
              alt="Owl logo" 
              width={70} 
              height={70} 
              priority 
              className="mr-4 h-auto w-auto"
            />  
            <h1 className="text-3xl font-bold text-[var(--color-rosa-500)] tracking-wide">Owl</h1>
          </div>
          <p className="text-gray-400 mt-2 text-xs font-light">Sua central de estudos inteligente</p>
          <button onClick={() => setIsModalOpen(true)} className="w-full mt-4 bg-[var(--color-rosa-500)] text-white py-3 rounded-xl font-bold hover:bg-[var(--color-rosa-600)] transition-colors cursor-pointer shadow-sm">
            + Cadastrar Novo Estudo
          </button>
        </section>

        <LembreteNotificacao aulasDeHoje={aulasDeHoje} />
        <BarraProgresso aulas={aulas} />

        {/* CONTROLE DE ABAS */}
        <div className="flex w-full bg-white border border-gray-200 rounded-xl p-1 mb-4 shadow-sm">
          <button onClick={() => setAbaAtiva("hoje")} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${abaAtiva === "hoje" ? "bg-pink-100 text-pink-700 shadow-xs" : "text-gray-400 hover:text-gray-600"}`}>
            Hoje ({aulasDeHoje.length})
          </button>
          <button onClick={() => setAbaAtiva("painel")} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${abaAtiva === "painel" ? "bg-pink-100 text-pink-700 shadow-xs" : "text-gray-400 hover:text-gray-600"}`}>
            Cronograma Geral ({aulas.length})
          </button>
        </div>

        <ModalCadastro isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSalvar={handleSalvarAula} />

        {/* CONTAINER DO CONTEÚDO DINÂMICO */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 mb-3 gap-2">
            <h2 className="text-lg font-bold text-gray-800">
              {abaAtiva === "hoje" ? "Pendências de Hoje" : "Seu Histórico"}
            </h2>
            
            {abaAtiva === "painel" && (
              <select 
                value={disciplinaSelecionada}
                onChange={(e) => setDisciplinaSelecionada(e.target.value)}
                className="text-xs border border-pink-100 bg-pink-50/40 font-semibold text-pink-700 px-2 py-1 rounded-md focus:outline-none focus:border-pink-400 cursor-pointer"
              >
                <option value="Todas">Todas as Matérias</option>
                {disciplinasDisponiveis.map((disc, idx) => (
                  <option key={idx} value={disc}>{disc}</option>
                ))}
              </select>
            )}
          </div>
          
          {abaAtiva === "hoje" ? (
            <ListaHoje aulas={aulasDeHoje} onConcluir={handleConcluirTarefa} obterTextoBadge={obterTextoBadge} />
          ) : (
            <CronogramaGeral aulas={aulas} disciplinaFiltro={disciplinaSelecionada} />
          )}
        </div>

      </div>
    </div>
  );
}