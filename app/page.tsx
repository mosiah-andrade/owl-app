"use client";
import { useGerenciador } from "./hooks/useGerenciador";

// Componentes da Interface
import Cabecalho from "./components/Cabecalho";
import ControleAbas from "./components/ControleAbas";
import LembreteNotificacao from "./components/LembreteNotificacao";
import BarraProgresso from "./components/BarraProgresso";
import ListaHoje from "./components/ListaHoje";
import CronogramaGeral from "./components/CronogramaGeral";
import PomodoroTimer from "./components/PomodoroTimer";
import ListaProvas from "./components/ListaProvas";

// Modais
import ModalCadastro from "./components/ModalCadastro";
import ModalDetalhesAula from "./components/ModalDetalhesAula";
import ModalGerenciarMaterias from "./components/ModalGerenciarMaterias";

export default function Home() {
  const G = useGerenciador(); // "G" de Gerenciador. Importamos tudo de uma vez!

  return (
    <div className="flex items-center justify-center bg-gray-50 min-h-screen pb-16">
      <div className="flex flex-col items-center justify-start w-full max-w-md p-4 font-alan">
        
        <Cabecalho onAbrirCadastro={() => G.setIsModalOpen(true)} streak={G.streak} />
        <LembreteNotificacao aulasDeHoje={G.aulasDeHoje} />
        <BarraProgresso aulas={G.aulas} />

        <PomodoroTimer onPomodoroEnd={() => G.setIsPomodoroFinished(true)} />
        
        <ControleAbas 
          abaAtiva={G.abaAtiva} 
          setAbaAtiva={G.setAbaAtiva} 
          qtdHoje={G.aulasDeHoje.length} 
          qtdTotal={G.aulas.length} 
          qtdProvas={G.provas.length}
        />

        {/* MODAIS */}
        <ModalCadastro 
          isOpen={G.isModalOpen} 
          onClose={() => G.setIsModalOpen(false)} 
          onSalvar={(dados, tipo) => {
            if (tipo === "aula") {
              G.handleSalvarAula(dados); // Sua função atual de salvar aula
            } else {
              G.handleSalvarProva(dados); // Sua nova função de salvar prova no hook
            }
          }} 
        />
        <ModalDetalhesAula isOpen={G.isDetalhesOpen} onClose={() => G.setIsDetalhesOpen(false)} aula={G.aulaSelecionada} onAtualizar={G.handleAtualizarAula} onExcluir={G.handleExcluirAula} />
        <ModalGerenciarMaterias isOpen={G.isGerenciarOpen} onClose={() => G.setIsGerenciarOpen(false)} disciplinas={G.disciplinasDisponiveis} onExcluir={G.handleExcluirDisciplina} />

        {/* CONTEÚDO DINÂMICO (HOJE vs CRONOGRAMA) */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 mb-3 gap-2">
            <h2 className="text-lg font-bold text-gray-800">
              {G.abaAtiva === "hoje" ? "Pendências de Hoje" : "Seu Histórico"}
            </h2>
            
            {G.abaAtiva === "painel" && (
              <div className="flex items-center gap-2">
                <select 
                  value={G.disciplinaSelecionada}
                  onChange={(e) => G.setDisciplinaSelecionada(e.target.value)}
                  className="text-xs border border-pink-100 bg-pink-50/40 font-semibold text-pink-700 px-2 py-1.5 rounded-md focus:outline-none focus:border-pink-400 cursor-pointer"
                >
                  <option value="Todas">Todas as Matérias</option>
                  {G.disciplinasDisponiveis.map((disc, idx) => (
                    <option key={idx} value={disc}>{disc}</option>
                  ))}
                </select>
                
                <button 
                  onClick={() => G.setIsGerenciarOpen(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center justify-center"
                  title="Gerenciar matérias"
                >
                  ⚙️
                </button>
              </div>
            )}
          </div>
          
          {G.abaAtiva === "provas" ? (
              <ListaProvas provas={G.provas} onExcluir={G.handleExcluirProva} />
            ) : G.abaAtiva === "hoje" ? (
            <ListaHoje 
              aulas={G.aulasDeHoje} 
              onConcluir={G.handleConcluirTarefa} 
              obterTextoBadge={G.obterTextoBadge} 
              onAbrirDetalhes={G.abrirDetalhesAula}
              isPomodoroFinished={G.isPomodoroFinished} 
            />
          ) : (
            <CronogramaGeral aulas={G.aulas} disciplinaFiltro={G.disciplinaSelecionada} onAbrirDetalhes={G.abrirDetalhesAula} />
          )}
        </div>

      </div>
    </div>
  );
}