import { useState, useEffect } from "react";
import localforage from "localforage";
import { Aula, Prova, Revisao } from "../types";

export function useGerenciador() {

  const [provas, setProvas] = useState<Prova[]>([]);

  const [isPomodoroFinished, setIsPomodoroFinished] = useState(false);
  // --- ESTADOS DE DADOS ---
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [disciplinasDisponiveis, setDisciplinasDisponiveis] = useState<string[]>([]);
  
  // NOVOS ESTADOS DO STREAK
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState("");
  
  // --- ESTADOS DE INTERFACE (UI) ---
  const [aulaSelecionada, setAulaSelecionada] = useState<Aula | null>(null);
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGerenciarOpen, setIsGerenciarOpen] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<"hoje" | "painel" | "provas">("hoje");
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("Todas");

  // --- LÓGICA DE DATAS ---
  const hoje = new Date();
  const hojeStr = new Date().toISOString().split("T")[0];

  const calcularDataFutura = (dataBaseStr: string, diasParaSomar: number): string => {
    const data = new Date(dataBaseStr + "T00:00:00");
    data.setDate(data.getDate() + diasParaSomar);
    return data.toISOString().split("T")[0];
  };

  const obterIdentificadorFaseHoje = (aula: Aula): string => {
    if (aula.dataEstudo === hojeStr) return "estudo";
    
    // Procura a revisão correspondente à data de hoje
    const revHoje = Array.isArray(aula.datasRevisao) 
        ? aula.datasRevisao.find(r => r.data === hojeStr) 
        : null;

    if (revHoje) return `r${revHoje.etapa}`; // Retorna "r1", "r2", etc.
    return "";
  };

  const aulasDeHoje = aulas.filter(aula => {
  // 1. É um estudo novo não concluído?
  const estudoHoje = aula.dataEstudo === hojeStr && (aula.estagioAtual ?? 0) === 0;
  
  // 2. É uma revisão de hoje que NÃO foi concluída?
  const temRevisaoPendenteHoje = Array.isArray(aula.datasRevisao) && 
    aula.datasRevisao.some(r => r.data === hojeStr && !r.concluida);
  
  return estudoHoje || temRevisaoPendenteHoje;
});

  // 2. Substitui o obterTextoBadge
    const obterTextoBadge = (aula: Aula): string => {
        if (aula.dataEstudo === hojeStr) return "Estudo Novo 📝";
        
        const revHoje = Array.isArray(aula.datasRevisao) 
            ? aula.datasRevisao.find(r => r.data === hojeStr && !r.concluida) 
            : null;

        if (revHoje) return `Revisão R${revHoje.etapa} ⏳`;
        return "Revisão Pendente";
    };

  // --- EFEITOS DE INICIALIZAÇÃO ---
  useEffect(() => {
    localforage.getItem<Prova[]>("@owl:provas").then((dados) => { if (dados) setProvas(dados); });
    localforage.config({ name: "owl_app", storeName: "dados" });
    localforage.getItem<Aula[]>("@owl:aulas").then((dados) => { if (dados) setAulas(dados); });
    localforage.getItem<string[]>("@owl:disciplinas").then((dados) => {
      if (dados) setDisciplinasDisponiveis(dados);
      else setDisciplinasDisponiveis(["Farmacologia 💊", "Fisiologia 🧠", "Anatomia 🦴", "Bioquímica 🧪"]);
    });
    localforage.getItem<{count: number, date: string}>("@owl:streak").then((dados) => {
      if (dados) {
        // Calcular a data de ontem com segurança
        const ontem = new Date();
        ontem.setDate(ontem.getDate() - 1);
        const ontemStr = `${ontem.getFullYear()}-${String(ontem.getMonth() + 1).padStart(2, '0')}-${String(ontem.getDate()).padStart(2, '0')}`;

        // Só mantém a ofensiva se a última revisão foi hoje ou ontem
        if (dados.date === hojeStr || dados.date === ontemStr) {
          setStreak(dados.count);
          setLastActiveDate(dados.date);
        } else {
          // Passou mais de um dia, a ofensiva foi quebrada
          setStreak(0);
          setLastActiveDate("");
        }
      }
    });
  }, [isModalOpen]); 


  const handleSalvarProva = async (dados: Omit<Prova, "id">) => {
    const novaProva: Prova = { id: crypto.randomUUID(), ...dados };
    const listaAtualizada = [...provas, novaProva];
    setProvas(listaAtualizada);
    await localforage.setItem("@owl:provas", listaAtualizada);
  };

    const handleExcluirProva = async (id: string) => {
    const lista = provas.filter((p) => p.id !== id);
    setProvas(lista);
    await localforage.setItem("@owl:provas", lista);
    };

  // --- FUNÇÕES DE AÇÃO ---
  const abrirDetalhesAula = (aula: Aula) => {
    setAulaSelecionada(aula);
    setIsDetalhesOpen(true);
  };
  // 1. Função auxiliar para calcular datas
const calcularProximasRevisoes = (dataBase: Date): Revisao[] => {
  const dias = [1, 7, 21]; // R1, R2, R3
  return dias.map((d, index) => {
    const novaData = new Date(dataBase);
    novaData.setDate(novaData.getDate() + d);
    return {
      etapa: index + 1,
      data: novaData.toISOString().split("T")[0],
      concluida: false
    };
  });
};

 const handleSalvarAula = async (novaAulaDados: Omit<Aula, "id" | "datasRevisao" | "estagioAtual" | "revisoesConcluidas">) => {
  // Cria o array de revisões baseado na data de estudo
  const novasDatas = calcularProximasRevisoes(new Date(novaAulaDados.dataEstudo));
  
  const novaAula: Aula = { 
    id: crypto.randomUUID(), 
    ...novaAulaDados, 
    datasRevisao: novasDatas, // Agora guarda o array correto
    estagioAtual: 0, 
    revisoesConcluidas: [] 
  };
  
  const lista = [...aulas, novaAula];
  setAulas(lista);
  await localforage.setItem("@owl:aulas", lista);
};

  const handleAtualizarAula = async (aulaAtualizada: Aula) => {
    const lista = aulas.map((a) => (a.id === aulaAtualizada.id ? aulaAtualizada : a));
    setAulas(lista);
    await localforage.setItem("@owl:aulas", lista);
    setIsDetalhesOpen(false);
  };

  const handleExcluirAula = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta aula?")) return;
    const lista = aulas.filter((a) => a.id !== id);
    setAulas(lista);
    await localforage.setItem("@owl:aulas", lista);
    setIsDetalhesOpen(false);
  };

const handleConcluirTarefa = async (aulaId: string) => {
  const lista = aulas.map((aula) => {
    if (aula.id !== aulaId) return aula;

    // Atualiza a etapa atual e marca a revisão de hoje como concluída
    const novasRevisoes = Array.isArray(aula.datasRevisao) 
      ? aula.datasRevisao.map(r => 
          r.data === hojeStr ? { ...r, concluida: true } : r
        )
      : aula.datasRevisao;

    return { 
      ...aula, 
      estagioAtual: (aula.estagioAtual ?? 0) + 1,
      datasRevisao: novasRevisoes
    };
  });
  
  setAulas(lista);
  await localforage.setItem("@owl:aulas", lista);

    // --- NOVA LÓGICA DO STREAK ---
    if (lastActiveDate !== hojeStr) {
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);
      const ontemStr = `${ontem.getFullYear()}-${String(ontem.getMonth() + 1).padStart(2, '0')}-${String(ontem.getDate()).padStart(2, '0')}`;

      // Se a última atividade foi ontem, aumenta. Se não foi, recomeça em 1.
      const novoStreak = (lastActiveDate === ontemStr) ? streak + 1 : 1;
      
      setStreak(novoStreak);
      setLastActiveDate(hojeStr);
      await localforage.setItem("@owl:streak", { count: novoStreak, date: hojeStr });
    }
    setIsPomodoroFinished(false);
  };

  const handleExcluirDisciplina = async (nomeDisciplina: string) => {
    if (!window.confirm(`Excluir a disciplina "${nomeDisciplina}"?`)) return;
    const lista = disciplinasDisponiveis.filter((d) => d !== nomeDisciplina);
    setDisciplinasDisponiveis(lista);
    await localforage.setItem("@owl:disciplinas", lista);
  };

  // --- RETORNO DO HOOK ---
  return {
    provas, setProvas, handleSalvarProva, handleExcluirProva,
    isPomodoroFinished, setIsPomodoroFinished,
    streak, aulas, aulasDeHoje, disciplinasDisponiveis,
    aulaSelecionada, setAulaSelecionada,
    isDetalhesOpen, setIsDetalhesOpen,
    isModalOpen, setIsModalOpen,
    isGerenciarOpen, setIsGerenciarOpen,
    abaAtiva, setAbaAtiva,
    disciplinaSelecionada, setDisciplinaSelecionada,
    obterTextoBadge, abrirDetalhesAula, handleSalvarAula, handleAtualizarAula, handleExcluirAula, handleConcluirTarefa, handleExcluirDisciplina
  };
}